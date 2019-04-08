import './style.css';
import {config} from './config';
import {DateForMonth} from './DateForMonth';
import {Calendar} from './calendar';

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll(config.SELECTOR_INPUT_DATE_PICKER).forEach((datepicker, index) => {
        datepicker.dataset.id = index + '';

        const calendar = new Calendar(new DateForMonth(), index, {
            hideSelectedDate: false,
            hideHover: false,
            hideCurrentDate: false
        });

        calendar.selectCoordinates(datepicker.getBoundingClientRect().bottom, datepicker.getBoundingClientRect().left);

        datepicker.addEventListener(config.EVENT_LISTENER_FOCUS, () => {
            calendar.calendar.classList.add(config.CSS_CLASS_ACTIVE);
        });

        datepicker.addEventListener(config.EVENT_LISTENER_BLUR, () => {
            if (calendar.clickDatepicker) {
                datepicker.focus();
            } else {
                calendar.calendar.classList.remove(config.CSS_CLASS_ACTIVE);

                const validDate = calendar.validDate(datepicker.value);
                if (validDate.valid) {
                    calendar.replaceMonth(validDate.year, validDate.month, validDate.day);
                    if (!calendar.params.hideSelectedDate) {
                        calendar.setSelectedDate(validDate);
                    }

                    calendar.calendar.childNodes[0].childNodes[1].value = validDate.year;
                    calendar.calendar.childNodes[0].childNodes[0].value = validDate.month;
                }
            }

            calendar.clickDatepicker = false;

        });

        document.body.appendChild(calendar.calendar);

    });
});
