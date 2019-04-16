import { config } from '../../config';

export class ButtonAddTime {
    constructor() {
        this.htmlElement = document.createElement(config.selector.DIV);
        this.htmlElement.className = `${ config.css_class.BUTTON_ADD_TIME } ${ config.css_class.ACTIVE } btn btn-outline-primary `;
        this.htmlElement.innerHTML = '<i class="fas fa-plus"></i><span> Add time</span>';

        this.htmlElement.addEventListener(config.event_listener.CLICK, this.hideButton);
    }
    showButton(){
        this.htmlElement.classList.add(config.css_class.ACTIVE);
    }

    hideButton(){
        this.htmlElement.classList.remove(config.css_class.ACTIVE);
    }
}