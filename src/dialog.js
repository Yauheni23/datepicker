import {DatepickerHtmlElement} from './datepickerHtmlElement';
import {config} from './config';
import {DateForMonth} from './dateForMonth';
import {InputTime} from './inputTime';

export class Dialog {
    constructor() {
        this.startDate = new DateForMonth();
        this.endDate = new DateForMonth();

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
        nameTask.placeholder = 'Add name and time';

        const timeTask = document.createElement(config.SELECTOR_DIV);
        timeTask.className = config.CSS_CLASS_TIME_TASK;

        this.startTimeDatepicker = this.createDatepicker(0);
        this.startTimeDatepicker.input.className = config.CSS_CLASS_START_TIME_DATE_PICKER;

        this.endTimeDatepicker = this.createDatepicker(1);
        this.endTimeDatepicker.input.className = config.CSS_CLASS_END_TIME_DATE_PICKER;

        const div = document.createElement(config.SELECTOR_DIV);
        div.innerHTML = '-';

        this.dialog.appendChild(close);

        const buttonAddTime = document.createElement(config.SELECTOR_DIV);
        buttonAddTime.className = `${config.CSS_CLASS_BUTTON_ADD_TIME} ${config.CSS_CLASS_ACTIVE} btn btn-outline-primary `;
        buttonAddTime.innerHTML = '<i class="fas fa-plus"></i><span> Add time</span>';

        this.durationTask = 86400000;

        const durationTask = {
            dayInMilliseconds: 0,
            day: () => {
                return durationTask.dayInMilliseconds / 86400000 | 0;
            }
        };

        /* Работает */
        this.startTimeDatepicker.input.addEventListener('blur', () => {
            if (this.startTimeDatepicker.input.value !== this.startDate.formatForInput()){
                const duration = this.startTimeDatepicker.datepicker.date.selectedDate -
                    new DateForMonth(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate());
                this.endTimeDatepicker.datepicker.date.selectedDate.setMilliseconds(duration);
                this.endTimeDatepicker.datepicker.replaceDate({
                    year: this.endTimeDatepicker.datepicker.date.selectedDate.getFullYear(),
                    month: this.endTimeDatepicker.datepicker.date.selectedDate.getMonth(),
                    day: this.endTimeDatepicker.datepicker.date.selectedDate.getDate()
                });
                this.updateDate();
            }
        });

        this.endTimeDatepicker.input.addEventListener('blur', () => {
            if (this.endTimeDatepicker.input.value !== this.endDate.formatForInput()){
                this.updateDate();
                durationTask.dayInMilliseconds = this.endDate - this.startDate;

                if (durationTask.day() === 0) {
                    durationTask.hours = 0;
                    durationTask.minutes = 0;
                    durationTask.dayInMilliseconds = 0;
                    this.durationTask = 0;

                    this.time.end.replaceSelectTime(+this.time.begin.hours, +this.time.begin.minutes);
                    this.time.end.input.value = new DateForMonth(2019, 1, 1,
                        +this.time.begin.hours,
                        +this.time.begin.minutes)
                        .formatForInputTime();
                    this.updateDate();
                }

                if (this.startDate > this.endDate) {
                    if (this.time) {
                        this.time.end.replaceSelectTime(0, 0, false);
                        this.time.end.input.value = new DateForMonth(2019, 1, 1,
                            +this.time.begin.hours,
                            +this.time.begin.minutes)
                            .formatForInputTime();
                    }
                    this.disableSaveButton();
                    this.updateDate();
                } else {
                    this.enableSaveButton();
                }
            }
        });

        buttonAddTime.addEventListener(config.EVENT_LISTENER_CLICK, () => {
            this.time = {};
            durationTask.dayInMilliseconds = 3600000;
            this.durationTask = 3600000;
            durationTask.hours = 1;
            durationTask.minutes = 0;
            this.time.duration = {};
            this.time.duration.hours = 1;
            this.time.duration.minutes = 0;

            this.time.begin = new InputTime();
            this.time.end = new InputTime({
                addHours: durationTask.hours,
                defaultHours: this.time.begin.hours,
                defaultMinutes: this.time.begin.minutes,
                useDuration: true
            });

            this.endTimeDatepicker.datepicker.date.selectedDate =
                this.startTimeDatepicker.datepicker.date.selectedDate;
            this.endTimeDatepicker.datepicker.replaceDate({
                year: this.endTimeDatepicker.datepicker.date.selectedDate.getFullYear(),
                month: this.endTimeDatepicker.datepicker.date.selectedDate.getMonth(),
                day: this.endTimeDatepicker.datepicker.date.selectedDate.getDate()
            });
            this.updateDate();



            if (durationTask.day() < 0) {
                this.time.end.replaceSelectTime(+this.time.begin.hours, +this.time.begin.minutes, false);
                this.time.end.input.value = new DateForMonth(2019, 1, 1,
                    +this.time.begin.hours,
                    +this.time.begin.minutes)
                    .formatForInputTime();
                this.disableSaveButton();
                this.updateDate();
            } else {
                this.enableSaveButton();
            }

            /* Работает.*/
            this.time.begin.input.addEventListener( 'focus', () => {
                if (`${this.time.begin.hours}:${this.time.begin.minutes}` !== this.startDate.formatForInputTime()) {
                    this.time.end.input.value = new DateForMonth(2019, 1, 1,
                        +this.time.begin.hours + +durationTask.hours,
                        +this.time.begin.minutes + +durationTask.minutes)
                        .formatForInputTime();
                    this.time.end.updateTime();

                    if (this.time.end.hours < this.time.begin.hours) {
                        if(this.time.end.params.useDuration) {
                            this.time.end.replaceSelectTime(0, 0, false);
                        }
                    }

                    this.updateDate();

                    if (this.startDate.formatForInput() === this.endDate.formatForInput()) {
                        this.time.end.replaceSelectTime(+this.time.begin.hours, +this.time.begin.minutes);
                    }
                    this.endTimeDatepicker.datepicker.replaceDate({
                        year: this.endDate.getFullYear(),
                        month: this.endDate.getMonth(),
                        day: this.endDate.getDate()
                    });

                }
            });

            this.time.end.input.addEventListener( 'focus', () => {
                if (`${this.time.end.hours}:${this.time.end.minutes}` !== this.endDate.formatForInputTime()) {
                    this.updateDate();
                    durationTask.hours = new Date(this.endDate - this.startDate).getUTCHours();
                    durationTask.minutes = new Date(this.endDate - this.startDate).getUTCMinutes();

                    if (this.time.end.hours < this.time.begin.hours && this.time.end.params.useDuration){
                        durationTask.dayInMilliseconds += 86400000;
                        this.endTimeDatepicker.datepicker.date.selectedDate.setMilliseconds(86400000);
                        this.endTimeDatepicker.datepicker.replaceDate({
                            year: this.endTimeDatepicker.datepicker.date.selectedDate.getFullYear(),
                            month: this.endTimeDatepicker.datepicker.date.selectedDate.getMonth(),
                            day: this.endTimeDatepicker.datepicker.date.selectedDate.getDate()
                        });
                        this.time.end.replaceSelectTime(0, 0, false);
                    }

                    this.updateDate();
                }
            });

            const span = document.createElement(config.SELECTOR_SPAN);
            span.innerText = '-';
            span.style.height = '20px';

            const timeWrapper = document.createElement(config.SELECTOR_DIV);
            timeWrapper.className = config.CSS_CLASS_TIME_WRAPPER;
            timeWrapper.appendChild(this.time.begin.wrapper);
            timeWrapper.appendChild(span);
            timeWrapper.appendChild(this.time.end.wrapper);
            div.innerHTML = '';
            div.appendChild(timeWrapper);
            nameTask.placeholder = 'Add name';
            this.hideElement(buttonAddTime);
        });

        const save = document.createElement(config.SELECTOR_BUTTON);
        save.className = `btn btn-success ${config.CSS_CLASS_BUTTON_SAVE}`;
        save.innerText = 'Save';

        save.addEventListener(config.EVENT_LISTENER_CLICK, () => {
            if (nameTask.value) {
                console.log(nameTask.value);
                console.log(this.startDate);
                console.log(this.endDate);
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
        this.startDate = new DateForMonth(date.year, date.month, date.day);
        this.endDate = new DateForMonth(date.year, date.month, date.day);

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
        nameTask.placeholder = 'Add name and time';
        nameTask.value = '';
        this.showElement(buttonAddTime);
    }

    updateDate() {
        this.startDate.setFullYear(this.startTimeDatepicker.datepicker.date.selectedDate.getFullYear());
        this.startDate.setMonth(this.startTimeDatepicker.datepicker.date.selectedDate.getMonth());
        this.startDate.setDate(this.startTimeDatepicker.datepicker.date.selectedDate.getDate());

        this.endDate.setFullYear(this.startTimeDatepicker.datepicker.date.selectedDate.getFullYear());
        this.endDate.setMonth(this.startTimeDatepicker.datepicker.date.selectedDate.getMonth());
        this.endDate.setDate(this.startTimeDatepicker.datepicker.date.selectedDate.getDate());
        // this.endDate.setFullYear(this.endTimeDatepicker.datepicker.date.selectedDate.getFullYear());
        // this.endDate.setMonth(this.endTimeDatepicker.datepicker.date.selectedDate.getMonth());
        // this.endDate.setDate(this.endTimeDatepicker.datepicker.date.selectedDate.getDate());

        if(this.time) {
            this.time.end.updateTime();
            this.startDate.setHours(this.time.begin.hours);
            this.startDate.setMinutes(this.time.begin.minutes);
            this.endDate.setHours(this.time.begin.hours);
            this.endDate.setMinutes(this.time.begin.minutes);
            // this.endDate.setHours(this.time.begin.hours);
            // this.endDate.setMinutes(this.time.begin.minutes);
            this.endDate.setMilliseconds(this.durationTask);
        }

        // if(this.time) {
        //     this.time.end.updateTime();
        //     this.startTimeDatepicker.datepicker.date.selectedDate.setHours(this.time.begin.hours);
        //     this.startTimeDatepicker.datepicker.date.selectedDate.setMinutes(this.time.begin.minutes);
        //     this.endTimeDatepicker.datepicker.date.selectedDate.setHours(this.time.end.hours);
        //     this.endTimeDatepicker.datepicker.date.selectedDate.setMinutes(this.time.end.minutes);
        // }
        //
        // this.startDate = new DateForMonth(this.startTimeDatepicker.datepicker.date.selectedDate.getFullYear(),
        //     this.startTimeDatepicker.datepicker.date.selectedDate.getMonth(),
        //     this.startTimeDatepicker.datepicker.date.selectedDate.getDate(),
        //     this.startTimeDatepicker.datepicker.date.selectedDate.getHours(),
        //     this.startTimeDatepicker.datepicker.date.selectedDate.getMinutes(),
        // );
        // this.endDate = new DateForMonth(this.endTimeDatepicker.datepicker.date.selectedDate.getFullYear(),
        //     this.endTimeDatepicker.datepicker.date.selectedDate.getMonth(),
        //     this.endTimeDatepicker.datepicker.date.selectedDate.getDate(),
        //     this.endTimeDatepicker.datepicker.date.selectedDate.getHours(),
        //     this.endTimeDatepicker.datepicker.date.selectedDate.getMinutes(),
        // );
    }

    enableSaveButton() {
        this.endTimeDatepicker.input.classList.remove('disabled');
        if(this.time) {
            this.time.end.input.classList.remove('disabled');
        }
        document.querySelector(`.${config.CSS_CLASS_BUTTON_SAVE}`).disabled = false;
    }

    disableSaveButton() {
        this.endTimeDatepicker.input.classList.add('disabled');
        if(this.time) {
            this.time.end.input.classList.add('disabled');
        }
        document.querySelector(`.${config.CSS_CLASS_BUTTON_SAVE}`).disabled = true;
    }

    showElement(elem) {
        this.enableSaveButton();
        elem.classList.add(config.CSS_CLASS_ACTIVE);
    }

    hideElement(elem) {
        elem.classList.remove(config.CSS_CLASS_ACTIVE);
    }

    convertInMilliseconds(hours = 0, minutes = 0){
        return hours * 60 * 60 * 1000 + minutes * 60 * 1000;
    }


}

