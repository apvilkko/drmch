import AudioEngine from './audioengine.js';
import {InputHandler} from './inputhandler.js';
import Sequencer from './sequencer.js';
import {Hihat, Kick, Snare} from './sound.js';

class Drmch {
  constructor() {
    this.audioEngine = new AudioEngine();
    this.createSounds();
    this.sequencer = new Sequencer(this.audioEngine.context, this.sounds);
    this.inputHandler = new InputHandler();
    this.sequencer.start();
  }
  createSounds() {
    let hc = new Hihat(this.audioEngine.context, 'HC');
    hc.noiseEnvA.releaseTime = 0.05;
    let ho = new Hihat(this.audioEngine.context, 'HO');
    ho.noiseEnvA.releaseTime = 0.4;
    this.sounds = new Map()
      .set('HC', hc)
      .set('HO', ho)
      .set('BD', new Kick(this.audioEngine.context, 'BD'))
      .set('SN', new Snare(this.audioEngine.context, 'SN'))
    ;
    for (let [key, value] of this.sounds.entries()) {
      this.audioEngine.addTrack(key, value);
    }
  }
}
export default Drmch;
