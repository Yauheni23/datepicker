import './style.css';
import {config} from './config';
import {DatepickerHtmlElement} from './datepickerHtmlElement';

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll(config.SELECTOR_INPUT_DATE_PICKER).forEach((datepicker, index) => {
        datepicker.dataset.id = index + '';

        const calendar = new DatepickerHtmlElement(index, {
            hideSelectedDate: false,
            hideHover: false,
            hideCurrentDate: false,
            hideWeekend: false
        });

        calendar.selectCoordinates(datepicker.getBoundingClientRect().bottom, datepicker.getBoundingClientRect().left);

        datepicker.addEventListener(config.EVENT_LISTENER_FOCUS, () => {
            calendar.showDatepicker();
        });

        datepicker.addEventListener(config.EVENT_LISTENER_BLUR, () => {
            if (calendar.clickDatepicker) {
                datepicker.focus();
            } else {
                calendar.hideDatepicker();
                calendar.replaceMonthFromInput(datepicker.value);
            }

            calendar.clickDatepicker = false;
        });

        document.body.appendChild(calendar.calendar);
    });
});
