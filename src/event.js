function trigger(eventName, data) {
  document.dispatchEvent(new document.defaultView.CustomEvent(eventName, {detail: data}));
}
export default trigger;
