document.addEventListener('click', function() {
    context.resume().then(() => {
        console.log('Playback resumed successfully');
    });
});

let audio = new Audio();
audio.src = 'track7.mp3';
audio.controls = true;
audio.loop = true;
audio.autoplay = true;
let frame = 0;
const bar_width = 4;
const bars = 256;

let canvas, ctx, source, context, analyser, fbc_array, bar_height, bar_x;

window.addEventListener("load", initPlayer, false);

function initPlayer(){
    document.getElementById('audio_box').appendChild(audio);
    context = new AudioContext();
    analyser = context.createAnalyser(); 
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    // Re-route audio playback into the processing graph of the AudioContext
    source = context.createMediaElementSource(audio); 
    source.connect(analyser);
    analyser.connect(context.destination);
    paintBars();
}

function paintBars(){
    requestAnimationFrame(paintBars);
    spectrum = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(spectrum);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = '#ff0044';
    frame++;
    for (let i = 0; i < bars; i++) {
        bar_x = i * 5;
        let val = spectrum[i * 4];
        ctx.fillStyle = `rgb(${val}, ${((frame / 31) + (frame % (i + 173)) * i) % 256}, ${255 - val})`;
        bar_height = -val * 0.6;
        ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
    }
}

// function rgb2Hex(rgbColour) {
//     let rgb = rgbColour.slice(4,-1).split(`,`);
//     return `#`
//       + (`0` + Number(rgb[0]).toString(16)).slice(-2)
//       + (`0` + Number(rgb[1]).toString(16)).slice(-2)
//       + (`0` + Number(rgb[2]).toString(16)).slice(-2);
// }
