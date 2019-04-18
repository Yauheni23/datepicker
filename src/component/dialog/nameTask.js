import { config } from '../../config';

export class NameTask {
    constructor() {
        this.component = document.createElement(config.selector.INPUT);
        this.component.className = config.css_class.NAME_TASK;
        this.component.addEventListener(config.event_listener.CLICK, () => {
            this.component.classList.remove(config.css_class.ERROR_INPUT);
            this.component.classList.add(config.css_class.ENTER_INPUT);
        });
        this.component.addEventListener(config.event_listener.BLUR, () => {
            this.component.classList.remove(config.css_class.ENTER_INPUT);
        });
        this.component.placeholder = config.text.PLACEHOLDER_NAME_TASK;
    }

    clear() {
        this.component.classList.remove(config.css_class.ERROR_INPUT);
        this.component.placeholder = config.text.PLACEHOLDER_NAME_TASK;
        this.component.value = '';
    }

    isEmpty() {
        return this.component.value === '';
    }

    addError() {
        this.component.classList.add(config.css_class.ERROR_INPUT);
    }

}