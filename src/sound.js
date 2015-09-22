import connectChain from './util.js';
import {VCO, VCA, Component, Envelope} from './components.js';
import trigger from './event.js';

export class Filter extends Component {
  constructor(context, name, type) {
    super(context, name || 'Filter');
    this.filter = context.createBiquadFilter();
    this.filter.type = type || 'lowpass';
    this.filter.frequency.value = 2000;
    this.filter.Q.value = 0.5;
    this.frequency = this.filter.frequency;
    this.input = this.filter;
    this.output = this.filter;
  }
}

export class Sound extends Component {
  constructor(context, name) {
    super(context, name || 'Sound');
    this.vco = new VCO(context, this.name + '_VCO');
    this.vca = new VCA(context, this.name + '_VCA');
    this.envA = new Envelope(context, this.name + '_AEnvelope');
    this.envP = new Envelope(context, this.name + '_PEnvelope');
    this.noise = new NoiseGenerator(context, this.name + '_Noise');
    this.noiseVca = new VCA(context, this.name + '_NoiseVCA');
    this.noiseEnvA = new Envelope(context, this.name + '_NoiseAEnvelope');
    this.noiseFilter = new Filter(context, this.name + '_NoiseFilter', 'highpass');
    this.mixer = new VCA(context, this.name + '_groupGain', 0.5);
    connectChain([this.vco, this.vca, this.mixer]);
    connectChain([this.noise, this.noiseFilter, this.noiseVca, this.mixer]);
    this.envA.connect(this.vca.amplitude);
    this.noiseEnvA.connect(this.noiseVca.amplitude);
    this.envP.connect(this.vco.oscillator.frequency, 20, 250);
    this.output = this.mixer;
  }
  gateOn() {
    trigger(this.name + '_NoiseAEnvelope_gateOn');
    trigger(this.name + '_AEnvelope_gateOn');
    trigger(this.name + '_PEnvelope_gateOn');
  }
}

class NoiseGenerator extends Component {
  constructor(context, name) {
    super(context, name || 'Noise');
    let bufferSize = 2 * context.sampleRate;
    var noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
    let output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    this.noise = context.createBufferSource();
    this.noise.buffer = noiseBuffer;
    this.noise.loop = true;
    this.noise.start(0);
    this.output = this.noise;
  }
}

export class Hihat extends Sound {
  constructor(context, name) {
    super(context, name || 'Hihat');
    this.noiseFilter.filter.frequency.value = 7000;
    this.envA.min = 0;
    this.envA.max = 0;
  }
}

export class Kick extends Sound {
  constructor(context, name) {
    super(context, name || 'Kick');
    this.vco.oscillator.type = 'sine';
    this.envP.attackTime = 0;
    this.envP.releaseTime = 0.1;
    this.noiseEnvA.min = 0;
    this.noiseEnvA.max = 0;
  }
}

export class Snare extends Sound {
  constructor(context, name) {
    super(context, name || 'Snare');
    this.vco.oscillator.type = 'sine';
    this.envP.min = 100;
    this.envP.max = 400;
    this.envP.attackTime = 0;
    this.envP.releaseTime = 0.1;
    this.envA.releaseTime = 0.1;
    this.noiseFilter.filter.frequency.value = 3500;
  }
}
