import { config } from '../../config';

export class NameTask {
    constructor() {
        this.htmlElement = document.createElement(config.selector.INPUT);
        this.htmlElement.className = config.css_class.NAME_TASK;
        this.htmlElement.addEventListener(config.event_listener.CLICK, () => {
            this.htmlElement.classList.remove(config.css_class.ERROR_INPUT);
            this.htmlElement.classList.add(config.css_class.ENTER_INPUT);
        });
        this.htmlElement.addEventListener(config.event_listener.BLUR, () => {
            this.htmlElement.classList.remove(config.css_class.ENTER_INPUT);
        });
        this.htmlElement.placeholder = config.text.PLACEHOLDER_NAME_TASK;
    }

    clear() {
        this.htmlElement.classList.remove(config.css_class.ERROR_INPUT);
        this.htmlElement.placeholder = config.text.PLACEHOLDER_NAME_TASK;
        this.htmlElement.value = '';
    }

    isEmpty() {
        return this.htmlElement.value === '';
    }

    addError() {
        this.htmlElement.classList.add(config.css_class.ERROR_INPUT);
    }

}