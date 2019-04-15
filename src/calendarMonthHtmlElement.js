import {config} from './config';
import {Calendar} from './calendar';
import {Dialog} from './dialog';
import {DateForMonth} from './dateForMonth';

export class CalendarMonthHtmlElement {

    constructor(id = 1, params = {}) {
        this.params = {
            hideSelectedDate: params.hideSelectedDate || false,
            hideCurrentDate: params.hideCurrentDate || false,
            hideHover: params.hideHover || false,
            hideWeekend: params.hideWeekend || false,
        };

        this.date = new Calendar(new DateForMonth());
        this.id = id;
        this.calendar = document.createElement(config.SELECTOR_DIV);

        this.calendar.className = config.CSS_CLASS_CALENDAR_MONTH;
        this.calendar.dataset.id = this.id;

        const today = document.createElement(config.SELECTOR_DIV);
        today.className = `btn btn-outline-primary ${config.CSS_CLASS_BUTTON_TODAY}`;
        today.innerHTML = `<span>${config.TEXT_BUTTON_TODAY}</span>`;
        today.addEventListener(config.EVENT_LISTENER_CLICK, () => {
            this.goToDate();

        });


        const dateInputWrapper = document.createElement(config.SELECTOR_DIV);
        dateInputWrapper.className = config.CSS_CLASS_DATE_INPUT_WRAPPER;

        const selectMonth = document.createElement(config.SELECTOR_SELECT);
        selectMonth.id = config.CSS_ID_MONTH_CALENDAR_MONTH;

        config.MONTH_CALENDAR_MONTH.forEach((el, index) => {
            const option = document.createElement(config.SELECTOR_OPTION);
            option.value = `${index}`;
            option.innerText = el;
            selectMonth.appendChild(option);
        });

        selectMonth.value = this.date.selectedMonth.getMonth() + '';

        const inputYear = document.createElement(config.SELECTOR_INPUT);

        inputYear.id = config.CSS_ID_YEAR_CALENDAR_MONTH;
        inputYear.type = config.ATTRIBUTE_TYPE_NUMBER;
        inputYear.value = this.date.selectedMonth.getFullYear() + '';

        const daysOfWeek = document.createElement(config.SELECTOR_DIV);
        daysOfWeek.className = config.CSS_CLASS_DAYS_OF_WEEK;

        config.DAYS_OF_WEEK_CALENDAR_MONTH.forEach(name => {
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

        this.calendar.appendChild(today);

        /* Add event-listeners  */

        selectMonth.addEventListener(config.EVENT_LISTENER_CHANGE, () => {
            this.switchMonth(+inputYear.value, +selectMonth.value);
        });

        inputYear.addEventListener(config.EVENT_LISTENER_CHANGE, () => {
            this.switchMonth(+inputYear.value, +selectMonth.value);
        });

        this.dialog = new Dialog({
            year: this.date.selectedDate.getFullYear(),
            month: this.date.selectedDate.getMonth(),
            day: this.date.selectedDate.getDate(),
        });

        document.body.appendChild(this.dialog.dialog);

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

                    this.selectDate(dayOfMonth, arrayDate[i][j]);
                    if (new Date().getFullYear() === this.date.selectedMonth.getFullYear()
                        && new Date().getMonth() === this.date.selectedMonth.getMonth()
                        && new Date().getDate() === +arrayDate[i][j]
                        && !this.params.hideCurrentDate) {
                        dayOfMonth.classList.add(config.CSS_CLASS_TODAY);
                    }
                    dayOfMonth.classList.add(config.CSS_CLASS_ENABLED);
                    dayOfMonth.appendChild(spanDayOfMonth);

                    dayOfMonth.appendChild(this.showTasksForDay(new DateForMonth(
                        this.date.selectedMonth.getFullYear(),
                        this.date.selectedMonth.getMonth(),
                        +arrayDate[i][j]
                    )));
                }

                rowDaysOfMonth.appendChild(dayOfMonth);
            }

            daysOfMonth.appendChild(rowDaysOfMonth);
        }
        return daysOfMonth;
    }

    selectDate(daySelector, dayDate) {
        daySelector.addEventListener(config.EVENT_LISTENER_CLICK, () => {
            event.stopPropagation();
            const selectedDate = {
                year: this.date.selectedMonth.getFullYear(),
                month: this.date.selectedMonth.getMonth(),
                day: +dayDate
            };
            this.dialog.showDialog(selectedDate);
        });
    }

    switchMonth(inputYear = new Date().getFullYear(), selectMonth = new Date().getMonth()) {
        this.date.replaceMonth(inputYear, selectMonth);
        this.calendar.replaceChild(
            this.createDaysOfMonth(this.date.selectedMonth.arrayDaysInMonth()),
            this.calendar.childNodes[2]
        );
    }

    goToDate(date = new DateForMonth()) {
        this.calendar.childNodes[0].childNodes[0].value = date.getMonth();
        this.calendar.childNodes[0].childNodes[1].value = date.getFullYear();
        this.switchMonth(date.getFullYear(), date.getMonth());
    }

    showTasksForDay(date) {
        const div = document.createElement(config.SELECTOR_DIV);
        div.className = config.CSS_CLASS_LIST_TASK;
        const tasksOfStorage = JSON.parse(localStorage.getItem(date.formatForInput()));
        if(tasksOfStorage) {
            tasksOfStorage.tasks.sort((a, b) =>
                Date.parse(a.startDate) - Date.parse(b.startDate)
            );
            tasksOfStorage.tasks.forEach(el => {
                const li = document.createElement(config.SELECTOR_DIV);
                li.className = config.CSS_CLASS_TASK;

                const circle = document.createElement(config.SELECTOR_DIV);
                circle.innerHTML = '<i class="fas fa-circle"></i>';
                const span1 = document.createElement(config.SELECTOR_SPAN);
                span1.innerText = `${new DateForMonth(Date.parse(el.startDate)).formatForInputTime()} `;
                const span2 = document.createElement(config.SELECTOR_SPAN);
                span2.innerText = ` ${el.name}`;
                li.appendChild(circle);
                li.appendChild(span1);
                li.appendChild(span2);

                if(+el.duration === 0
                    && new DateForMonth(Date.parse(el.startDate)).formatForInputTime() === '00:00') {
                    li.classList.add(config.CSS_CLASS_TASK_ALL_DAY);
                    li.innerHTML = '';
                    li.appendChild(span2);
                }
                div.appendChild(li);
            });
        }
        return div;
    }
}














