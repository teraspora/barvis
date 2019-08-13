const ac = new AudioContext();

let osc = ac.createOscillator();

let anal = ac.createAnalyser();

let distort = ac.createWaveShaper();

let gain = ac.createGain();

osc.connect(distort)
// WaveShaperNode {curve: null, oversample: "none", context: AudioContext, numberOfInputs: 1, numberOfOutputs: 1, …}

anal.connect(anal)
// AnalyserNode {fftSize: 2048, frequencyBinCount: 1024, minDecibels: -100, maxDecibels: -30, smoothingTimeConstant: 0.8, …}

distort.connect(gain);
// GainNode {gain: AudioParam, context: AudioContext, numberOfInputs: 1, numberOfOutputs: 1, channelCount: 2, …}

gain.connect(ac.destination);
// AudioDestinationNode {maxChannelCount: 2, context: AudioContext, numberOfInputs: 1, numberOfOutputs: 0, channelCount: 2, …}

osc.type = 'sine';
"sine"

osc.frequency.value = 220;
220

osc.start();
undefined

osc.stop();
undefined