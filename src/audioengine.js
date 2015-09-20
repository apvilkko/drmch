class AudioEngine {
  constructor() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    console.log("AudioEngine context", this.context);
  }
  addTrack(sound) {
    console.log("addTrack", sound);
    sound.connect(this.context.destination);
  }
}
export default AudioEngine;
