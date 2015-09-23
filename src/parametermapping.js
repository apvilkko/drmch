import trigger from './event.js';

export const maxValue = 255;

function scale(value, min, max) {
  min = (!min && min !== 0) ? 0 : min;
  max = (!max && max !== 0) ? 1 : max;
  return (parseInt(value.target.value, 10) / maxValue) * (max - min) + min;
}

function doTrigger(paramName) {
  return function (event) {
    trigger(paramName, scale(event));
  }
}

let parameters = {
  tempo: function (event) {
    trigger('tempo', scale(event, 90, 150));
  },
  tightness: function (event) {
    var scaled = scale(event, 1, 0);
    var norm = scale(event);
    trigger('HC_NoiseAEnvelope_setRelease', 0.01 + scaled * 0.15);
    trigger('HO_NoiseAEnvelope_setRelease', 0.07 + scaled * 0.4);
    trigger('HC_NoiseFilter_setFrequency', 5000 + norm * 3000);
    trigger('HO_NoiseFilter_setFrequency', 5000 + norm * 3000);
    trigger('BD_AEnvelope_setRelease', 0.025 + scaled * 0.4);
    trigger('BD_PEnvelope_setRelease', 0.025 + scaled * 0.4);
    trigger('BD_PEnvelope_setMin', 20 + norm * 100);
    trigger('BD_PEnvelope_setMax', 120 + norm * 100);
    trigger('SN_AEnvelope_setRelease', 0.005 + scaled * 0.2);
    trigger('SN_PEnvelope_setRelease', 0.005 + scaled * 0.2);
    trigger('SN_NoiseAEnvelope_setRelease', 0.05 + scaled * 0.4);
    trigger('SN_PEnvelope_setMin', 120 + norm * 80);
    trigger('SN_PEnvelope_setMax', 200 + norm * 100);
    trigger('SN_NoiseFilter_setFrequency', 2000 + norm * 3000);
  },
  masterGain: doTrigger('masterGain_gain')
};

export class Mapper {
  static map(key) {
    return parameters[key] || () => {};
  }
}
