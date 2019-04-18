import { DatePicker } from './component/dialog/datePicker';
import { config } from './config';
import { DateForMonth } from './dateForMonth';
import { NameTask } from './component/dialog/nameTask';
import { Dialog } from './component/dialog/dialog';
import { AddTime } from './component/dialog/AddTime';
import { Save } from './component/dialog/save';

export class DialogForAddTask extends Dialog {
  constructor(params = {}) {
    super();
    this.setDefaultParams(params);
    this.createComponent();

    this.startDatePicker.input.addEventListener(config.event_listener.BLUR, () => {
      if (this.startDatePicker.input.value !== this.startDate.formatForInput()) {
        this.createListenerForStartDatePicker();
      }
    });

    this.endDatePicker.input.addEventListener(config.event_listener.BLUR, () => {
      if (this.endDatePicker.datepicker.date.selectedDate.formatForInput() !== this.endDate.formatForInput()) {
        this.createListenerForEndDatePicker();
      }
    });

    this.timeForTaskComponent.button.addEventListener(config.event_listener.CLICK, () => {
      this.durationTask = 3600000;

      this.endDatePicker.datepicker.date.selectedDate =
        this.startDatePicker.datepicker.date.selectedDate;
      this.endDatePicker.datepicker.replaceDate({
        year: this.endDatePicker.datepicker.date.selectedDate.getFullYear(),
        month: this.endDatePicker.datepicker.date.selectedDate.getMonth(),
        day: this.endDatePicker.datepicker.date.selectedDate.getDate()
      });
      this.updateDate();
      this.enableSaveButton();

      this.timeForTaskComponent.startComponent.input.addEventListener(config.event_listener.FOCUS, () => {
        if (`${ this.timeForTaskComponent.startComponent.hours }:${ this.timeForTaskComponent.startComponent.minutes }` !== this.startDate.formatForInputTime()) {
          this.timeForTaskComponent.endComponent.input.value = new DateForMonth(
            DateForMonth.convertInMilliseconds(+this.timeForTaskComponent.startComponent.hours,
              +this.timeForTaskComponent.startComponent.minutes) + this.durationTask - 3 * 3600000)
            .formatForInputTime();
          this.timeForTaskComponent.endComponent.updateTime();
          if (this.timeForTaskComponent.endComponent.hours < this.timeForTaskComponent.startComponent.hours) {
            if (this.timeForTaskComponent.endComponent.params.useDuration) {
              this.timeForTaskComponent.endComponent.replaceSelectTime(0, 0, false);
            }
          }
          this.updateDate();

          if (this.startDate.formatForInput() === this.endDate.formatForInput()) {
            this.timeForTaskComponent.endComponent.replaceSelectTime(+this.timeForTaskComponent.startComponent.hours, +this.timeForTaskComponent.startComponent.minutes);
          }

          this.endDatePicker.datepicker.replaceDate({
            year: this.endDate.getFullYear(),
            month: this.endDate.getMonth(),
            day: this.endDate.getDate()
          });

        }
      });

      this.timeForTaskComponent.endComponent.input.addEventListener(config.event_listener.FOCUS, () => {
        if (`${ this.timeForTaskComponent.endComponent.hours }:${ this.timeForTaskComponent.endComponent.minutes }` !== this.endDate.formatForInputTime()) {

          this.durationTask += DateForMonth.convertInMilliseconds(+this.timeForTaskComponent.endComponent.hours - +this.endDate.getHours(), +this.timeForTaskComponent.endComponent.minutes - +this.endDate.getMinutes());
          this.updateDate();

          if (+this.timeForTaskComponent.endComponent.hours < +this.timeForTaskComponent.startComponent.hours && this.timeForTaskComponent.endComponent.params.useDuration) {
            this.durationTask += 86400000;
            this.endDatePicker.datepicker.date.selectedDate.setMilliseconds(86400000);
            this.endDatePicker.datepicker.replaceDate({
              year: this.endDatePicker.datepicker.date.selectedDate.getFullYear(),
              month: this.endDatePicker.datepicker.date.selectedDate.getMonth(),
              day: this.endDatePicker.datepicker.date.selectedDate.getDate()
            });
            this.timeForTaskComponent.endComponent.replaceSelectTime(0, 0, false);
          }
          this.updateDate();
        }
      });

      this.nameTask.component.placeholder = config.text.PLACEHOLDER_NAME_TASK_WITHOUT_TIME;
    });

    this.save.button.addEventListener(config.event_listener.CLICK, () => {
      this.save.hideError();
      if (!this.nameTask.isEmpty()) {
        if (this.addTaskInLocalStorage({
          name: this.nameTask.component.value,
          startDate: this.startDate,
          endDate: this.endDate,
          duration: this.durationTask
        })) {
          this.save.setDataForSave({
            name: this.nameTask.component.value,
            startDate: this.startDate,
            endDate: this.endDate,
            duration: this.durationTask
          });
          this.save.callCustomEventSaveForElement(document.querySelector(`.${ config.css_class.CALENDAR_MONTH }`));
          this.hideDialog();
        } else {
          this.save.showError();
        }
      } else {
        this.nameTask.addError();
      }
    });

  }

