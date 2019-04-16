import { config } from '../../config';

export class Close {
    constructor() {
        this.htmlElement = document.createElement(config.selector.DIV);
        this.htmlElement.className = config.css_class.CLOSE;
        this.htmlElement.innerHTML = '<i class="fas fa-times"></i>';
    }

}