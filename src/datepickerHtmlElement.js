import {config} from './config';
import {Calendar} from './calendar';

export class DatepickerHtmlElement {
    /**
     *
     * @param id Id for binding with input[type="date_picker"], where data-id = id
     * @param params hideSelectedDate - Hide display selected date,
     * @param params hideCurrentDate - Hide display current date,
     * @param params hideHover - Hide display hover,
     * @param params hideWeekend - Hide display weekend
     *
     */
    constructor(params = {}) {
        this.params = {
            hideSelectedDate: params.hideSelectedDate || false,
            hideCurrentDate: params.hideCurrentDate || false,
            hideHover: params.hideHover || false,
            hideWeekend: params.hideWeekend || false,
            defaultDate: params.defaultDate || null
        };

        this.clickDatepicker = false;
        this.date = new Calendar(this.params.defaultDate);

        this.calendar = document.createElement(config.SELECTOR_DIV);
        this.calendar.className = config.CSS_CLASS_DATE_PICKER;

        const dateInputWrapper = document.createElement(config.SELECTOR_DIV);
        dateInputWrapper.className = config.CSS_CLASS_DATE_INPUT_WRAPPER;

        const selectMonth = document.createElement(config.SELECTOR_SELECT);
        selectMonth.id = config.CSS_ID_MONTH;

        config.MONTH.forEach((el, index) => {
            const option = document.createElement(config.SELECTOR_OPTION);
            option.value = `${index}`;
            option.innerText = el;
            selectMonth.appendChild(option);
        });

        selectMonth.value = this.date.selectedMonth.getMonth() + '';

        const inputYear = document.createElement(config.SELECTOR_INPUT);

        inputYear.id = config.CSS_ID_YEAR;
        inputYear.type = config.ATTRIBUTE_TYPE_NUMBER;
        inputYear.value = this.date.selectedMonth.getFullYear() + '';

        const daysOfWeek = document.createElement(config.SELECTOR_DIV);
        daysOfWeek.className = config.CSS_CLASS_DAYS_OF_WEEK;

        config.DAYS_OF_WEEK.forEach(name => {
            const dayOfWeek = document.createElement(config.SELECTOR_DIV);
            dayOfWeek.className = config.CSS_CLASS_DAY_OF_WEEK;

            const spanDayOfWeek = document.createElement(config.SELECTOR_SPAN);
            spanDayOfWeek.innerText = name;

            dayOfWeek.appendChild(spanDayOfWeek);
            daysOfWeek.appendChild(dayOfWeek);
        });

        let daysOfMonth = this.createDaysOfMonth(this.date.selectedMonth.arrayDaysInMonth());

        dateInputWrapper.appendChild(selectMonth);

        dateInputWrapper.appendChild(inputYear);

        this.calendar.appendChild(dateInputWrapper);

        this.calendar.appendChild(daysOfWeek);

        this.calendar.appendChild(daysOfMonth);

        /* Add event-listeners  */

        this.calendar.addEventListener(config.EVENT_LISTENER_MOUSEDOWN, () => {
            this.clickDatepicker = true;
        });

        selectMonth.addEventListener(config.EVENT_LISTENER_CHANGE, () => {
            this.switchMonth(+inputYear.value, +selectMonth.value);
        });

        inputYear.addEventListener(config.EVENT_LISTENER_CHANGE, () => {
            this.switchMonth(+inputYear.value, +selectMonth.value);
        });
    }

