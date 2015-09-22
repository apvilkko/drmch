import trigger from './event.js';

const maxValue = 255;

function doTrigger(paramName) {
  return function (event) {
    trigger(paramName, parseInt(event.target.value, 10) / maxValue);
  }
}

function scale(min, max, value) {
  return (parseInt(value, 10) / maxValue) * (max - min) + min;
}

class InputHandler {
  constructor() {
    this.sliders = new Map()
      .set('masterGain', {
        title: 'Volume',
        callback: doTrigger('masterGain_gain')
      })
      .set('tempo', {
        title: 'Tempo',
        callback: function (event) {
          trigger('tempo', scale(90, 150, event.target.value));
        }
      })
    ;
    var sliders = document.getElementById('sliders');
    for (let [key,value] of this.sliders.entries()) {
      var slider = document.createElement('div');
      slider.setAttribute('class', 'slider');
      var label = document.createElement('label');
      var text = document.createTextNode(value.title);
      label.appendChild(text);
      var input = document.createElement('input');
      input.setAttribute('id', 'slider-' + key);
      input.setAttribute('type', 'range');
      input.setAttribute('min', '0');
      input.setAttribute('max', '' + maxValue);
      label.appendChild(input);
      slider.appendChild(label);
      sliders.appendChild(slider);
      input.addEventListener('input', value.callback, false);
    }
  }
}
export default InputHandler;
