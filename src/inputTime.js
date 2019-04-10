import {config} from './config';
import {DateForMonth} from './dateForMonth';

export class InputTime {
    constructor(params = {}) {
        this.params = {
            addHours: params.addHours || 0,
            addMinutes: params.addMinutes || 0,
        };
        this.input = document.createElement(config.SELECTOR_INPUT);
        this.input.className = config.CSS_CLASS_INPUT_TIME;

        this.select = document.createElement(config.SELECTOR_DIV);
        this.select.className = config.CSS_CLASS_SELECT_TIME;

        this.input.value = new DateForMonth().formatForInputTime(this.params.addHours, this.params.addMinutes);

    }
}
