import './style.css';
import { config } from './config';
import { CalendarMonthHtmlElement } from './calendarMonthHtmlElement';

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll(config.selector.DIV_CALENDAR).forEach((datepicker, index) => {
        const calendar = new CalendarMonthHtmlElement(index, {
            hideSelectedDate: false,
            hideHover: false,
            hideCurrentDate: false,
            hideWeekend: false
        });

        datepicker.appendChild(calendar.calendar);
    });
});
