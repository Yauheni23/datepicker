import { config } from '../../config';
import { InputTime } from './inputTime';

export class AddTime {
  constructor() {
    this.component = document.createElement(config.selector.DIV);

    this.button = document.createElement(config.selector.BUTTON);
    this.button.className = `${ config.css_class.BUTTON_ADD_TIME } ${config.css_class.bootstrap.BTN_OUTLINE_PRIMARY}`;
    this.button.innerHTML = config.text.BUTTON_ADD_TIME;

    this.button.addEventListener(config.event_listener.CLICK, () => {
      this.createComponentForTime();
      this.hideButton();
    });

    this.component.appendChild(this.button);
  }

  showButton() {
    this.component.replaceChild(this.button, this.component.firstChild);
  }

  hideButton() {
    this.component.replaceChild(this.timeWrapper, this.component.firstChild);
  }

  isTimeWrapper() {
    return this.component.contains(this.timeWrapper);
  }

  createComponentForTime() {
    this.timeWrapper = document.createElement(config.selector.DIV);
    this.timeWrapper.className = config.css_class.TIME_WRAPPER;

    this.startComponent = new InputTime();
    this.endComponent = new InputTime({
      addHours: 1,
      defaultHours: this.startComponent.hours,
      defaultMinutes: this.startComponent.minutes,
      useDuration: true
    });

    this.timeWrapper.appendChild(this.startComponent.component);
    const div = document.createElement(config.selector.DIV);
    div.innerHTML = '<span>-</span>';
    this.timeWrapper.appendChild(div);
    this.timeWrapper.appendChild(this.endComponent.component);
  }
}