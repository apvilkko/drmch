import trigger from './event.js';

const PATTERN = {
  'HC': [1,0,1,1,1,0,0,0,1,1,1,0,1,0,0,1],
  'HO': [0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0],
  'BD': [1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0],
  'SN': [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
};

class Sequencer {
  constructor(context, sounds) {
    this.context = context;
    this.sounds = sounds;
    this.nextNoteTime = context.currentTime;
    this.scheduleAheadTime = 0.1;
    this.currentNote = 0;
    this.noteLength = 0.25; // (1 = quarter note, 0.5 = eighth note)
    let tempo = 120;
    this.secondsPerBeat = 60.0 / tempo;
    this.beatsPerBar = 4;
    this.notesPerBeat = Math.round(this.beatsPerBar / this.noteLength);
    this.pattern = PATTERN;

    document.addEventListener('tempo', (value) => {
      this.secondsPerBeat = 60.0 / value.detail;
    });
  }
  scheduleNote() {
    Object.keys(this.pattern).forEach((value) => {
      if (this.pattern[value][this.currentNote]) {
        this.sounds.get(value).gateOn();
        if (value === 'HC') {
          trigger('HO_AEnvelope_gateOff');
        }
      }
    });
  }
  nextNote() {
    this.nextNoteTime += this.noteLength * this.secondsPerBeat;
    this.currentNote++;
    if (this.currentNote === this.notesPerBeat) {
      this.currentNote = 0;
    }
  }
  scheduler() {
    window.requestAnimationFrame(() => { this.scheduler(); });
    if (this.nextNoteTime < this.context.currentTime + this.scheduleAheadTime ) {
      this.scheduleNote();
      this.nextNote();
    }
  }
}
export default Sequencer;
