export class Component {
  constructor(context, name) {
    this.context = context;
    this.name = name || 'Component';
    //console.log("create", this.name);
    this.input = null;
    this.output = null;
  }
  connect(node) {
    console.log(`connect ${this.name} => ${node.name ? node.name : node}`, node);
    if (node.input) {
      this.output.connect(node.input);
    } else {
      this.output.connect(node);
    }
  }
  toString() {
    return this.name;
  }
  addEvent(name, fn) {
    let eventName = this.name + '_' + name;
    //console.log("addEvent", eventName);
    document.addEventListener(eventName, fn);
  }
}

export class Generator extends Component {
  constructor(context, name) {
    super(context, name || 'Generator');
    this.oscillator = context.createOscillator();
    this.oscillator.type = 'sawtooth';
    this.setFrequency(440);
    this.oscillator.start(0);
    this.input = this.oscillator;
    this.output = this.oscillator;
  }
  setFrequency(frequency) {
    this.oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
  }
}

export class VCO extends Generator {
  constructor(context, name) {
    super(context, name || 'VCO');
  }
}

export class VCA extends Component  {
  constructor(context, name, initialGain) {
    super(context, name || 'VCA');
    this.gain = context.createGain();
    this.gain.gain.value = initialGain || 0;
    this.input = this.gain;
    this.output = this.gain;
    this.amplitude = this.gain.gain;

    this.addEvent('gain', (value) => {
      this.amplitude.value = value.detail;
    });
  }
}

export class Envelope extends Component {
  constructor(context, name) {
    super(context, name || 'Envelope');
    this.attackTime = 0.05;
    this.releaseTime = 0.4;
    this.addEvent('gateOn', () => { this.trigger(); });
    this.addEvent('gateOff', () => { this.off(); });
  }
  trigger() {
    let now = this.context.currentTime;
    this.param.cancelScheduledValues(now);
    this.param.setValueAtTime(this.min, now);
    this.param.linearRampToValueAtTime(this.max, now + this.attackTime);
    this.param.linearRampToValueAtTime(this.min, now + this.attackTime + this.releaseTime);
  }
  off() {
    let now = this.context.currentTime;
    this.param.cancelScheduledValues(now);
    this.param.setValueAtTime(0, now);
  }
  connect(node, min, max) {
    this.min = min || 0;
    this.max = max || 1;
    this.param = node;
  }
}
