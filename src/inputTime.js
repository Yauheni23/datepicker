import {config} from './config';
import {DateForMonth} from './dateForMonth';

export class InputTime {
    constructor(params = {}) {
        this.params = {
            addHours: params.addHours || 0,
            addMinutes: params.addMinutes || 0,
            defaultHours: params.defaultHours || null,
            defaultMinutes: params.defaultMinutes || null,
            useDuration: params.useDuration || false
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


        this.select = this.createSelectTime(this.params.defaultHours, this.params.defaultMinutes);

        this.createSelectTime();

        this.input.value = new DateForMonth().formatForInputTime(this.params.addHours, this.params.addMinutes);

        this.hours = this.input.value[0] + this.input.value[1];
        this.minutes = this.input.value[3] + this.input.value[4];


        this.wrapper.appendChild(this.input);
        this.wrapper.appendChild(this.select);

    }

    createSelectTime(defaultHours, defaultMinutes) {
        const select = document.createElement(config.SELECTOR_DIV);
        select.className = config.CSS_CLASS_SELECT_TIME;
        for (let i = 0; i < 48; i++) {
            const div = document.createElement(config.SELECTOR_DIV);
            div.className = config.CSS_CLASS_OPTION_TIME;
            const time = new DateForMonth(2019, 0, 1, defaultHours, defaultMinutes)
                .formatForInputTime((i / 2) | 0, (i % 2) * 30);

            div.innerHTML = `${time}${(this.params.useDuration)?' ('+i/2 +'ч.)': ''}`;

            div.addEventListener(config.EVENT_LISTENER_MOUSEDOWN, () => {
                this.input.value = time;

                this.updateTime();
                setTimeout(()=> {
                    this.input.focus();
                }, 0);
            });
            select.appendChild(div);
        }

        return select;
    }

    replaceSelectTime(hours, minutes, useDuration = true) {
        this.params.useDuration = useDuration;
        const select = this.createSelectTime(hours, minutes);
        this.wrapper.replaceChild(
            select,
            this.wrapper.childNodes[1]
        );
        this.input.addEventListener(config.EVENT_LISTENER_CLICK, () => {
            select.classList.add(config.CSS_CLASS_ACTIVE);
        });

        this.input.addEventListener(config.EVENT_LISTENER_BLUR, () => {
            select.classList.remove(config.CSS_CLASS_ACTIVE);
        });
    }

    updateTime() {
        const hours = this.input.value[0] + this.input.value[1];
        const minutes = this.input.value[3] + this.input.value[4];

        if (hours.length === 2 && +hours >= 0 && +hours <= 23
            && minutes.length === 2 && +minutes >= 0 && +minutes <= 59){
            this.hours = hours;
            this.minutes = minutes;
        }
    }
}
