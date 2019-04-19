import { config } from '../../config';

export class CustomEventSave {
  constructor(data) {
    this.event = new CustomEvent(config.custom_event.SAVE, {
      detail: data
    });
  }

  callCustomEvent(elem) {
    elem.dispatchEvent(this.event);
  }
}