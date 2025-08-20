<script>
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { select, selectAll } from "d3-selection";
  import { axisBottom, axisLeft } from "d3-axis";
  import { line } from "d3-shape";
  import { interpolateBlues } from "d3-scale-chromatic";
  import { scaleSequential, scaleLinear } from "d3-scale";
  import { max, min } from "d3-array";

  let gaussianSvg;
  let likelihoodSvg;
  let demo;
  let numPoints = 500;

  onMount(async () => {
    if (!browser) return;

    class GaussianOptimizationDemo {
      constructor() {
        this.width = 400;
        this.height = 400;
        this.margin = { top: 20, right: 20, bottom: 40, left: 40 };
        this.plotWidth = this.width - this.margin.left - this.margin.right;
        this.plotHeight = this.height - this.margin.top - this.margin.bottom;

        // Store D3 functions
        this.select = select;
        this.selectAll = selectAll;
        this.axisBottom = axisBottom;
        this.axisLeft = axisLeft;
        this.line = line;
        this.interpolateBlues = interpolateBlues;
        this.scaleSequential = scaleSequential;
        this.scaleLinear = scaleLinear;
        this.max = max;
        this.min = min;

        // True parameters (fixed)
        this.trueMean = [0, 0];
        this.trueCov = [[1, 0.3], [0.3, 1]];

        // Model parameters (to be optimized)
        this.modelMean = [0, 0];
        this.modelCov = [[1, 0], [0, 1]];

        // Optimization state
        this.step = 0;
        this.logLikelihoods = [];
        this.isRunning = false;
        this.meanLearningRate = 0.1;  // Natural gradient allows larger steps for mean
        this.covLearningRate = 0.01;   // Smaller rate for covariance to maintain stability

        // Generate data points
        this.generateData(500);
        this.initializePlots();
        this.reset();
      }
      
      generateData(numPoints = 500) {
        this.dataPoints = [];
        this.numPoints = numPoints;

        for (let i = 0; i < this.numPoints; i++) {
          const point = this.sampleFromGaussian(this.trueMean, this.trueCov);
          this.dataPoints.push(point);
        }
      }
      
      sampleFromGaussian(mean, cov) {
        // Box-Muller transform for 2D correlated Gaussian
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
        
        // Apply covariance transformation
        const L = this.choleskyDecomposition(cov);
        const x = mean[0] + L[0][0] * z0 + L[0][1] * z1;
        const y = mean[1] + L[1][0] * z0 + L[1][1] * z1;
        
        return [x, y];
      }
      
      choleskyDecomposition(matrix) {
        const a = matrix[0][0];
        const c = matrix[1][0];
        const d = matrix[1][1];
        
        const l11 = Math.sqrt(a);
        const l21 = c / l11;
        const l22 = Math.sqrt(d - l21 * l21);
        
        return [[l11, 0], [l21, l22]];
      }
      
      initializePlots() {
        // Initialize Gaussian plot
        this.gaussianSvg = this.select(gaussianSvg);
        this.gaussianG = this.gaussianSvg.append("g")
          .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

        // Scales for Gaussian plot
        this.xScale = this.scaleLinear()
          .domain([-4, 4])
          .range([0, this.plotWidth]);

        this.yScale = this.scaleLinear()
          .domain([-4, 4])
          .range([this.plotHeight, 0]);

        // Add axes to Gaussian plot
        this.gaussianG.append("g")
          .attr("class", "x-axis")
          .attr("transform", `translate(0,${this.plotHeight})`)
          .call(this.axisBottom(this.xScale));

        this.gaussianG.append("g")
          .attr("class", "y-axis")
          .call(this.axisLeft(this.yScale));

        // Initialize likelihood plot
        this.likelihoodSvg = this.select(likelihoodSvg);
        this.likelihoodG = this.likelihoodSvg.append("g")
          .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

        // Add axes to likelihood plot
        this.stepScale = this.scaleLinear()
          .domain([0, 50])
          .range([0, this.plotWidth]);

        this.llScale = this.scaleLinear()
          .domain([-500, -100])
          .range([this.plotHeight, 0]);

        this.likelihoodG.append("g")
          .attr("class", "x-axis")
          .attr("transform", `translate(0,${this.plotHeight})`)
          .call(this.axisBottom(this.stepScale));

        this.likelihoodG.append("g")
          .attr("class", "y-axis")
          .call(this.axisLeft(this.llScale));
        
        // Add axis labels
        this.likelihoodG.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - this.margin.left - 10)
          .attr("x", 0 - (this.plotHeight / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Log-Likelihood");
        
        this.likelihoodG.append("text")
          .attr("transform", `translate(${this.plotWidth / 2}, ${this.plotHeight + this.margin.bottom})`)
          .style("text-anchor", "middle")
          .text("Optimization Step");
      }
      
      reset(numPoints = null) {
        // Randomly update true parameters
        this.trueMean = [
          (Math.random() - 0.5) * 3,  // Random mean between -1.5 and 1.5
          (Math.random() - 0.5) * 3
        ];

        // Generate random positive definite covariance matrix
        const a = Math.random() * 1.5 + 0.5;  // variance in x direction
        const d = Math.random() * 1.5 + 0.5;  // variance in y direction
        const b = (Math.random() - 0.5) * Math.sqrt(a * d) * 0.8;  // correlation, bounded to ensure positive definite

        this.trueCov = [
          [a, b],
          [b, d]
        ];

        // Regenerate data points from new true parameters
        if (numPoints !== null) {
          this.generateData(numPoints);
        } else {
          this.generateData(this.numPoints || 500);
        }

        // Randomly initialize model parameters (different from true parameters)
        this.modelMean = [
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4
        ];

        this.modelCov = [
          [Math.random() * 2 + 0.5, (Math.random() - 0.5) * 0.5],
          [(Math.random() - 0.5) * 0.5, Math.random() * 2 + 0.5]
        ];

        this.step = 0;
        this.logLikelihoods = [];
        this.isRunning = false;

        this.updatePlots();
        this.updateStatus();
      }
      
      async toggleRun() {
        if (this.isRunning) {
          this.isRunning = false;
        } else {
          this.isRunning = true;
          await this.runOptimization();
        }
      }
      
      async runOptimization() {
        while (this.isRunning && this.step < 1000) {
          this.singleStep();
          
          // Check for convergence
          if (this.logLikelihoods.length > 10) {
            const recent = this.logLikelihoods.slice(-10);
            const improvement = recent[recent.length - 1] - recent[0];
            if (Math.abs(improvement) < 0.01) {
              this.isRunning = false;
              break;
            }
          }
          
          // Small delay for animation
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        if (this.step >= 150) {
          this.isRunning = false;
        }
      }
      
      singleStep() {
        const gradients = this.computeGradients();
        
        // Update parameters using natural gradients with separate learning rates
        this.modelMean[0] += this.meanLearningRate * gradients.meanGrad[0];
        this.modelMean[1] += this.meanLearningRate * gradients.meanGrad[1];

        this.modelCov[0][0] += this.covLearningRate * gradients.covGrad[0][0];
        this.modelCov[0][1] += this.covLearningRate * gradients.covGrad[0][1];
        this.modelCov[1][0] += this.covLearningRate * gradients.covGrad[1][0];
        this.modelCov[1][1] += this.covLearningRate * gradients.covGrad[1][1];
        
        // Ensure covariance matrix remains positive definite
        this.ensurePositiveDefinite();
        
        this.step++;
        
        // Compute and store log-likelihood
        const ll = this.computeLogLikelihood();
        this.logLikelihoods.push(ll);
        
        this.updatePlots();
        this.updateStatus();
      }
      
      computeGradients() {
        const n = this.dataPoints.length;
        const invCov = this.invertMatrix(this.modelCov);

        // Compute sample mean x̄ = (1/N) Σ x_i
        const sampleMean = [0, 0];
        for (const point of this.dataPoints) {
          sampleMean[0] += point[0];
          sampleMean[1] += point[1];
        }
        sampleMean[0] /= n;
        sampleMean[1] /= n;

        // Natural gradient for mean: ∇̃_μ ℓ = Σ ∇_μ ℓ = x̄ - μ
        // This is independent of N and Σ, making it scale-invariant
        const naturalMeanGrad = [
          sampleMean[0] - this.modelMean[0],
          sampleMean[1] - this.modelMean[1]
        ];

        // Compute scatter matrix S = (1/N) Σ (x_i - μ)(x_i - μ)^T (normalized)
        const S = [[0, 0], [0, 0]];
        for (const point of this.dataPoints) {
          const diff = [point[0] - this.modelMean[0], point[1] - this.modelMean[1]];
          S[0][0] += diff[0] * diff[0];
          S[0][1] += diff[0] * diff[1];
          S[1][0] += diff[1] * diff[0];
          S[1][1] += diff[1] * diff[1];
        }
        // Normalize by N
        S[0][0] /= n;
        S[0][1] /= n;
        S[1][0] /= n;
        S[1][1] /= n;

        // Gradient w.r.t. covariance: (1/2) * (Σ^{-1} * S * Σ^{-1} - Σ^{-1})
        // Since S is now normalized by N, this gradient is also N-independent
        // First compute Σ^{-1} * S * Σ^{-1}
        const invCovS = [
          [invCov[0][0] * S[0][0] + invCov[0][1] * S[1][0], invCov[0][0] * S[0][1] + invCov[0][1] * S[1][1]],
          [invCov[1][0] * S[0][0] + invCov[1][1] * S[1][0], invCov[1][0] * S[0][1] + invCov[1][1] * S[1][1]]
        ];

        const invCovSinvCov = [
          [invCovS[0][0] * invCov[0][0] + invCovS[0][1] * invCov[1][0], invCovS[0][0] * invCov[0][1] + invCovS[0][1] * invCov[1][1]],
          [invCovS[1][0] * invCov[0][0] + invCovS[1][1] * invCov[1][0], invCovS[1][0] * invCov[0][1] + invCovS[1][1] * invCov[1][1]]
        ];

        const covGrad = [
          [0.5 * (invCovSinvCov[0][0] - invCov[0][0]), 0.5 * (invCovSinvCov[0][1] - invCov[0][1])],
          [0.5 * (invCovSinvCov[1][0] - invCov[1][0]), 0.5 * (invCovSinvCov[1][1] - invCov[1][1])]
        ];

        return {
          meanGrad: naturalMeanGrad,  // Use natural gradient for mean
          covGrad: covGrad
        };
      }
      
      ensurePositiveDefinite() {
        // Simple approach: ensure diagonal elements are positive and off-diagonal is small
        this.modelCov[0][0] = Math.max(0.1, this.modelCov[0][0]);
        this.modelCov[1][1] = Math.max(0.1, this.modelCov[1][1]);
        
        // Ensure |off-diagonal| < sqrt(diagonal product)
        const maxOffDiag = 0.9 * Math.sqrt(this.modelCov[0][0] * this.modelCov[1][1]);
        this.modelCov[0][1] = Math.max(-maxOffDiag, Math.min(maxOffDiag, this.modelCov[0][1]));
        this.modelCov[1][0] = this.modelCov[0][1]; // Keep symmetric
      }
      
      computeLogLikelihood() {
        let ll = 0;
        const det = this.determinant(this.modelCov);
        const invCov = this.invertMatrix(this.modelCov);
        const n = this.dataPoints.length;

        for (const point of this.dataPoints) {
          const diff = [point[0] - this.modelMean[0], point[1] - this.modelMean[1]];
          const quadForm = diff[0] * (invCov[0][0] * diff[0] + invCov[0][1] * diff[1]) +
                          diff[1] * (invCov[1][0] * diff[0] + invCov[1][1] * diff[1]);

          ll += -0.5 * (Math.log(2 * Math.PI) + Math.log(det) + quadForm);
        }

        // Return normalized log-likelihood (average per data point)
        return ll / n;
      }
      
      determinant(matrix) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
      }
      
      invertMatrix(matrix) {
        const det = this.determinant(matrix);
        return [
          [matrix[1][1] / det, -matrix[0][1] / det],
          [-matrix[1][0] / det, matrix[0][0] / det]
        ];
      }
      
      updatePlots() {
        this.updateGaussianPlot();
        this.updateLikelihoodPlot();
      }
      
      updateGaussianPlot() {
        // Clear previous content
        this.gaussianG.selectAll(".heatmap").remove();
        this.gaussianG.selectAll(".data-point").remove();
        
        // Create heatmap for model distribution
        const gridSize = 40;
        const heatmapData = [];
        
        for (let i = 0; i < gridSize; i++) {
          for (let j = 0; j < gridSize; j++) {
            const x = this.xScale.invert(i * this.plotWidth / (gridSize - 1));
            const y = this.yScale.invert(j * this.plotHeight / (gridSize - 1));
            const density = this.gaussianDensity([x, y], this.modelMean, this.modelCov);
            heatmapData.push({ x: i * this.plotWidth / (gridSize - 1), y: j * this.plotHeight / (gridSize - 1), density });
          }
        }
        
        const maxDensity = this.max(heatmapData, d => d.density);
        const colorScale = this.scaleSequential(this.interpolateBlues)
          .domain([0, maxDensity]);
        
        this.gaussianG.selectAll(".heatmap-cell")
          .data(heatmapData)
          .enter()
          .append("rect")
          .attr("class", "heatmap")
          .attr("x", d => d.x - this.plotWidth / (2 * gridSize))
          .attr("y", d => d.y - this.plotHeight / (2 * gridSize))
          .attr("width", this.plotWidth / gridSize)
          .attr("height", this.plotHeight / gridSize)
          .attr("fill", d => colorScale(d.density))
          .attr("opacity", 0.7);
        
        // Add data points (only those within plot bounds)
        const visiblePoints = this.dataPoints.filter(d => {
          const x = d[0];
          const y = d[1];
          return x >= this.xScale.domain()[0] && x <= this.xScale.domain()[1] &&
                 y >= this.yScale.domain()[0] && y <= this.yScale.domain()[1];
        });

        this.gaussianG.selectAll(".data-point")
          .data(visiblePoints)
          .enter()
          .append("circle")
          .attr("class", "data-point")
          .attr("cx", d => this.xScale(d[0]))
          .attr("cy", d => this.yScale(d[1]))
          .attr("r", 2)
          .attr("fill", "red")
          .attr("opacity", 0.8);
      }
      
      gaussianDensity(point, mean, cov) {
        const diff = [point[0] - mean[0], point[1] - mean[1]];
        const det = this.determinant(cov);
        const invCov = this.invertMatrix(cov);
        
        const quadForm = diff[0] * (invCov[0][0] * diff[0] + invCov[0][1] * diff[1]) +
                        diff[1] * (invCov[1][0] * diff[0] + invCov[1][1] * diff[1]);
        
        return Math.exp(-0.5 * quadForm) / (2 * Math.PI * Math.sqrt(det));
      }
      
      updateLikelihoodPlot() {
        // Set fixed y-axis limits from -5 to 0
        this.llScale.domain([-5, 0]);
        this.likelihoodG.select(".y-axis")
          .call(this.axisLeft(this.llScale));

        // Clear previous line
        this.likelihoodG.selectAll(".likelihood-line").remove();

        if (this.logLikelihoods.length > 1) {
          const lineGenerator = this.line()
            .x((_, i) => this.stepScale(i))
            .y(d => this.llScale(d));

          this.likelihoodG.append("path")
            .datum(this.logLikelihoods)
            .attr("class", "likelihood-line")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", lineGenerator);
        }
      }
      
      updateStatus() {
        const currentLL = this.logLikelihoods.length > 0 ? this.logLikelihoods[this.logLikelihoods.length - 1].toFixed(3) : "N/A";
        const statusEl = document.getElementById("status");
        if (statusEl) {
          statusEl.textContent =
            `Step: ${this.step} | N: ${this.numPoints || 0} | Avg Log-Likelihood: ${currentLL} | Mean: [${this.modelMean[0].toFixed(2)}, ${this.modelMean[1].toFixed(2)}] | True: [${this.trueMean[0].toFixed(2)}, ${this.trueMean[1].toFixed(2)}] | Natural Gradients`;
        }
      }
    }
    
    demo = new GaussianOptimizationDemo();
  });

  function handleReset() {
    if (demo) demo.reset(numPoints);
  }

  function handleRun() {
    if (demo) demo.toggleRun();
  }

  function handleStep() {
    if (demo) demo.singleStep();
  }
</script>

<div id="likelihood-demo" style="display: flex; flex-direction: column; align-items: center; margin: 30px 0; padding: 20px; background-color: #fafafa; border-radius: 8px;">
  <div style="display: flex; gap: 40px; margin-bottom: 30px;">
    <!-- Left panel: 2D Gaussian visualization -->
    <div style="border: 2px solid #ddd; padding: 20px; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h4 style="margin-top: 0; margin-bottom: 15px; color: #333; font-weight: 600;">Data Points & Model Distribution</h4>
      <svg bind:this={gaussianSvg} width="400" height="400"></svg>
    </div>

    <!-- Right panel: Log-likelihood plot -->
    <div style="border: 2px solid #ddd; padding: 20px; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h4 style="margin-top: 0; margin-bottom: 15px; color: #333; font-weight: 600;">Average Log-Likelihood vs Steps</h4>
      <svg bind:this={likelihoodSvg} width="400" height="400"></svg>
    </div>
  </div>

  <!-- Number of points input -->
  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
    <label for="numPoints" style="font-weight: 500; color: #333;">Number of Data Points:</label>
    <input
      id="numPoints"
      type="number"
      bind:value={numPoints}
      min="10"
      max="2000"
      step="10"
      style="padding: 8px 12px; border: 2px solid #ddd; border-radius: 4px; font-size: 14px; width: 80px; text-align: center;"
    />
  </div>

  <!-- Control buttons -->
  <div style="display: flex; gap: 15px; margin-bottom: 20px;">
    <button on:click={handleReset} style="padding: 12px 24px; font-size: 16px; background-color: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: background-color 0.2s;">Reset</button>
    <button on:click={handleRun} style="padding: 12px 24px; font-size: 16px; background-color: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: background-color 0.2s;">Run Optimization</button>
    <button on:click={handleStep} style="padding: 12px 24px; font-size: 16px; background-color: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: background-color 0.2s;">Single Step</button>
  </div>

  <div id="status" style="margin-top: 10px; font-family: 'Courier New', monospace; background-color: #f8f9fa; padding: 12px 20px; border-radius: 6px; border: 1px solid #e9ecef; color: #495057; font-size: 14px; min-width: 600px; text-align: center;"></div>
</div>

<style>
  button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  button:active {
    transform: translateY(0);
  }

  #likelihood-demo button:nth-child(1):hover {
    background-color: #5a6268 !important;
  }

  #likelihood-demo button:nth-child(2):hover {
    background-color: #0056b3 !important;
  }

  #likelihood-demo button:nth-child(3):hover {
    background-color: #1e7e34 !important;
  }
</style>
