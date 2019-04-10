import {DatepickerHtmlElement} from './datepickerHtmlElement';
import {config} from './config';
import {DateForMonth} from './dateForMonth';
import {InputTime} from './inputTime';

export class Dialog {
    constructor(date) {
        this.startDate = new Date();
        this.endDate = new Date();
        this.outsideDialog = document.createElement(config.SELECTOR_DIV);
        this.outsideDialog.className = config.CSS_CLASS_OUTSIDE_DIALOG;

        this.dialog = document.createElement(config.SELECTOR_DIV);
        this.dialog.className = config.CSS_CLASS_DIALOG;

        const close = document.createElement(config.SELECTOR_DIV);
        close.className = config.CSS_CLASS_CLOSE;
        close.innerHTML = '<i class="fas fa-times"></i>';
        close.addEventListener(config.EVENT_LISTENER_CLICK, () => {
            this.clearDialog(div, nameTask, buttonAddTime);
        });

        const nameTask = document.createElement(config.SELECTOR_INPUT);
        nameTask.className = config.CSS_CLASS_NAME_TASK;

        nameTask.addEventListener(config.EVENT_LISTENER_CLICK, () => {
            nameTask.classList.remove(config.CSS_CLASS_ERROR_INPUT);
            nameTask.classList.add(config.CSS_CLASS_ENTER_INPUT);
        });
        nameTask.addEventListener(config.EVENT_LISTENER_BLUR, () => {
            nameTask.classList.remove(config.CSS_CLASS_ENTER_INPUT);
        });

        nameTask.placeholder = 'Добавьте название и время';

        const timeTask = document.createElement(config.SELECTOR_DIV);
        timeTask.className = config.CSS_CLASS_TIME_TASK;

        this.startTimeDatepicker = this.createDatepicker(0,{
            defaultDate: new DateForMonth(date.year, date.month, date.day)
        });

        this.endTimeDatepicker = this.createDatepicker(1,{
            defaultDate: new DateForMonth(date.year, date.month, date.day)
        });

        this.startTimeDatepicker.input.className = config.CSS_CLASS_START_TIME_DATE_PICKER;
        this.endTimeDatepicker.input.className = config.CSS_CLASS_END_TIME_DATE_PICKER;

        const div = document.createElement(config.SELECTOR_DIV);
        div.innerHTML = '-';

        this.dialog.appendChild(close);

        const buttonAddTime = document.createElement(config.SELECTOR_DIV);
        buttonAddTime.className = `btn btn-outline-warning ${config.CSS_CLASS_BUTTON_ADD_TIME} active`;
        buttonAddTime.innerHTML = '<i class="fas fa-plus"></i><span> Добавить время</span>';

        buttonAddTime.addEventListener(config.EVENT_LISTENER_CLICK, () => {
            this.time = {};
            this.time.begin = new InputTime();

            this.time.end = new InputTime({
                addHours: 1,
                defaultHours: this.time.begin.hours,
                defaultMinutes: this.time.begin.minutes
            });

            const span = document.createElement(config.SELECTOR_SPAN);
            span.innerText = '-';

            const timeWrapper = document.createElement(config.SELECTOR_DIV);
            timeWrapper.className = config.CSS_CLASS_TIME_WRAPPER;
            timeWrapper.appendChild(this.time.begin.wrapper);
            timeWrapper.appendChild(span);
            timeWrapper.appendChild(this.time.end.wrapper);
            div.innerHTML = '';
            div.appendChild(timeWrapper);
            nameTask.placeholder = 'Добавить название';
            this.hideElement(buttonAddTime);
        });

        const save = document.createElement(config.SELECTOR_DIV);
        save.className = 'btn btn-success';
        save.innerText = 'Сохранить';

        save.addEventListener(config.EVENT_LISTENER_CLICK, () => {
            if (nameTask.value) {
                console.log(this.startTimeDatepicker.datepicker.date.selectedDate.formatForInput());
                if (this.time) {
                    console.log(this.time.begin.hours + ':' + this.time.begin.minutes);
                    console.log(this.time.end.hours + ':' + this.time.end.minutes);
                }
                console.log(this.endTimeDatepicker.datepicker.date.selectedDate.formatForInput());
                this.clearDialog(div, nameTask, buttonAddTime);
            } else {
                nameTask.classList.add(config.CSS_CLASS_ERROR_INPUT);
            }
        });

        timeTask.appendChild(this.startTimeDatepicker.wrapper);
        timeTask.appendChild(div);
        timeTask.appendChild(this.endTimeDatepicker.wrapper);

        this.dialog.appendChild(nameTask);

        this.dialog.appendChild(timeTask);

        this.dialog.appendChild(buttonAddTime);

        this.dialog.appendChild(save);

        this.outsideDialog.addEventListener(config.EVENT_LISTENER_CLICK, () => {
            this.clearDialog(div, nameTask, buttonAddTime);
        });

        document.body.appendChild(this.outsideDialog);
    }

    createDatepicker(index, params = {}) {
        const divWrapper = document.createElement(config.SELECTOR_DIV);
        divWrapper.style.position = 'relative';

        const inputDatepicker = document.createElement(config.SELECTOR_INPUT);
        inputDatepicker.className = config.CSS_CLASS_INPUT_TIME_DATE_PICKER;
        inputDatepicker.type = config.ATTRIBUTE_TYPE_DATE_PICKER;
        inputDatepicker.dataset.id = index;
        divWrapper.appendChild(inputDatepicker);

        const datepicker = new DatepickerHtmlElement(params);
        datepicker.connectWithInput(index, inputDatepicker);
        divWrapper.appendChild(datepicker.calendar);

        return {
            wrapper: divWrapper,
            datepicker: datepicker,
            input: inputDatepicker
        };
    }

    editDateInDatepicker(date) {
        this.startTimeDatepicker.datepicker.replaceDate(date);
        this.endTimeDatepicker.datepicker.replaceDate(date);
    }

    showDialog(date) {
        this.editDateInDatepicker(date);

        this.dialog.classList.add(config.CSS_CLASS_ACTIVE_DIALOG);
        this.outsideDialog.classList.add(config.CSS_CLASS_ACTIVE_DIALOG);
    }

    hideDialog() {
        this.dialog.classList.remove(config.CSS_CLASS_ACTIVE_DIALOG);
        this.outsideDialog.classList.remove(config.CSS_CLASS_ACTIVE_DIALOG);
    }

    clearDialog(div, nameTask, buttonAddTime) {
        this.hideDialog();
        div.innerHTML = '-';
        nameTask.classList.remove(config.CSS_CLASS_ERROR_INPUT);
        nameTask.placeholder = 'Добавьте название и время';
        nameTask.value = '';
        this.showElement(buttonAddTime);
    }

    showElement(elem) {
        elem.classList.add(config.CSS_CLASS_ACTIVE);
    }

    hideElement(elem) {
        elem.classList.remove(config.CSS_CLASS_ACTIVE);
    }


}

