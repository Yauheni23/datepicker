import { config } from '../../config';
import { Calendar } from '../../calendar';
import { DateForMonth } from '../../dateForMonth';

export class DatePicker {
    constructor(params = {}) {
        this.setDefaultParams(params);
        this.clickdatePicker = false;
        this.date = new Calendar(this.params.defaultDate);

        this.calendar = document.createElement(config.selector.DIV);
        this.calendar.className = config.css_class.DATE_PICKER;

        this.createDatePickerHtmlElement();

        this.addEventListenerForDatePicker();
    }

    set selectedDate(date) {
        this.date.selectedDate = new DateForMonth(date);
        this.replaceDate({
            year: this.date.selectedDate.getFullYear(),
            month: this.date.selectedDate.getMonth(),
            day: this.date.selectedDate.getDate(),
        });
    }

    createDatePickerHtmlElement() {
        this.createDateSelectWrapperHtmlElement();
        this.createDaysOfWeekHtmlElement();
        this.calendar.appendChild(this.createDaysOfMonthHtmlElement(this.date.selectedMonth.arrayDaysInMonth()));
    }

    createSelectMonthHtmlElement() {
        this.selectMonth = document.createElement(config.selector.SELECT);
        this.selectMonth.id = config.css_id.MONTH;
        this.selectMonth.value = this.date.selectedMonth.getMonth() + '';
        config.MONTH.forEach((el, index) => {
            const option = document.createElement(config.selector.OPTION);
            option.value = `${ index }`;
            option.innerText = el;
            this.selectMonth.appendChild(option);
        });
    }

    createInputYearHtmlElement() {
        this.inputYear = document.createElement(config.selector.INPUT);
        this.inputYear.id = config.css_id.YEAR;
        this.inputYear.type = config.attribute.TYPE_NUMBER;
        this.inputYear.value = this.date.selectedMonth.getFullYear() + '';
    }

    createDateSelectWrapperHtmlElement() {
        const dateInputWrapper = document.createElement(config.selector.DIV);
        dateInputWrapper.className = config.css_class.DATE_INPUT_WRAPPER;

        this.createSelectMonthHtmlElement();
        this.createInputYearHtmlElement();

        dateInputWrapper.appendChild(this.selectMonth);
        dateInputWrapper.appendChild(this.inputYear);

        this.calendar.appendChild(dateInputWrapper);
    }

    createDaysOfWeekHtmlElement() {
        const daysOfWeek = document.createElement(config.selector.DIV);
        daysOfWeek.className = config.css_class.DAYS_OF_WEEK;

        config.DAYS_OF_WEEK.forEach(name => {
            const dayOfWeek = document.createElement(config.selector.DIV);
            dayOfWeek.className = config.css_class.DAY_OF_WEEK;

            const spanDayOfWeek = document.createElement(config.selector.SPAN);
            spanDayOfWeek.innerText = name;

            dayOfWeek.appendChild(spanDayOfWeek);
            daysOfWeek.appendChild(dayOfWeek);
        });

        this.calendar.appendChild(daysOfWeek);
    }

    addEventListenerForDatePicker() {
        this.addEventListenerForSwitchMonth(this.selectMonth);
        this.addEventListenerForSwitchMonth(this.inputYear);

        this.calendar.addEventListener(config.event_listener.MOUSEDOWN, () => {
            this.clickDatepicker = true;
        });
    }

    addEventListenerForSwitchMonth(element) {
        element.addEventListener(config.event_listener.CHANGE, () => {
            this.switchMonth(+this.inputYear.value, +this.selectMonth.value);
        });
    }

    createDaysOfMonthHtmlElement(arrayDate) {
        const daysOfMonth = document.createElement(config.selector.DIV);
        daysOfMonth.className = config.css_class.DAYS_OF_MONTH;
        if (!this.params.hideHover) {
            daysOfMonth.classList.add(config.css_class.SHOW_HOVER);
        }
        for (let i = 0; i < 6; i++) {
            const rowDaysOfMonth = document.createElement(config.selector.DIV);
            rowDaysOfMonth.className = config.css_class.ROW_DAYS_OF_MONTH;

            for (let j = 0; j < 7; j++) {
                const dayOfMonth = document.createElement(config.selector.DIV);
                dayOfMonth.className = config.css_class.DAY_OF_MONTH;

                if (!this.params.hideWeekend && (j === 0 || j === 6)) {
                    dayOfMonth.classList.add(config.css_class.WEEKEND);
                }
                const spanDayOfMonth = document.createElement(config.selector.SPAN);

                dayOfMonth.appendChild(spanDayOfMonth);
                rowDaysOfMonth.appendChild(dayOfMonth);
            }

            daysOfMonth.appendChild(rowDaysOfMonth);
        }
        this.fillMonth(daysOfMonth, arrayDate);
        return daysOfMonth;
    }