  setDefaultParams(params) {
    this.params = {
      startDate: params.startDate || new DateForMonth(),
      duration: +params.duration || 0
    };
    this.startDate = this.params.startDate;
    this.durationTask = this.params.duration;
    this.endDate = this.params.startDate.setMilliseconds(this.params.duration);
  }

  createComponent() {
    this.createNameTask();
    this.createDateWrapper();
    this.createButtonSave();
  }

  createNameTask() {
    this.nameTask = new NameTask();
    this.dialog.appendChild(this.nameTask.component);
  }

  createDateWrapper() {
    const dateWrapper = document.createElement(config.selector.DIV);
    dateWrapper.className = config.css_class.TIME_TASK;

    this.startDatePicker = this.createDatepicker(0);
    this.startDatePicker.input.className = config.css_class.START_TIME_DATE_PICKER;

    this.endDatePicker = this.createDatepicker(1);
    this.endDatePicker.input.className = config.css_class.END_TIME_DATE_PICKER;

    this.timeForTaskComponent = new AddTime();

    dateWrapper.appendChild(this.startDatePicker.wrapper);
    dateWrapper.appendChild(this.timeForTaskComponent.component);
    dateWrapper.appendChild(this.endDatePicker.wrapper);

    this.dialog.appendChild(dateWrapper);
  }

  createButtonSave() {
    this.save = new Save({ errorMessage: config.text.BUTTON_SAVE_ERROR_MESSAGE });
    this.dialog.appendChild(this.save.component);
  }

  createDatepicker(index, params = {}) {
    const divWrapper = document.createElement(config.selector.DIV);
    divWrapper.style.position = 'relative';

    const inputDatepicker = document.createElement(config.selector.INPUT);
    inputDatepicker.className = config.css_class.INPUT_TIME_DATE_PICKER;
    inputDatepicker.type = config.attribute.TYPE_DATE_PICKER;
    inputDatepicker.dataset.id = index;
    divWrapper.appendChild(inputDatepicker);

    const datepicker = new DatePicker(params);
    datepicker.connectWithInput(index, inputDatepicker);
    divWrapper.appendChild(datepicker.calendar);

    return {
      wrapper: divWrapper,
      datepicker: datepicker,
      input: inputDatepicker
    };
  }

  createListenerForStartDatePicker() {
    this.endDatePicker.datepicker.selectedDate = this.endDatePicker.datepicker.date.selectedDate.setMilliseconds(
      this.startDatePicker.datepicker.date.selectedDate -
      new DateForMonth(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate())
    );
    this.updateDate();
  }

  createListenerForEndDatePicker() {
    this.durationTask += this.endDatePicker.datepicker.date.selectedDate
      - new DateForMonth(this.endDate.getFullYear(), this.endDate.getMonth(), this.endDate.getDate());
    this.updateDate();

    let hours = 0;
    let minutes = 0;
    let useDuration = false;

    if (this.durationTask >= 0) {
      if (this.endDatePicker.datepicker.date.selectedDate.formatForInput()
        === this.startDatePicker.datepicker.date.selectedDate.formatForInput()) {
        hours = +this.timeForTaskComponent.startComponent.hours;
        minutes = +this.timeForTaskComponent.startComponent.minutes;
        useDuration = true;
      }
      this.enableSaveButton();
    } else {
      this.disableSaveButton();
    }

    this.replaceEndSelectTime(hours, minutes, useDuration);
  }

