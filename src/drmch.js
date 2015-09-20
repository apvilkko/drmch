import AudioEngine from './audioengine.js';
import Sound from './sound.js';
import trigger from './event.js';

class Drmch {
  constructor() {
    this.audioEngine = new AudioEngine();
    this.sounds = new Map()
      .set('kick', new Sound(this.audioEngine.context, 'kick'))
    ;
    for (let value of this.sounds.values()) {
      this.audioEngine.addTrack(value);
    }
    trigger('Envelope_gateOn');
  }
}
export default Drmch;
