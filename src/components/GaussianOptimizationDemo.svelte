<script>
  import { onMount } from "svelte";

  let gaussianSvg;
  let likelihoodSvg;
  let demo;

  onMount(async () => {
    // Try to import D3 modules, with fallbacks if they fail
    let select, selectAll, axisBottom, axisLeft, line, interpolateBlues, scaleSequential, scaleLinear, max, min;

    try {
      ({ select, selectAll } = await import("d3-selection"));
      ({ axisBottom, axisLeft } = await import("d3-axis"));
      ({ line } = await import("d3-shape"));
      ({ interpolateBlues } = await import("d3-scale-chromatic"));
      ({ scaleSequential, scaleLinear } = await import("d3-scale"));
      ({ max, min } = await import("d3-array"));
    } catch (error) {
      console.error("Failed to load D3 modules:", error);
      return;
    }

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
        this.learningRate = 0.001; // Much smaller learning rate

        // Generate data points
        this.generateData();
        this.initializePlots();
        this.reset();
      }
      
      generateData() {
        this.dataPoints = [];
        const numPoints = 100;
        
        for (let i = 0; i < numPoints; i++) {
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
          .domain([0, 1000])
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
          .attr("y", 0 - this.margin.left)
          .attr("x", 0 - (this.plotHeight / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Log-Likelihood");
        
        this.likelihoodG.append("text")
          .attr("transform", `translate(${this.plotWidth / 2}, ${this.plotHeight + this.margin.bottom})`)
          .style("text-anchor", "middle")
          .text("Optimization Step");
      }
      
      reset() {
        // Randomly initialize model parameters
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
        
        if (this.step >= 1000) {
          this.isRunning = false;
        }
      }
      
      singleStep() {
        const gradients = this.computeGradients();
        
        // Update parameters using gradients
        this.modelMean[0] += this.learningRate * gradients.meanGrad[0];
        this.modelMean[1] += this.learningRate * gradients.meanGrad[1];
        
        this.modelCov[0][0] += this.learningRate * gradients.covGrad[0][0];
        this.modelCov[0][1] += this.learningRate * gradients.covGrad[0][1];
        this.modelCov[1][0] += this.learningRate * gradients.covGrad[1][0];
        this.modelCov[1][1] += this.learningRate * gradients.covGrad[1][1];
        
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

        // Compute scatter matrix S = sum of (x_i - mu)(x_i - mu)^T
        const S = [[0, 0], [0, 0]];
        const meanGrad = [0, 0];

        for (const point of this.dataPoints) {
          const diff = [point[0] - this.modelMean[0], point[1] - this.modelMean[1]];

          // Gradient w.r.t. mean: Σ^{-1} Σ(x_i - μ)
          meanGrad[0] += invCov[0][0] * diff[0] + invCov[0][1] * diff[1];
          meanGrad[1] += invCov[1][0] * diff[0] + invCov[1][1] * diff[1];

          // Accumulate scatter matrix
          S[0][0] += diff[0] * diff[0];
          S[0][1] += diff[0] * diff[1];
          S[1][0] += diff[1] * diff[0];
          S[1][1] += diff[1] * diff[1];
        }

        // Gradient w.r.t. covariance: (1/2) * Σ^{-1} * S * Σ^{-1} - (n/2) * Σ^{-1}
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
          [0.5 * invCovSinvCov[0][0] - (n/2) * invCov[0][0], 0.5 * invCovSinvCov[0][1] - (n/2) * invCov[0][1]],
          [0.5 * invCovSinvCov[1][0] - (n/2) * invCov[1][0], 0.5 * invCovSinvCov[1][1] - (n/2) * invCov[1][1]]
        ];

        return { meanGrad, covGrad };
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
        
        for (const point of this.dataPoints) {
          const diff = [point[0] - this.modelMean[0], point[1] - this.modelMean[1]];
          const quadForm = diff[0] * (invCov[0][0] * diff[0] + invCov[0][1] * diff[1]) +
                          diff[1] * (invCov[1][0] * diff[0] + invCov[1][1] * diff[1]);
          
          ll += -0.5 * (Math.log(2 * Math.PI) + Math.log(det) + quadForm);
        }
        
        return ll;
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
        
        // Add data points
        this.gaussianG.selectAll(".data-point")
          .data(this.dataPoints)
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
        // Update scale if needed
        if (this.logLikelihoods.length > 0) {
          const minLL = this.min(this.logLikelihoods);
          const maxLL = this.max(this.logLikelihoods);
          this.llScale.domain([minLL - 10, maxLL + 10]);

          this.likelihoodG.select(".y-axis")
            .call(this.axisLeft(this.llScale));
        }

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
        const currentLL = this.logLikelihoods.length > 0 ? this.logLikelihoods[this.logLikelihoods.length - 1].toFixed(2) : "N/A";
        const statusEl = document.getElementById("status");
        if (statusEl) {
          statusEl.textContent = 
            `Step: ${this.step} | Log-Likelihood: ${currentLL} | Mean: [${this.modelMean[0].toFixed(2)}, ${this.modelMean[1].toFixed(2)}]`;
        }
      }
    }
    
    demo = new GaussianOptimizationDemo();
  });

  function handleReset() {
    if (demo) demo.reset();
  }

  function handleRun() {
    if (demo) demo.toggleRun();
  }

  function handleStep() {
    if (demo) demo.singleStep();
  }
</script>

<div id="likelihood-demo" style="display: flex; flex-direction: column; align-items: center; margin: 20px 0;">
  <div style="display: flex; gap: 20px; margin-bottom: 20px;">
    <!-- Left panel: 2D Gaussian visualization -->
    <div style="border: 1px solid #ccc; padding: 10px;">
      <h4 style="margin-top: 0;">Data Points & Model Distribution</h4>
      <svg bind:this={gaussianSvg} width="400" height="400"></svg>
    </div>
    
    <!-- Right panel: Log-likelihood plot -->
    <div style="border: 1px solid #ccc; padding: 10px;">
      <h4 style="margin-top: 0;">Log-Likelihood vs Steps</h4>
      <svg bind:this={likelihoodSvg} width="400" height="400"></svg>
    </div>
  </div>
  
  <!-- Control buttons -->
  <div style="display: flex; gap: 10px;">
    <button on:click={handleReset} style="padding: 10px 20px; font-size: 16px;">Reset</button>
    <button on:click={handleRun} style="padding: 10px 20px; font-size: 16px;">Run Optimization</button>
    <button on:click={handleStep} style="padding: 10px 20px; font-size: 16px;">Single Step</button>
  </div>
  
  <div id="status" style="margin-top: 10px; font-family: monospace;"></div>
</div>
