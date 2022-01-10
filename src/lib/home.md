<script>
  import LinesHr from "../components/LinesHr.svelte";
  import LatestPublications from "../components/LatestPublications.svelte";
</script>

### The Active Vision and Neural Computation Lab opens

My lab will be opening at the [Herbert Wertheim School of Optometry and Vision Science](https://optometry.berkeley.edu/) at UC Berkeley in July 2022 and will be recruiting at all levels soon. If you're interested in working together, shoot me an [email](mailto:yates@berkeley.edu) (more below).

Research in the lab will be broadly focused on how primate brains extract information about the world using vision.

**Why vision?**

We want better models of the visual system because good models of vision are useful. Early vision forms the fundamental building blocks of our conscious visual perception and has been a useful testbed for theories of neural coding. Good models of early vision are useful for scientists studying cognition in natural tasks and environments. Moreover, being able to generalize and predict how neurons at different levels in the visual pathway would respond to a particular input is useful for treating human diseases and driving technological development. For example, what information is lost, specifically, when a particular cell class in the retina is damaged? What parameters for a retinal prosthesis matter to drive visual cortex normally? What parameters matter to avoid artifacts in the development of new displays? How can we make computer vision more robust to adversarial examples? All of these questions are answerable if we had a good-enough model of the early visual system. To that end, models we develop compute based on realistic input (i.e., 2D spatiotemporal luminance sequences) and produce predictions for neural activity at multiple stages of the visual pathway, including perception.


**Why primates?**

Humans are primates. Like other primates, we have forward-facing eyes and a large portion of our brains devoted to processing visual input -- The single largest area of your cortex is primary visual cortex (V1), the second largest cortical brain area is V2! This is true of all primates. Primates are the only mammals who have a fovea, which is a pit in the retina with tightly-packed photoreceptors that lets us see with high acuity. And we move our eyes to position the fovea over visual details of interest. One fundamental premise of our philosophy is that each species' visual system co-evolved with its motor system. Therefore, even a purely feed-forward visual system will have learned to operate on a set of spatiotemporal statistics that are species-specific. In other words, the system expects certain types of input and is designed process those best. Thus, if we want to make good models of human vision, we need to study systems that work similarly to humans. We do want to understand human vision because our research should be useful for those who aim to treat human patients, those who design computer vision systems or develop new display technology... for humans.

**Approach**
We approach our research questions by collaborating closely with neurophysiologists. We help design experiments and analyze neural data collected in other labs using statistical models and machine learning. We also develop new eye-tracking technology in-house and test perceptual predictions from our neural models using psychophysics with high-resolution eye-tracking.

#### Open positions and pre-requisites

I am looking for students and postdocs to join my lab. The work we do is fairly technical, so it is helpful to have some existing skills. But everything can be learned so I'm mostly looking for enthusiasm a good work ethic. The general topics are listed below and pre-requisites for success on each topic area.

Students and postdocs will be encouraged to connect across these multiple topics. 

**Statistical Models of Neural Activity**
If you are interested in neural modeling, it is helpful if you have some background in machine learning. All of our models are currently written in python using pytorch, so some familiarity or confidence you can learn it quickly is helpful. Experience analyzing neural data is helpful but not necessary.

**High-resolution Eye Tracking**
We are interested in pushing the limits of how well we can measure eye movements in humans and monkeys. We use a range of approaches to do this, but there are two basic settings where we aim to improve existing technology: The laboratory and the wild.

Eye tracking in the lab is controlled and we can customize all the hardware and geometry. If you are interested in this, experience with C++ and using hardware APIs is helpful. It is also helpful to have a basic familiarity with optics and computer vision. Currently, our algorithms run using OpenCV so they are easy to program.

We are also interested in using machine learning to measure eye movements in freely moving animals (even in the wild). Experience with computer vision is helpful.

**Perception**
In the lab, we study how eye movements format visual input to support perception. We show visual stimuli using Matlab via Psychtoolbox. Some programming experience is helpful.


<LinesHr />

### Current research topics:

#### Active Vision

Most animals with complex spatial vision use image-forming eyes and a “saccade and fixate” pattern of eye movements to see the world. However, their eyes are never still, counter-rotating relative to body and/or head movements, and drifting during “fixations”, such that the input to the retina is better thought of as a spatiotemporal movie instead of a stable (or unstable) image. My research aims to understand the algorithms the brain uses (in cortical visual areas) to utilize information that is generated by the motion of the eyes. To approach this, I use a combination of high-resolution eye-tracking and statistical models of both the visual input and neural activity in visual cortex.

#### Foveal Processing

Humans see best at the very center center of their visual field. This "high-resolution" region is called the fovea and, among mammals, only primates have one. The primate fovea is a highly-specialized anatomical adaptation for high-resolution spatial vision and it differs substantially from the peripheral retina and the retinas of other mammals.

---

### Latest Publications

<LatestPublications title="HI" />
