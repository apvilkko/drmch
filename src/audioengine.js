import connectChain from './util.js';
import {VCA} from './components.js';

class AudioEngine {
  constructor() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    console.log("AudioEngine context", this.context);
    this.masterGain = new VCA(this.context, 'masterGain', 0.5);
    this.masterGain.connect(this.context.destination);
    this.tracks = {};
  }
  addTrack(key, sound) {
    console.log("addTrack", key, sound);
    var trackGain = new VCA(this.context, key + '_trackGain', 0.5);
    this.tracks[key] = {
      sound: sound,
      gain: trackGain
    };
    connectChain([sound, trackGain, this.masterGain]);
  }
}
export default AudioEngine;
