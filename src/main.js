import './style.css';
import {config} from './config';
import {DatepickerHtmlElement} from './datepickerHtmlElement';

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll(config.SELECTOR_INPUT_DATE_PICKER).forEach((datepicker, index) => {
        datepicker.dataset.id = index + '';

        const calendar = new DatepickerHtmlElement({
            hideSelectedDate: false,
            hideHover: false,
            hideCurrentDate: false,
            hideWeekend: false
        });

        calendar.connectWithInput(index);

        document.body.appendChild(calendar.calendar);
    });
});
