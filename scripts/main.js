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
let canvases = [...document.querySelectorAll(`[id^="canvas"]`)];
canvases.forEach(c => {
    c.style.position = "relative";
    c.style.top = '' + (~~c.style.top + 300) + `px`;
    c.style.zIndex = 100 - ~~c.id.match(/[0-9]/)[0];
});
let graphics_contexts = canvases.map(canvas => canvas.getContext('2d'));
let [w, h] = [canvases[0].width, canvases[0].height];

const audio_box = document.getElementById('audio-box');
audio_box.focus();
window.addEventListener("click", initPlayer, false);
const ocbr = oscillating_counter(5, 50);
const octox = oscillating_counter(0, 70);
const octoy = oscillating_counter(20, 130);

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
    requestAnimationFrame(paintBars);
    spectrum = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(spectrum);
    ++frame;
    canvases.forEach(c => {
        c.style.transform = `rotate(${0.25 * frame * ((id = ~~c.id.match(/[0-9]/)[0]) + 1) * (-1) ** id}deg)`;
        if (!((frame + id) % 8)) {
            const ocn = ocbr.next().value;
            const ocx = octox.next().value;
            const ocy = octoy.next().value;
            c.style.borderRadius = `${ocn}%`;
            c.style.transformOrigin = `-${ocx}% ${ocy}%`;
        }
    });

    graphics_contexts.forEach((ctx, n) => {
        ctx.lineJoin = "round";
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < bars; i++) {
            bar_x = i * 4;
            let val = spectrum[n * bars + i];
            ctx.fillStyle = `rgb(${val}, ${((frame / 31) + (frame % (i + 173)) * i) % 0x100}, ${0xff - val})`;
            bar_height = -val * 0.7;
            ctx.fillRect(bar_x, h, bar_width, bar_height);
            // console.log(val);
            // ctx.arc(bar_x, bar_height, 4, 0, 2 * Math.PI);
            ctx.fill();
        }
    });
}

function* oscillating_counter(start, end) {
    let delta = start < end ? 1 : -1;
    let n = start;
    yield n;
    while (true) {
        yield n += delta;
        if (n == start || n == end) {
            delta = -delta;
        }
    }
}