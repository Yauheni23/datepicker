import { DatePicker } from './datePicker';
import { config } from '../../config';
import { DateForMonth } from '../../dateForMonth';
import { NameTask } from './nameTask';
import { Dialog } from '../dialog/dialog';
import { AddTime } from './AddTime';
import { Save } from './save';

export class DialogForAddTask extends Dialog {
  constructor(params = {}) {
    super();
    this.setDefaultParams(params);
    this.startDate = this.params.startDate;
    this.durationTask = this.params.duration;
    this.endDate = this.params.startDate.setMilliseconds(this.params.duration);

    this.createComponent();

    this.addBlurInStartDatePicker();
    this.addBlurInEndDatePicker();
    this.addClickInButtonAddTime();
    this.addClickInButtonSave();
  }

  setDefaultParams(params) {
    this.params = {
      startDate: params.startDate || new DateForMonth(),
      duration: +params.duration || 0
    };
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
    const datePickerWrapper = document.createElement(config.selector.DIV);
    datePickerWrapper.className = config.css_class.DATE_PICKER_WRAPPER;

    const inputDatePicker = document.createElement(config.selector.INPUT);
    inputDatePicker.className = config.css_class.INPUT_TIME_DATE_PICKER;
    inputDatePicker.type = config.attribute.TYPE_DATE_PICKER;
    inputDatePicker.dataset.id = index;
    datePickerWrapper.appendChild(inputDatePicker);

    const datePicker = new DatePicker(params);
    datePicker.connectWithInput(index, inputDatePicker);
    datePickerWrapper.appendChild(datePicker.calendar);

    return {
      wrapper: datePickerWrapper,
      datepicker: datePicker,
      input: inputDatePicker
    };
  }

  addBlurInStartDatePicker() {
    this.startDatePicker.input.addEventListener(config.event_listener.BLUR, () => {
      if (this.startDatePicker.input.value !== this.startDate.formatForInput()) {
        this.createListenerForStartDatePicker();
      }
    });
  }

  addBlurInEndDatePicker() {
    this.endDatePicker.input.addEventListener(config.event_listener.BLUR, () => {
      if (this.endDatePicker.datepicker.date.selectedDate.formatForInput() !== this.endDate.formatForInput()) {
        this.createListenerForEndDatePicker();
      }
    });
  }

  addClickInButtonAddTime() {
    this.timeForTaskComponent.button.addEventListener(config.event_listener.CLICK, () => {
      this.duration = 3600000;

      this.addFocusInStartTime();
      this.addFocusInEndTime();

      this.nameTask.component.placeholder = config.text.PLACEHOLDER_NAME_TASK_WITHOUT_TIME;
    });
  }

  addFocusInStartTime() {
    this.timeForTaskComponent.startComponent.input.addEventListener(config.event_listener.FOCUS, () => {
      if (`${ this.timeForTaskComponent.startComponent.hours }:${ this.timeForTaskComponent.startComponent.minutes }`
        !== this.startDate.formatForInputTime()) {
        this.createListenerForStartTime();
      }
    });
  }

  addFocusInEndTime() {
    this.timeForTaskComponent.endComponent.input.addEventListener(config.event_listener.FOCUS, () => {
      if (`${ this.timeForTaskComponent.endComponent.hours }:${ this.timeForTaskComponent.endComponent.minutes }`
        !== this.endDate.formatForInputTime()) {
        this.createListenerForEndTime();
      }
    });
  }

  addClickInButtonSave() {
    this.save.button.addEventListener(config.event_listener.CLICK, () => {
      this.save.hideError();
      if (!this.nameTask.isEmpty()) {
        this.createNewTask();
      } else {
        this.nameTask.addError();
      }
    });
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
    if (this.timeForTaskComponent.isTimeWrapper()
      && this.endDate.formatForInput() === this.startDate.formatForInput()) {
      hours = +this.timeForTaskComponent.startComponent.hours || 0;
      minutes = +this.timeForTaskComponent.startComponent.minutes || 0;
      useDuration = true;
    }
    this.replaceEndSelectTime(hours, minutes, useDuration);

    this.isValidDurationForSave();
  }

  createListenerForStartTime() {
    this.timeForTaskComponent.endComponent.input.value = new DateForMonth(
      DateForMonth.convertInMilliseconds(+this.timeForTaskComponent.startComponent.hours,
        +this.timeForTaskComponent.startComponent.minutes) + this.durationTask - 3 * 3600000)
      .formatForInputTime();
    this.updateDate();

    if (this.startDate.formatForInput() !== this.endDate.formatForInput()) {
      if (this.timeForTaskComponent.endComponent.params.useDuration) {
        this.timeForTaskComponent.endComponent.replaceSelectTime(0, 0, false);
      }
    } else {
      this.timeForTaskComponent.endComponent.replaceSelectTime(
        +this.timeForTaskComponent.startComponent.hours,
        +this.timeForTaskComponent.startComponent.minutes
      );
    }

    this.updateEndDatePicker();
  }

  createListenerForEndTime() {
    let changeDuration = DateForMonth.convertInMilliseconds(
      +this.timeForTaskComponent.endComponent.hours - +this.endDate.getHours(),
      +this.timeForTaskComponent.endComponent.minutes - +this.endDate.getMinutes()
    );

    if (+this.timeForTaskComponent.endComponent.hours < +this.timeForTaskComponent.startComponent.hours
      && this.timeForTaskComponent.endComponent.params.useDuration) {
      changeDuration += 86400000;
      this.timeForTaskComponent.endComponent.replaceSelectTime(0, 0, false);
    }
    this.duration = this.durationTask + changeDuration;
  }

  createNewTask() {
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
    this.duration = 0;
    this.nameTask.clear();
    this.timeForTaskComponent.showButton();
  }

  updateDate() {
    this.startDate.equate(this.startDatePicker.datepicker.date.selectedDate);

    if (this.timeForTaskComponent.isTimeWrapper()) {
      this.timeForTaskComponent.endComponent.updateTime();

      this.startDate.setHours(this.timeForTaskComponent.startComponent.hours);
      this.startDate.setMinutes(this.timeForTaskComponent.startComponent.minutes);
    }

    this.endDate.equate(this.startDate);
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
    if (this.timeForTaskComponent.isTimeWrapper()) {
      this.timeForTaskComponent.endComponent.replaceSelectTime(hours, minutes, useDuration);
    }
  }

  isValidDurationForSave() {
    if (this.durationTask >= 0) {
      this.enableSaveButton();
    } else {
      this.disableSaveButton();
    }
  }

  set duration(duration) {
    this.durationTask = duration;
    this.updateDate();
    this.endDatePicker.datepicker.selectedDate = this.endDate.setMilliseconds(0);
    this.isValidDurationForSave();
  }

  updateEndDatePicker() {
    if (this.endDate.formatForInput()
      !== this.endDatePicker.datepicker.date.selectedDate.formatForInput()) {
      this.endDatePicker.datepicker.replaceDate({
        year: this.endDate.getFullYear(),
        month: this.endDate.getMonth(),
        day: this.endDate.getDate()
      });
    }
  }
}

