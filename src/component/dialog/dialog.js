import { config } from '../../config';

export class Dialog {
    constructor() {
        const outsideDialog = document.createElement(config.selector.DIV);
        outsideDialog.className = config.css_class.OUTSIDE_DIALOG;

        this.dialog = document.createElement(config.selector.DIV);
        this.dialog.className = config.css_class.DIALOG;

        const close = document.createElement(config.selector.DIV);
        close.className = config.css_class.CLOSE;
        close.innerHTML = '<i class="fas fa-times"></i>';

        this.dialog.addEventListener(config.event_listener.MOUSEDOWN, () => {
            event.stopPropagation();
        });
        close.addEventListener(config.event_listener.CLICK, () => {
            this.hideDialog();
        });
        outsideDialog.addEventListener(config.event_listener.MOUSEDOWN, () => {
            this.hideDialog();
        });

        this.dialog.appendChild(close);
        outsideDialog.appendChild(this.dialog);
        this.component = outsideDialog;
    }

    showDialog(){
        this.component.classList.add(config.css_class.ACTIVE_FLEX);
    }

    hideDialog(){
        this.component.classList.remove(config.css_class.ACTIVE_FLEX);
    }
}