import { config } from '../../config';
import { CustomEventSave } from '../../customEventSave';

export class Save {
  constructor(params = {}) {
    this.setDefaultParams(params);
    this.component = document.createElement(config.selector.DIV);
    this.component.className = config.css_class.WRAPPER_SAVE;
    this.button = document.createElement(config.selector.BUTTON);
    this.button.className = `btn btn-success ${ config.css_class.BUTTON_SAVE }`;
    this.button.innerText = config.text.BUTTON_SAVE;

    if (this.params.useError) {
      this.createErrorComponent();
    }

    this.component.appendChild(this.error);
    this.component.appendChild(this.button);
  }

  createErrorComponent() {
    this.error = document.createElement(config.selector.SPAN);
    this.error.innerText = this.params.errorMessage;
    this.error.className = config.css_class.ERROR;
  }

  setDefaultParams(params) {
    this.params = {
      useError: params.useError || true,
      errorMessage: params.errorMessage || config.text.DEFAULT_ERROR_MESSAGE
    };
  }

  callCustomEventSaveForElement(element) {
    const event = new CustomEventSave(this.data);
    event.callCustomEvent(element);
  }

  showError() {
    this.error.classList.add(config.css_class.ACTIVE);
  }

  hideError() {
    this.error.classList.remove(config.css_class.ACTIVE);
  }

  setDataForSave(data) {
    this.data = data;
  }
}