import {config} from './config';
import {DateForMonth} from './dateForMonth';

export class InputTime {
    constructor(params = {}) {
        this.params = {
            addHours: params.addHours || 0,
            addMinutes: params.addMinutes || 0,
            defaultHours: params.defaultHours || 0,
            defaultMinutes: params.defaultMinutes || 0
        };
        this.input = document.createElement(config.SELECTOR_INPUT);
        this.input.className = config.CSS_CLASS_INPUT_TIME;
        this.input.addEventListener(config.EVENT_LISTENER_CLICK, () => {
            this.select.classList.add(config.CSS_CLASS_ACTIVE);
        });
        this.input.addEventListener(config.EVENT_LISTENER_BLUR, () => {
            this.select.classList.remove(config.CSS_CLASS_ACTIVE);
        });

        this.wrapper = document.createElement(config.SELECTOR_DIV);
        this.wrapper.classList.add(config.CSS_CLASS_INPUT_TIME_WRAPPER);
        this.wrapper.style.height = '20px';


        this.select = document.createElement(config.SELECTOR_DIV);
        this.select.className = config.CSS_CLASS_SELECT_TIME;

        for (let i = 0; i < 48; i++) {
            const div = document.createElement(config.SELECTOR_DIV);
            div.className = config.CSS_CLASS_OPTION_TIME;
            const time = new DateForMonth(2019, 0, 1, this.params.defaultHours, this.params.defaultMinutes)
                .formatForInputTime((i / 2) | 0, (i % 2) * 30);

            div.innerHTML = `${time}${(params.defaultHours)?' ('+i/2 +'ч.)': ''}`;

            div.addEventListener(config.EVENT_LISTENER_MOUSEDOWN, () => {
                console.log(1);

                this.input.value = time;
            });
            this.select.appendChild(div);
        }

        this.input.value = new DateForMonth().formatForInputTime(this.params.addHours, this.params.addMinutes);

        this.hours = this.input.value[0] + this.input.value[1];
        this.minutes = this.input.value[3] + this.input.value[4];


        this.wrapper.appendChild(this.input);
        this.wrapper.appendChild(this.select);
    }

}
