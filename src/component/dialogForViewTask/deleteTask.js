import { config } from '../../config';
import { CustomEventDelete } from '../CustomEvent/customEventDelete';

export class DeleteTask {
  constructor() {
    this.component = document.createElement(config.selector.DIV);
    this.component.className = config.css_class.DELETE_TASK;
    this.component.innerHTML = config.text.BUTTON_DELETE;
  }

  setDataForDelete(data) {
    this.data = data;
  }

  callCustomEventDeleteForElement(element) {
    const event = new CustomEventDelete(this.data);
    event.callCustomEvent(element);
  }
}