    createDaysOfMonth(arrayDate) {
        const daysOfMonth = document.createElement(config.SELECTOR_DIV);
        daysOfMonth.className = config.CSS_CLASS_DAYS_OF_MONTH;

        if (!this.params.hideHover) {
            daysOfMonth.classList.add(config.CSS_CLASS_SHOW_HOVER);
        }

        for (let i = 0; i < arrayDate.length; i++) {
            const rowDaysOfMonth = document.createElement(config.SELECTOR_DIV);
            rowDaysOfMonth.className = config.CSS_CLASS_ROW_DAYS_OF_MONTH;

            for (let j = 0; j < 7; j++) {
                const dayOfMonth = document.createElement(config.SELECTOR_DIV);
                dayOfMonth.className = config.CSS_CLASS_DAY_OF_MONTH;

                if (!this.params.hideWeekend && (j === 0 || j === 6)) {
                    dayOfMonth.classList.add(config.CSS_CLASS_WEEKEND);
                }
                if (arrayDate[i][j] !== '') {
                    const spanDayOfMonth = document.createElement(config.SELECTOR_SPAN);
                    spanDayOfMonth.innerText = arrayDate[i][j];

                    this.selectDateEvent(dayOfMonth, arrayDate[i][j]);

                    if (new Date().getFullYear() === this.date.selectedMonth.getFullYear()
                        && new Date().getMonth() === this.date.selectedMonth.getMonth()
                        && new Date().getDate() === +arrayDate[i][j]
                        && !this.params.hideCurrentDate) {
                        dayOfMonth.classList.add(config.CSS_CLASS_TODAY);
                    }
                    dayOfMonth.classList.add(config.CSS_CLASS_ENABLED);
                    dayOfMonth.appendChild(spanDayOfMonth);
                }
                rowDaysOfMonth.appendChild(dayOfMonth);
            }

            daysOfMonth.appendChild(rowDaysOfMonth);
        }
        return daysOfMonth;
    }

    connectWithInput(index, defaultDatepicker = null) {
        this.id = index;
        const datepicker = defaultDatepicker || document.querySelector(config.SELECTOR_INPUT_DATE_PICKER + `[data-id="${this.id}"]`);
        datepicker.value = (this.date.selectedDate && this.date.selectedDate.formatForInput()) || '';
        datepicker.addEventListener(config.EVENT_LISTENER_FOCUS, () => {
            this.showDatepicker();
        });

        datepicker.addEventListener(config.EVENT_LISTENER_BLUR, () => {
            if (this.clickDatepicker) {
                datepicker.focus();
            } else {
                this.hideDatepicker();
                this.replaceDate(Calendar.validDate(datepicker.value));
            }

            this.clickDatepicker = false;
        });

    }

    selectDateEvent(daySelector, dayDate) {
        daySelector.addEventListener(config.EVENT_LISTENER_CLICK, () => {
            const input = document.querySelector(config.SELECTOR_INPUT_DATE_PICKER + `[data-id="${this.id}"]`);

            this.date.setSelectedDate({
                year: this.date.selectedMonth.getFullYear(),
                month: this.date.selectedMonth.getMonth(),
                day: dayDate
            });
            input.value = this.date.selectedDate.formatForInput();

            const selectedDay = this.calendar.childNodes[2].querySelector(`.${config.CSS_CLASS_SELECTED}`);
            if (selectedDay) {
                selectedDay.classList.remove(config.CSS_CLASS_SELECTED);
            }

            daySelector.classList.add(config.CSS_CLASS_SELECTED);
            input.blur();
        });
    }

    switchMonth(inputYear = new Date().getFullYear(), selectMonth = new Date().getMonth()) {
        this.date.replaceMonth(inputYear, selectMonth);

        this.calendar.replaceChild(
            this.createDaysOfMonth(this.date.selectedMonth.arrayDaysInMonth()),
            this.calendar.childNodes[2]
        );
    }

    // selectCoordinates(top, left) {
    //     this.calendar.style.top = `${top}px`;
    //     this.calendar.style.left = `${left}px`;
    // }

    setSelectedDateView(date) {
        this.date.setSelectedDate(date);
        if (this.date.selectedMonth.getMonth() === date.month &&
            this.date.selectedMonth.getFullYear() === date.year) {
            this.calendar.childNodes[2].querySelectorAll('.enabled').forEach((el, index) => {
                if (index + 1 === date.day) {
                    el.classList.add(config.CSS_CLASS_SELECTED);
                }
            });
        }
    }

    showDatepicker() {
        this.calendar.classList.add(config.CSS_CLASS_ACTIVE);
    }

    hideDatepicker() {
        this.calendar.classList.remove(config.CSS_CLASS_ACTIVE);
    }

    /**
     * Replace date in datepicker and input
     * @param date Object = { year,month,day}
     */
    replaceDate(date) {
        if (date) {
            const input = document.querySelector(config.SELECTOR_INPUT_DATE_PICKER + `[data-id="${this.id}"]`);
            this.switchMonth(date.year, date.month);

            if (!this.params.hideSelectedDate) {
                this.setSelectedDateView(date);
            }

            input.value = this.date.selectedDate.formatForInput();
            this.calendar.childNodes[0].childNodes[1].value = date.year;
            this.calendar.childNodes[0].childNodes[0].value = date.month;
        }
    }

}














