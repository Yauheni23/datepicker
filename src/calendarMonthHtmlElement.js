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

        this.dialog = new Dialog(this);

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
        const div = document.createElement(config.SELECTOR_DIV);
        div.className = config.CSS_CLASS_LIST_TASK;
        const tasksOfStorage = JSON.parse(localStorage.getItem(date.formatForInput()));
        if (tasksOfStorage) {
            tasksOfStorage.tasks.sort((a, b) =>
                Date.parse(a.startDate) - Date.parse(b.startDate)
            );
            const close = document.createElement(config.SELECTOR_DIV);
            close.className = config.CSS_CLASS_CLOSE;
            close.innerHTML = '<i class="fas fa-times"></i>';

            const viewTask = document.createElement(config.SELECTOR_DIV);
            viewTask.className = config.CSS_CLASS_DIALOG;
            viewTask.classList.add(config.CSS_CLASS_VIEW_TASK);

            const outsideDialog = document.createElement(config.SELECTOR_DIV);
            outsideDialog.className = config.CSS_CLASS_OUTSIDE_DIALOG;
            const nameSpan = document.createElement(config.SELECTOR_SPAN);
            const startSpan = document.createElement(config.SELECTOR_SPAN);
            const endSpan = document.createElement(config.SELECTOR_SPAN);

            close.addEventListener(config.EVENT_LISTENER_CLICK, () => {
                viewTask.classList.remove(config.CSS_CLASS_ACTIVE_DIALOG);
                outsideDialog.classList.remove(config.CSS_CLASS_ACTIVE);
            });


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

                const empty = document.createElement(config.SELECTOR_DIV);
                viewTask.appendChild(empty);

                if (+el.duration === 0
                    && new DateForMonth(Date.parse(el.startDate)).formatForInputTime() === '00:00') {
                    li.classList.add(config.CSS_CLASS_TASK_ALL_DAY);
                    li.innerHTML = '';
                    li.appendChild(span2);
                }

                li.addEventListener(config.EVENT_LISTENER_CLICK, () => {
                    event.stopPropagation();

                    const deleteButton = document.createElement(config.SELECTOR_DIV);
                    deleteButton.className = config.CSS_CLASS_DELETE;
                    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';

                    viewTask.classList.add(config.CSS_CLASS_ACTIVE_DIALOG);
                    nameSpan.innerText = `Name: ${el.name}`;
                    startSpan.innerText = `Start date: ${new DateForMonth(Date.parse(el.startDate))}`;
                    if (el.duration !== 0) {
                        endSpan.innerText = `End date: ${new DateForMonth(Date.parse(el.endDate))}`;
                    }

                    outsideDialog.classList.add(config.CSS_CLASS_ACTIVE);
                    outsideDialog.style.background = 'transparent';

                    deleteButton.addEventListener(config.EVENT_LISTENER_CLICK, () => {
                        const dateOfLocalStorage = new DateForMonth(Date.parse(el.startDate)).formatForInput();
                        const taskOfDay = JSON.parse(localStorage.getItem(dateOfLocalStorage));
                        if(taskOfDay.tasks.length > 1) {
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
                        viewTask.classList.remove(config.CSS_CLASS_ACTIVE_DIALOG);
                        outsideDialog.classList.remove(config.CSS_CLASS_ACTIVE);
                        this.updateDayAfterAdd(new DateForMonth(Date.parse(el.startDate)));
                    });

                    viewTask.replaceChild(deleteButton, viewTask.childNodes[0]);

                });

                div.appendChild(li);
            });

            outsideDialog.addEventListener(config.EVENT_LISTENER_CLICK, () => {
                viewTask.classList.remove(config.CSS_CLASS_ACTIVE_DIALOG);
                outsideDialog.classList.remove(config.CSS_CLASS_ACTIVE);
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
        console.log(date);
        const div = this.showTasksForDay(date);
        if (date.getFullYear() === this.date.selectedMonth.getFullYear()
            && date.getMonth() === this.date.selectedMonth.getMonth()) {
            const day = this.calendar
                .querySelectorAll(`.${config.CSS_CLASS_DAY_OF_MONTH}.${config.CSS_CLASS_ENABLED}`)[date.getDate() - 1];
            day.replaceChild(div, day.childNodes[1]);
        }
    }
}














