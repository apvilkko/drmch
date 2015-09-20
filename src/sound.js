import {VCO, VCA, Component, Envelope} from './components.js';

class Sound extends Component {
  constructor(context, name) {
    super(context, name || 'Sound');
    this.vco = new VCO(context);
    this.vca = new VCA(context);
    this.envA = new Envelope(context);
    this.vco.connect(this.vca);
    this.envA.connect(this.vca.amplitude);
    this.output = this.vca;
  }
}
export default Sound;
