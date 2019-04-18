import { config } from '../../config';
import { DateForMonth } from '../../dateForMonth';

export class InputTime {
  constructor(params = {}) {
    this.setDefaultParams(params);
    this.component = document.createElement(config.selector.DIV);
    this.component.className = config.css_class.INPUT_TIME_WRAPPER;
    this.input = document.createElement(config.selector.INPUT);
    this.input.className = config.css_class.INPUT_TIME;
    this.select = this.createSelectTime(this.params.defaultHours, this.params.defaultMinutes);

    this.addEventListenersForInput();

    this.input.value = new DateForMonth().formatForInputTime(this.params.addHours, this.params.addMinutes);

    this.hours = this.input.value[0] + this.input.value[1];
    this.minutes = this.input.value[3] + this.input.value[4];

    this.component.appendChild(this.input);
    this.component.appendChild(this.select);
  }

  createSelectTime(defaultHours, defaultMinutes) {
    const select = document.createElement(config.selector.DIV);
    select.className = config.css_class.SELECT_TIME;
    for (let i = 0; i < 48; i++) {
      const div = document.createElement(config.selector.DIV);
      div.className = config.css_class.OPTION_TIME;
      const time = new DateForMonth(2019, 0, 1, defaultHours, defaultMinutes)
        .formatForInputTime((i / 2) | 0, (i % 2) * 30);

      div.innerHTML = `${ time }${ (this.params.useDuration) ? ' (' + i / 2 + 'ч.)' : '' }`;
      div.addEventListener(config.event_listener.MOUSEDOWN, () => {
        event.stopPropagation();
        this.input.value = time;
        this.updateTime();
        setTimeout(() => {
          this.input.focus();
        }, 0);
      });

      select.appendChild(div);
    }
    return select;
  }

  addEventListenersForInput() {
    this.input.addEventListener(config.event_listener.CLICK, () => {
      this.select.classList.add(config.css_class.ACTIVE);
    });
    this.input.addEventListener(config.event_listener.BLUR, () => {
      this.select.classList.remove(config.css_class.ACTIVE);
    });
  }

  replaceSelectTime(hours, minutes, useDuration = true) {
    this.params.useDuration = useDuration;
    const select = this.createSelectTime(hours, minutes);
    this.component.replaceChild(
      select,
      this.component.childNodes[1]
    );
    this.input.addEventListener(config.event_listener.CLICK, () => {
      select.classList.add(config.css_class.ACTIVE);
    });

    this.input.addEventListener(config.event_listener.BLUR, () => {
      select.classList.remove(config.css_class.ACTIVE);
    });
  }

  setDefaultParams(params) {
    this.params = {
      addHours: params.addHours || 0,
      addMinutes: params.addMinutes || 0,
      defaultHours: params.defaultHours || null,
      defaultMinutes: params.defaultMinutes || null,
      useDuration: params.useDuration || false
    };
  }

  updateTime() {
    const hours = this.input.value[0] + this.input.value[1];
    const minutes = this.input.value[3] + this.input.value[4];

    if (hours.length === 2 && +hours >= 0 && +hours <= 23
      && minutes.length === 2 && +minutes >= 0 && +minutes <= 59) {
      this.hours = hours;
      this.minutes = minutes;
    }
  }
}
