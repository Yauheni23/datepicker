import './style.css';
import { config } from './config';
import { CalendarMonthHtmlElement } from './calendarMonthHtmlElement';

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll(config.selector.DIV_CALENDAR).forEach(datepicker => {
    const calendar = new CalendarMonthHtmlElement({
      hideSelectedDate: false,
      hideHover: false,
      hideCurrentDate: false,
      hideWeekend: false
    });
    datepicker.appendChild(calendar.calendar);
  });
});
