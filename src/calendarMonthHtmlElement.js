import { config } from './config';
import { Calendar } from './calendar';
import { DateForMonth } from './dateForMonth';
import { DialogForAddTask } from './component/dialogForAddTask/dialogForAddTask';
import { DialogForViewTask } from './component/dialogForViewTask/dialogForViewTask';

export class CalendarMonthHtmlElement {

  constructor(params = {}) {
    this.setDefaultParams(params);
    this.date = new Calendar(new DateForMonth());
    this.calendar = document.createElement(config.selector.DIV);
    this.calendar.className = config.css_class.CALENDAR_MONTH;

    this.createCalendarHtmlElement();

    this.createDialogForViewTask();
    this.createDialogForAddTask();

    this.addEventListenerForCalendar();
  }

  createCalendarHtmlElement() {
    this.createButtonToday();
    this.createDateSelectWrapperHtmlElement();
    this.createDaysOfWeekHtmlElement();
    this.calendar.appendChild(this.createDaysOfMonthHtmlElement(this.date.selectedMonth.arrayDaysInMonth()));
  }

  createButtonToday() {
    const today = document.createElement(config.selector.DIV);
    today.className = `btn btn-outline-primary ${ config.css_class.BUTTON_TODAY }`;
    today.innerHTML = `<span>${ config.text.BUTTON_TODAY }</span>`;
    today.addEventListener(config.event_listener.CLICK, () => {
      this.goToDate();
    });
    this.calendar.appendChild(today);
  }

  createSelectMonthHtmlElement() {
    this.selectMonth = document.createElement(config.selector.SELECT);
    this.selectMonth.id = config.css_id.MONTH;
    config.MONTH_CALENDAR_MONTH.forEach((el, index) => {
      const option = document.createElement(config.selector.OPTION);
      option.value = `${ index }`;
      option.innerText = el;
      this.selectMonth.appendChild(option);
    });
    this.selectMonth.value = this.date.selectedMonth.getMonth() + '';
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

    config.DAYS_OF_WEEK_CALENDAR_MONTH.forEach(name => {
      const dayOfWeek = document.createElement(config.selector.DIV);
      dayOfWeek.className = config.css_class.DAY_OF_WEEK;

      const spanDayOfWeek = document.createElement(config.selector.SPAN);
      spanDayOfWeek.innerText = name;

      dayOfWeek.appendChild(spanDayOfWeek);
      daysOfWeek.appendChild(dayOfWeek);
    });

    this.calendar.appendChild(daysOfWeek);
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
          this.selectDate(dayHtmlElement, day);

          dayHtmlElement.appendChild(this.showTasksForDay(new DateForMonth(
            this.date.selectedMonth.getFullYear(),
            this.date.selectedMonth.getMonth(),
            +day
          )));

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

  createDialogForViewTask() {
    this.viewTask = new DialogForViewTask();
    document.body.appendChild(this.viewTask.component);
  }

  createDialogForAddTask() {
    this.dialog = new DialogForAddTask();
    document.body.appendChild(this.dialog.component);
  }

  addEventListenerForCalendar() {
    this.selectMonth.addEventListener(config.event_listener.CHANGE, () => {
      this.switchMonth(+this.inputYear.value, +this.selectMonth.value);
    });

    this.inputYear.addEventListener(config.event_listener.CHANGE, () => {
      this.switchMonth(+this.inputYear.value, +this.selectMonth.value);
    });

    this.calendar.addEventListener('save', () => {
      this.updateDayAfterAdd(event.detail.startDate);
    });

    this.calendar.addEventListener('delete', () => {
      this.updateDayAfterAdd(event.detail.startDate);
    });
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
      this.createDaysOfMonthHtmlElement(this.date.selectedMonth.arrayDaysInMonth()),
      this.calendar.querySelector(`.${config.css_class.DAYS_OF_MONTH}`)
    );
  }

  goToDate(date = new DateForMonth()) {
    this.selectMonth.value = date.getMonth();
    this.inputYear.value = date.getFullYear();
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

      tasksOfStorage.tasks.forEach(el => {
        div.appendChild(this.createViewTask(el));
      });
    }
    return div;
  }

  updateDayAfterAdd(date) {
    const div = this.showTasksForDay(date);
    if (date.getFullYear() === this.date.selectedMonth.getFullYear()
      && date.getMonth() === this.date.selectedMonth.getMonth()) {
      const day = this.calendar
        .querySelectorAll(`.${ config.css_class.DAY_OF_MONTH }.${ config.css_class.ENABLED }`)[date.getDate() - 1];
      day.replaceChild(div, day.querySelector(`.${config.css_class.LIST_TASK}`));
    }
  }

  createViewTask(el) {
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

    if (+el.duration === 0
      && new DateForMonth(Date.parse(el.startDate)).formatForInputTime() === '00:00') {
      li.classList.add(config.css_class.TASK_ALL_DAY);
      li.innerHTML = '';
      li.appendChild(span2);
    }
    this.addClickInTask(li, el);
    return li;
  }

  addClickInTask(task, el) {
    task.addEventListener(config.event_listener.CLICK, () => {
      event.stopPropagation();
      this.viewTask.showDialog(el);
      this.viewTask.deleteTask.component.addEventListener(config.event_listener.CLICK, () => {
        this.viewTask.removeTaskFromLocalStorage();
      });
    });
  }
}

