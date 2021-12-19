import { c as create_ssr_component } from "./app-1a513ba3.js";
import "@sveltejs/kit/ssr";
const metadata = {
  "title": "A Fast(er) interface for Arduino from Matlab",
  "date": "2021-5-10",
  "description": "Major speedup for Arduino through serial buffer and IOPort"
};
const Matlab_arduino = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<p>I recently had to setup an experimental rig with an interface between Matlab and an Arduino. The goal of the interface was to read out the position of a treadmill using a rotary encoder. This must be a pretty common situation in neuroscience these days, but my first foray into setting it up (through the official <a href="${"https://www.mathworks.com/hardware-support/arduino-matlab.html"}" rel="${"nofollow"}">matlab arduino toolbox</a>) was way too slow for any reasonable experiment. I figured I\u2019d write up my notes on the process here. If you know a better way to do this, please email or message me!</p>
<h3 id="${"approach-1-matlab-arduino-toolbox"}">Approach 1: Matlab arduino toolbox</h3>
<p>The matlab toolbox is pretty easy to use. We need a rotary encoder to read out the turns of the treadmill, and that\u2019s already built in as toolbox (again, figure this is a pretty common task). The code to connect and setup the rotary encoder look like this:</p>
<img src="${"/arduinoblog/fig02_open.png"}" alt="${"Connect to the Arduino"}" style="${"max-width: 40em; width: 100%"}">
<p>The encoder uses digital inputs 2 and 3.</p>
<p>Great. Simple enough. But is it fast enough? Our experiment code runs visual stimuli at 120 or 240Hz. That means we have to complete all analyses of behavior within ~7 or ~3.5 ms before we absolutely have to draw the stimuli. These numbers shrink if the stimuli are really complicated. All time matters (e.g., communicating with the syringe pump to send reward takes ~0.5 ms).</p>
<p>To compute the arduino toolbox call time, I just ran the main call 1000 times in a for loop and measured the elapsed time. The code looks like this:</p>
<img src="${"/arduinoblog/fig03_loop.png"}" alt="${"Loop calls to rotary encoder"}" style="${"max-width: 40em; width: 100%"}">
<p>Pretty straightforward. And the output?</p>
<p><code>Median Duration Arduino Toolbox = 8.07 [7.89, 8.23] ms</code></p>
<img src="${"/arduinoblog/fig04_summary.png"}" alt="${"Arduino toolbox call time"}" style="${"max-width: 30em; width: 100%"}">
<p>This just won\u2019t work. Matlab hangs for ~8ms each time the toolbox calls. At that rate, we\u2019d drop every single frame of the experiment. This would be possible at a 60Hz refresh rate, but that\u2019s just too slow for reasonable motion stimuli. I searched the Mathworks forums and Arduino forums and there\u2019s a lot of chatter about how slow this is, but also a lot of insistance that \u201Cthis is just how fast you can run over USB\u201D. That can\u2019t be right. And it isn\u2019t. There\u2019s a faster way\u2026</p>
<h3 id="${"approach-2-ioport-serial-connection"}">Approach 2: IOPort serial connection</h3>
<p><a href="${"http://psychtoolbox.org"}" rel="${"nofollow"}">Psychtoolbox</a> has a mex function called <a href="${"http://psychtoolbox.org/docs/IOPort"}" rel="${"nofollow"}">IOPort</a> that supports connections over a serial port (which can work over USB, of course). This means we\u2019d need to run all rotary encoding on the Arduino as a sketch and only use Matlab to communicate to a serial buffer.</p>
<p>Arduino sketches are easy enough to write and you can find plenty of code snippets online. Here\u2019s the steps of the code I\u2019m using. I based it off a snippet I got from Jack Liska in Huklab.</p>
<p>The code sketch has 4 parts: <code>variable declaration</code>, <code>setup</code>, <code>main loop</code>, and <code>rotary encoder function</code></p>
<p>We use the <code>digitalWriteFast</code> library which supposedly offers substantial speedup over the default <code>digitalWrite</code> function in the default Arduino library. All variables are setup here:</p>
<img src="${"/arduinoblog/fig05_libvar.png"}" alt="${"Sketch libraries and variables"}" style="${"max-width: 40em; width: 100%"}">
<p>Then we setup the serial buffer and initialize the encoder pins. The rotary encoder operates as an interrupt that responds to the rising edge of the digital inputs.</p>
<img src="${"/arduinoblog/fig06_setup.png"}" alt="${"Sketch setup"}" style="${"max-width: 40em; width: 100%"}">
<p>The main loop just dumps the current time and encoder count to the serial buffer. It also listens for a \u201Creset\u201D command to reset the counter, which is necessary so that our count doesn\u2019t exceed the bitdepth of the <code>long</code> type we\u2019re storing them as.</p>
<img src="${"/arduinoblog/fig07_loop.png"}" alt="${"Sketch main loop"}" style="${"max-width: 40em; width: 100%"}">
<p>The loop depends on the encoder to detect digital ins and count them.</p>
<img src="${"/arduinoblog/fig08_encoder.png"}" alt="${"Sketch encoder"}" style="${"max-width: 40em; width: 100%"}">
<p>It\u2019s pretty straightforward. The output lools something like this. So these are the lines we need to read.</p>
<img src="${"/arduinoblog/fig09_outpu.png"}" alt="${"Sketch serial buffer output"}" style="${"max-width: 20em; width: 100%"}">
<p>Back in matlab, we can setup our serial connection to the arduino like this:</p>
<img src="${"/arduinoblog/fig11_approach2mat.png"}" alt="${"IOPort connection"}" style="${"max-width: 40em; width: 100%"}">
<p>We need to parse the buffer to make sense of the encoded values. I used regexp to parse the \u201Ctime\u201D and \u201Ccount\u201D keywords. There must be a smarter way to read from the buffer, but I wanted to do it as fast as possible.</p>
<img src="${"/arduinoblog/fig12_approach2matloop.png"}" alt="${"IOPort read and loop"}" style="${"max-width: 40em; width: 100%"}">
<p>After all this, we can see how fast the calls are.</p>
<p><code>Median Duration IOPort = 0.59 [0.58, 0.59] ms</code></p>
<img src="${"/arduinoblog/fig10_summary.png"}" alt="${"IOPort read speed"}" style="${"max-width: 30em; width: 100%"}">
<p>This is a huge speed up! We went from 8ms to 0.5ms and we are getting the correct encoder values. However, useing this approach, we miss a fraction of the samples because the buffer is only partially full and the keywords can be missed. I haven\u2019t fully debugged how to improve this yet, but now we can read from the treadmill online without dropping frames.</p>
<p>The <a href="${"https://github.com/jcbyts/MarmoV5/blob/master/%2Bmarmoview/treadmill_arduino.m"}" rel="${"nofollow"}">treadmill code</a> I wrote is available on my github and the <a href="${"https://github.com/jcbyts/MarmoV5/blob/master/SupportFunctions/sketch_rotary_serial.ino"}" rel="${"nofollow"}">arduino sketch</a> is available as well.</p>`;
});
export { Matlab_arduino as default, metadata };
