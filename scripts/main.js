// Bar Chart visualisation of audio stream
// Author:      John Lynch
// Date:        August 2019
// Based on MDN docs at https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API

let audio = new Audio();
// audio.src = 'obc.mp3';
audio.src = 'track1.mp3';
audio.controls = true;
audio.loop = false;
audio.autoplay = true;
const bar_width = 4;
const bars = 128;

let frame = 0;
let source, audio_context, analyser, spectrum, bar_height, bar_x;
let canvases = [0, 1, 2, 3].map(n => document.getElementById(`canvas-${n}`));
let graphics_contexts = canvases.map(canvas => canvas.getContext('2d'));
let [w, h] = [canvases[0].width, canvases[0].height];

const audio_box = document.getElementById('audio-box');
audio_box.focus();
window.addEventListener("click", initPlayer, false);

function initPlayer(){
    audio_box.replaceChild(audio, audio_box.childNodes[0]);
    audio_context = new AudioContext();
    analyser = audio_context.createAnalyser(); 
    // Re-route audio playback into the processing graph of the AudioContext
    source = audio_context.createMediaElementSource(audio); 
    source.connect(analyser);
    source.connect(audio_context.destination);
    paintBars();
}

function paintBars(){
    frame++;
    requestAnimationFrame(paintBars);
    spectrum = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(spectrum);
    graphics_contexts.forEach((ctx, n) => {
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < bars; i++) {
            bar_x = i * 4;
            let val = spectrum[n * bars + i];
            ctx.fillStyle = `rgb(${val}, ${((frame / 31) + (frame % (i + 173)) * i) % 0x100}, ${0xff - val})`;
            bar_height = -val * 0.6;
            ctx.fillRect(bar_x, h, bar_width, bar_height);
        }
    });
}

