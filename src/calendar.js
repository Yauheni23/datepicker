import { config } from './config';
import { DateForMonth } from './DateForMonth';

export class Calendar {
    /**
     *
     * @param selectedMonth A month
     * @param id Id for binding with input[type="date_picker"], where data-id = id
     * @param params hideSelectedDate - Hide display selected date,
     * @param params hideCurrentDate - Hide display current date,
     * @param params hideHover - Hide display hover,
     * @param params hideWeekend - Hide display weekend
     *
     */
    constructor(selectedMonth = new DateForMonth(), id = 1, params = {}) {
        this.params = {
            hideSelectedDate: params.hideSelectedDate || false,
            hideCurrentDate: params.hideCurrentDate || false,
            hideHover: params.hideHover || false,
            hideWeekend: params.hideWeekend || false,
        };

        this.clickDatepicker = false;
        this.selectedDate = null;
        this.selectedMonth = selectedMonth;
        this.id = id;
        this.calendar = document.createElement(config.SELECTOR_DIV);

        this.calendar.className = config.CSS_CLASS_CALENDAR;
        this.calendar.dataset.id = this.id;

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

        selectMonth.value = this.selectedMonth.getMonth() + '';

        const inputYear = document.createElement(config.SELECTOR_INPUT);

        inputYear.id = config.CSS_ID_YEAR;
        inputYear.type = config.ATTRIBUTE_TYPE_NUMBER;
        inputYear.value = this.selectedMonth.getFullYear() + '';

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

        let daysOfMonth = this.createDaysOfMonth(this.selectedMonth.arrayDaysInMonth());


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
            this.replaceMonth(+inputYear.value, +selectMonth.value);
        });

        inputYear.addEventListener(config.EVENT_LISTENER_CHANGE, () => {
            this.replaceMonth(+inputYear.value, +selectMonth.value);
        });
    }

    /**
     * Create view month
     * @param arrayDate Array[week of month][day of week] = 'date of month'
     * @returns {HTMLDivElement}
     */
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
                if(!this.params.hideWeekend && (j === 0 || j === 6)) { dayOfMonth.classList.add(config.CSS_CLASS_WEEKEND); }
                if (arrayDate[i][j] !== '') {
                    const spanDayOfMonth = document.createElement(config.SELECTOR_SPAN);
                    spanDayOfMonth.innerText = arrayDate[i][j];

                    this.selectDate(dayOfMonth, arrayDate[i][j]);

                    if (new Date().getFullYear() === this.selectedMonth.getFullYear()
                        && new Date().getMonth() === this.selectedMonth.getMonth()
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

    /**
     * Show selected date
     * @param daySelector
     * @param dayDate
     */

    selectDate(daySelector, dayDate) {
        daySelector.addEventListener(config.EVENT_LISTENER_CLICK, () => {
            const input = document.querySelector(config.SELECTOR_INPUT_DATE_PICKER + `[data-id="${this.id}"]`);

            this.selectedDate = new DateForMonth(this.selectedMonth.getFullYear(),
                this.selectedMonth.getMonth(), dayDate);
            input.value = this.selectedDate.formatForInput();

            const selectedDay = this.calendar.childNodes[2].querySelector(`.${config.CSS_CLASS_SELECTED}`);
            if (selectedDay) {
                selectedDay.classList.remove(config.CSS_CLASS_SELECTED);
            }

            daySelector.classList.add(config.CSS_CLASS_SELECTED);
            input.blur();
        });
    }

    /**
     * Replace month
     * @param inputYear
     * @param selectMonth
     */

    replaceMonth(inputYear = new Date().getFullYear(), selectMonth = new Date().getMonth()) {
        this.selectedMonth = new DateForMonth(inputYear, selectMonth);
        this.calendar.replaceChild(
            this.createDaysOfMonth(this.selectedMonth.arrayDaysInMonth()),
            this.calendar.childNodes[2]
        );
    }

    /**
     * Coordinates datepicker
     * @param top
     * @param left
     */
    selectCoordinates(top, left) {
        this.calendar.style.top = `${top}px`;
        this.calendar.style.left = `${left}px`;
    }

    /**
     * Validation date in input
     * @param dateStr
     */
    validDate(dateStr) {
        const selectedDate = dateStr.split('-');
        const date = {};

        if ((+selectedDate[0] >= 1000)
            && (+selectedDate[0] < 9999)
            && (+selectedDate[1] >= 1)
            && (+selectedDate[1] <= 12)
            && (+selectedDate[2] >= 1)
            && (+selectedDate[2] <= new DateForMonth(+selectedDate[0], +selectedDate[1]).daysInMonth())) {
            date.valid = true;
            date.year = +selectedDate[0];
            date.month = +selectedDate[1] - 1;
            date.day = +selectedDate[2];
        }

        return date;
    }

    /**
     * Show selected date
     * @param date
     */
    setSelectedDate(date) {
        this.selectedDate = new DateForMonth(date.year, date.month, date.day);
        if (this.selectedMonth.getMonth() === date.month &&
            this.selectedMonth.getFullYear() === date.year) {
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
    /**
     * Hide datepicker
     * @param date
     */
    hideDatepicker() {
        this.calendar.classList.remove(config.CSS_CLASS_ACTIVE);
    }

    /**
     * Replace Month From Input
     * @param date
     */
    replaceMonthFromInput(date) {
        const validDate = this.validDate(date);
        if (validDate.valid) {
            this.replaceMonth(validDate.year, validDate.month, validDate.day);
            if (!this.params.hideSelectedDate) {
                this.setSelectedDate(validDate);
            }

            this.calendar.childNodes[0].childNodes[1].value = validDate.year;
            this.calendar.childNodes[0].childNodes[0].value = validDate.month;
        }
    }



}