    fillMonth(daysOfMonth, arrayDate) {
        arrayDate.forEach((week, i) => {
            daysOfMonth.childNodes[i].classList.add(config.css_class.ACTIVE_FLEX);
            week.forEach((day, j) => {
                const dayHtmlElement = daysOfMonth.childNodes[i].childNodes[j];
                dayHtmlElement.firstChild.innerText = day;
                if (day !== '') {
                    this.selectDateEvent(dayHtmlElement, day);
                    if (new Date().getFullYear() === this.date.selectedMonth.getFullYear()
                        && new Date().getMonth() === this.date.selectedMonth.getMonth()
                        && new Date().getDate() === +arrayDate[i][j]
                        && !this.params.hideCurrentDate) {
                        dayHtmlElement.classList.add(config.css_class.TODAY);
                    }
                    dayHtmlElement.classList.add(config.css_class.ENABLED);
                }
            });
        });

    }

    setDefaultParams(params) {
        this.params = {
            hideSelectedDate: params.hideSelectedDate || false,
            hideCurrentDate: params.hideCurrentDate || false,
            hideHover: params.hideHover || false,
            hideWeekend: params.hideWeekend || false,
            defaultDate: params.defaultDate || null
        };
    }


    connectWithInput(index, defaultDatepicker = null) {
        this.id = index;
        const datepicker = defaultDatepicker
            || document.querySelector(config.selector.INPUT_DATE_PICKER
                + `[data-id="${ this.id }"]`);
        datepicker.value = (this.date.selectedDate && this.date.selectedDate.formatForInput()) || '';
        datepicker.addEventListener(config.event_listener.FOCUS, () => {
            this.showDatepicker();
        });

        datepicker.addEventListener(config.event_listener.BLUR, () => {
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
        daySelector.addEventListener(config.event_listener.CLICK, () => {
            const input = document.querySelector(config.selector.INPUT_DATE_PICKER
                + `[data-id="${ this.id }"]`);

            this.date.setSelectedDate({
                year: this.date.selectedMonth.getFullYear(),
                month: this.date.selectedMonth.getMonth(),
                day: dayDate
            });
            input.value = this.date.selectedDate.formatForInput();

            const selectedDay = this.calendar.childNodes[2].querySelector(`.${ config.css_class.SELECTED }`);
            if (selectedDay) {
                selectedDay.classList.remove(config.css_class.SELECTED);
            }
            daySelector.classList.add(config.css_class.SELECTED);
            input.blur();
        });
    }

    switchMonth(inputYear = new Date().getFullYear(), selectMonth = new Date().getMonth()) {
        this.date.replaceMonth(inputYear, selectMonth);

        this.calendar.replaceChild(
            this.createDaysOfMonthHtmlElement(this.date.selectedMonth.arrayDaysInMonth()),
            this.calendar.childNodes[2]
        );
    }

    setSelectedDateView(date) {
        this.date.setSelectedDate(date);
        if (this.date.selectedMonth.getMonth() === date.month &&
            this.date.selectedMonth.getFullYear() === date.year) {
            this.calendar.childNodes[2].querySelectorAll(`.${ config.css_class.ENABLED }`)
                .forEach((el, index) => {
                    if (index + 1 === date.day) {
                        el.classList.add(config.css_class.SELECTED);
                    }
                });
        }
    }

    showDatepicker() {
        this.calendar.classList.add(config.css_class.ACTIVE);
    }

    hideDatepicker() {
        this.calendar.classList.remove(config.css_class.ACTIVE);
    }

    replaceDate(date) {
        if (date) {
            const input = document.querySelector(config.selector.INPUT_DATE_PICKER
                + `[data-id="${ this.id }"]`);
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














