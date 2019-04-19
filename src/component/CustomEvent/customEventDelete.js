import { config } from '../../config';

export class CustomEventDelete {
  constructor(data) {
    this.event = new CustomEvent(config.custom_event.DELETE, {
      detail: data
    });
  }

  callCustomEvent(elem) {
    elem.dispatchEvent(this.event);
  }
}