import { config } from './config';
import { Calendar } from './calendar';
import { DialogForAddTask } from './dialogForAddTask';
import { DateForMonth } from './dateForMonth';

export class CalendarMonthHtmlElement {

    constructor(id = 1, params = {}) {
        this.setDefaultParams(params);

        this.date = new Calendar(new DateForMonth());
        this.id = id;
        this.calendar = document.createElement(config.selector.DIV);

        this.calendar.className = config.css_class.CALENDAR_MONTH;
        this.calendar.dataset.id = this.id;

        const today = document.createElement(config.selector.DIV);
        today.className = `btn btn-outline-primary ${ config.css_class.BUTTON_TODAY }`;
        today.innerHTML = `<span>${ config.text.BUTTON_TODAY }</span>`;
        today.addEventListener(config.event_listener.CLICK, () => {
            this.goToDate();
        });

        const dateInputWrapper = document.createElement(config.selector.DIV);
        dateInputWrapper.className = config.css_class.DATE_INPUT_WRAPPER;

        const selectMonth = document.createElement(config.selector.SELECT);
        selectMonth.id = config.css_id.MONTH_CALENDAR_MONTH;

        config.MONTH_CALENDAR_MONTH.forEach((el, index) => {
            const option = document.createElement(config.selector.OPTION);
            option.value = `${ index }`;
            option.innerText = el;
            selectMonth.appendChild(option);
        });

        selectMonth.value = this.date.selectedMonth.getMonth() + '';

        const inputYear = document.createElement(config.selector.INPUT);

        inputYear.id = config.css_id.YEAR_CALENDAR_MONTH;
        inputYear.type = config.attribute.TYPE_NUMBER;
        inputYear.value = this.date.selectedMonth.getFullYear() + '';

        const daysOfWeek = document.createElement(config.selector.DIV);
        daysOfWeek.className = config.css_class.DAYS_OF_WEEK;

        config.DAYS_OF_WEEK_CALENDAR_MONTH.forEach(name => {
            const dayOfWeek = document.createElement(config.selector.DIV);
            dayOfWeek.className = config.css_class.DAY_OF_WEEK;

            const spanDayOfWeek = document.createElement(config.selector.SPAN);
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

        selectMonth.addEventListener(config.event_listener.CHANGE, () => {
            this.switchMonth(+inputYear.value, +selectMonth.value);
        });

        inputYear.addEventListener(config.event_listener.CHANGE, () => {
            this.switchMonth(+inputYear.value, +selectMonth.value);
        });

        this.calendar.addEventListener('save', () => {
            this.updateDayAfterAdd(event.detail.startDate);
        });

        this.dialog = new DialogForAddTask();

        document.body.appendChild(this.dialog.component);

    }

    createDaysOfMonth(arrayDate) {
        const daysOfMonth = document.createElement(config.selector.DIV);
        daysOfMonth.className = config.css_class.DAYS_OF_MONTH;

        if (!this.params.hideHover) {
            daysOfMonth.classList.add(config.css_class.SHOW_HOVER);
        }

        for (let i = 0; i < arrayDate.length; i++) {
            const rowDaysOfMonth = document.createElement(config.selector.DIV);
            rowDaysOfMonth.className = config.css_class.ROW_DAYS_OF_MONTH;
            rowDaysOfMonth.classList.add(config.css_class.ACTIVE_FLEX);

            for (let j = 0; j < 7; j++) {
                const dayOfMonth = document.createElement(config.selector.DIV);
                dayOfMonth.className = config.css_class.DAY_OF_MONTH;
                if (!this.params.hideWeekend && (j === 0 || j === 6)) {
                    dayOfMonth.classList.add(config.css_class.WEEKEND);
                }
                if (arrayDate[i][j] !== '') {
                    const spanDayOfMonth = document.createElement(config.selector.SPAN);
                    spanDayOfMonth.innerText = arrayDate[i][j];

                    this.selectDate(dayOfMonth, arrayDate[i][j]);
                    if (new Date().getFullYear() === this.date.selectedMonth.getFullYear()
                        && new Date().getMonth() === this.date.selectedMonth.getMonth()
                        && new Date().getDate() === +arrayDate[i][j]
                        && !this.params.hideCurrentDate) {
                        dayOfMonth.classList.add(config.css_class.TODAY);
                    }
                    dayOfMonth.classList.add(config.css_class.ENABLED);
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

    setDefaultParams(params) {
        this.params = {
            hideSelectedDate: params.hideSelectedDate || false,
            hideCurrentDate: params.hideCurrentDate || false,
            hideHover: params.hideHover || false,
            hideWeekend: params.hideWeekend || false,
        };
    }

    selectDate(daySelector, dayDate) {
        daySelector.addEventListener(config.event_listener.CLICK, () => {
            event.stopPropagation();
            const selectedDate = {
                year: this.date.selectedMonth.getFullYear(),
                month: this.date.selectedMonth.getMonth(),
                day: +dayDate
            };
            this.dialog.showDialog(selectedDate, daySelector);
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
        const div = document.createElement(config.selector.DIV);
        div.className = config.css_class.LIST_TASK;
        const tasksOfStorage = JSON.parse(localStorage.getItem(date.formatForInput()));
        if (tasksOfStorage) {
            tasksOfStorage.tasks.sort((a, b) =>
                Date.parse(a.startDate) - Date.parse(b.startDate)
            );
            const close = document.createElement(config.selector.DIV);
            close.className = config.css_class.CLOSE;
            close.innerHTML = '<i class="fas fa-times"></i>';

            const viewTask = document.createElement(config.selector.DIV);
            //viewTask.className = config.css_class.DIALOG;
            viewTask.classList.add(config.css_class.VIEW_TASK);

            const outsideDialog = document.createElement(config.selector.DIV);
            outsideDialog.className = config.css_class.OUTSIDE_DIALOG;
            const nameSpan = document.createElement(config.selector.SPAN);
            const startSpan = document.createElement(config.selector.SPAN);
            const endSpan = document.createElement(config.selector.SPAN);

            close.addEventListener(config.event_listener.CLICK, () => {
                viewTask.classList.remove(config.css_class.ACTIVE_FLEX);
                outsideDialog.classList.remove(config.css_class.ACTIVE);
            });

            tasksOfStorage.tasks.forEach(el => {
                const li = document.createElement(config.selector.DIV);
                li.className = config.css_class.TASK;

                const circle = document.createElement(config.selector.DIV);
                circle.innerHTML = '<i class="fas fa-circle"></i>';
                const span1 = document.createElement(config.selector.SPAN);
                span1.innerText = `${ new DateForMonth(Date.parse(el.startDate)).formatForInputTime() } `;
                const span2 = document.createElement(config.selector.SPAN);
                span2.innerText = ` ${ el.name }`;
                li.appendChild(circle);
                li.appendChild(span1);
                li.appendChild(span2);

                const empty = document.createElement(config.selector.DIV);
                viewTask.appendChild(empty);

                if (+el.duration === 0
                    && new DateForMonth(Date.parse(el.startDate)).formatForInputTime() === '00:00') {
                    li.classList.add(config.css_class.TASK_ALL_DAY);
                    li.innerHTML = '';
                    li.appendChild(span2);
                }

                li.addEventListener(config.event_listener.CLICK, () => {
                    event.stopPropagation();

                    const deleteButton = document.createElement(config.selector.DIV);
                    deleteButton.className = config.css_class.DELETE;
                    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';

                    viewTask.classList.add(config.css_class.ACTIVE_FLEX);
                    nameSpan.innerText = `Name: ${ el.name }`;
                    startSpan.innerText = `Start date: ${ new DateForMonth(Date.parse(el.startDate)) }`;
                    if (el.duration !== 0) {
                        endSpan.innerText = `End date: ${ new DateForMonth(Date.parse(el.endDate)) }`;
                    }

                    outsideDialog.classList.add(config.css_class.ACTIVE);
                    outsideDialog.style.background = 'transparent';

                    deleteButton.addEventListener(config.event_listener.CLICK, () => {
                        const dateOfLocalStorage = new DateForMonth(Date.parse(el.startDate)).formatForInput();
                        const taskOfDay = JSON.parse(localStorage.getItem(dateOfLocalStorage));
                        if (taskOfDay.tasks.length > 1) {
                            const indexOfRemove = taskOfDay.tasks.findIndex(elementOfRemove => {
                                return elementOfRemove.name === el.name
                                    && elementOfRemove.startDate === el.startDate
                                    && elementOfRemove.endDate === el.endDate;
                            });
                            console.log(indexOfRemove);
                            taskOfDay.tasks.splice(indexOfRemove, 1);
                            localStorage.setItem(dateOfLocalStorage, JSON.stringify(taskOfDay));
                        } else {
                            localStorage.removeItem(dateOfLocalStorage);
                        }
                        viewTask.classList.remove(config.css_class.ACTIVE_FLEX);
                        outsideDialog.classList.remove(config.css_class.ACTIVE);
                        this.updateDayAfterAdd(new DateForMonth(Date.parse(el.startDate)));
                    });

                    viewTask.replaceChild(deleteButton, viewTask.childNodes[0]);

                });

                div.appendChild(li);
            });

            outsideDialog.addEventListener(config.event_listener.CLICK, () => {
                viewTask.classList.remove(config.css_class.ACTIVE_FLEX);
                outsideDialog.classList.remove(config.css_class.ACTIVE);
            });

            viewTask.appendChild(close);
            viewTask.appendChild(nameSpan);
            viewTask.appendChild(startSpan);
            viewTask.appendChild(endSpan);
            document.body.appendChild(viewTask);
            document.body.appendChild(outsideDialog);

        }

        return div;
    }

    updateDayAfterAdd(date) {
        const div = this.showTasksForDay(date);
        if (date.getFullYear() === this.date.selectedMonth.getFullYear()
            && date.getMonth() === this.date.selectedMonth.getMonth()) {
            const day = this.calendar
                .querySelectorAll(`.${ config.css_class.DAY_OF_MONTH }.${ config.css_class.ENABLED }`)[date.getDate() - 1];
            day.replaceChild(div, day.childNodes[1]);
        }
    }
}