  addTaskInLocalStorage(newTask) {
    const tasksStorage = JSON.parse(localStorage.getItem(newTask.startDate.formatForInput()));
    if (tasksStorage) {
      const invalidDate = tasksStorage.tasks.some(el => {
        return el.startDate < newTask.startDate.toISOString() && newTask.startDate.toISOString() < el.endDate
          || el.startDate < newTask.endDate.toISOString() && newTask.endDate.toISOString() < el.endDate
          || el.startDate === newTask.startDate.toISOString() && newTask.endDate.toISOString() === el.endDate
          || (el.startDate === newTask.startDate.toISOString() || newTask.endDate.toISOString() === el.endDate)
          && (el.duration !== 0 || newTask.durationTask !== 0);
      });
      if (invalidDate) {
        return false;
      } else {
        tasksStorage.tasks.push(newTask);
        localStorage.setItem(newTask.startDate.formatForInput(), JSON.stringify(tasksStorage));
      }
    } else {
      localStorage.setItem(newTask.startDate.formatForInput(), JSON.stringify({
        tasks: [newTask]
      }));
    }
    return true;
  }

  editDateInDatepicker(date) {
    this.startDatePicker.datepicker.replaceDate(date);
    this.endDatePicker.datepicker.replaceDate(date);
  }

  showDialog(date) {
    super.showDialog();

    this.editDateInDatepicker(date);
    this.startDate = new DateForMonth(date.year, date.month, date.day);
    this.endDate = new DateForMonth(date.year, date.month, date.day);
  }

  hideDialog() {
    super.hideDialog();
    this.clearDialog();
  }

  clearDialog() {
    this.save.hideError();
    this.durationTask = 0;
    this.nameTask.clear();
    this.timeForTaskComponent.showButton();
  }

  updateDate() {
    this.startDate.setFullYear(this.startDatePicker.datepicker.date.selectedDate.getFullYear());
    this.startDate.setMonth(this.startDatePicker.datepicker.date.selectedDate.getMonth());
    this.startDate.setDate(this.startDatePicker.datepicker.date.selectedDate.getDate());

    this.endDate.setFullYear(this.startDatePicker.datepicker.date.selectedDate.getFullYear());
    this.endDate.setMonth(this.startDatePicker.datepicker.date.selectedDate.getMonth());
    this.endDate.setDate(this.startDatePicker.datepicker.date.selectedDate.getDate());

    if (this.timeForTaskComponent.isTimeWrapper()) {
      this.timeForTaskComponent.endComponent.updateTime();

      this.startDate.setHours(this.timeForTaskComponent.startComponent.hours);
      this.startDate.setMinutes(this.timeForTaskComponent.startComponent.minutes);
      this.endDate.setHours(this.timeForTaskComponent.startComponent.hours);
      this.endDate.setMinutes(this.timeForTaskComponent.startComponent.minutes);
    }
    this.endDate.setMilliseconds(this.durationTask);
  }

  enableSaveButton() {
    this.endDatePicker.input.classList.remove(config.css_class.DISABLED);
    if (this.timeForTaskComponent.isTimeWrapper()) {
      this.timeForTaskComponent.endComponent.input.classList.remove(config.css_class.DISABLED);
    }
    document.querySelector(`.${ config.css_class.BUTTON_SAVE }`).disabled = false;
  }

  disableSaveButton() {
    this.endDatePicker.input.classList.add(config.css_class.DISABLED);
    if (this.timeForTaskComponent.isTimeWrapper()) {
      this.timeForTaskComponent.endComponent.input.classList.add(config.css_class.DISABLED);
    }
    document.querySelector(`.${ config.css_class.BUTTON_SAVE }`).disabled = true;
  }

  replaceEndSelectTime(hours = 0, minutes = 0, useDuration = false) {
    if(this.timeForTaskComponent.isTimeWrapper()){
      this.timeForTaskComponent.endComponent.replaceSelectTime(hours, minutes, useDuration);
    }
  }
}

