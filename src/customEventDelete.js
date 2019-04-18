export class CustomEventDelete {
  constructor(data) {
    this.event = new CustomEvent('delete', {
      detail: data
    });
  }

  callCustomEvent(elem) {
    elem.dispatchEvent(this.event);
  }
}