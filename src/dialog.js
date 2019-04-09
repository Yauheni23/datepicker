import {DatepickerHtmlElement} from './datepickerHtmlElement';
import {config} from './config';
import {DateForMonth} from './dateForMonth';

export class Dialog {
    constructor(date) {
        this.name = 'lol';
        this.startDate = new Date();
        this.endDate = new Date();

        this.dialog = document.createElement(config.SELECTOR_DIV);
        this.dialog.className = config.CSS_CLASS_DIALOG;

        const close = document.createElement(config.SELECTOR_DIV);
        close.className = config.CSS_CLASS_CLOSE;
        close.innerHTML = '<i class="fas fa-times"></i>';
        close.addEventListener(config.EVENT_LISTENER_CLICK, () => {
            this.hideDialog();
        });

        const nameTask = document.createElement(config.SELECTOR_INPUT);
        nameTask.className = config.CSS_CLASS_NAME_TASK;
        nameTask.placeholder = 'Добавьте название и время';

        const timeTask = document.createElement(config.SELECTOR_DIV);
        timeTask.className = config.CSS_CLASS_TIME_TASK;

        this.startTimeDatepicker = this.createDatepicker(0,{
            defaultDate: new DateForMonth(date.year, date.month, date.day)
        });

        this.endTimeDatepicker = this.createDatepicker(1,{
            defaultDate: new DateForMonth(date.year, date.month, date.day)
        });

        // this.endTimeDatepicker.className = config.CSS_CLASS_END_TIME_DATE_PICKER;

        const span = document.createElement(config.SELECTOR_SPAN);
        span.innerHTML = '-';

        this.dialog.appendChild(close);

        const save = document.createElement(config.SELECTOR_DIV);
        save.className = 'btn btn-success';
        save.innerText = 'Сохранить';


        timeTask.appendChild(this.startTimeDatepicker.wrapper);
        timeTask.appendChild(span);
        timeTask.appendChild(this.endTimeDatepicker.wrapper);

        this.dialog.appendChild(nameTask);

        this.dialog.appendChild(timeTask);

        this.dialog.appendChild(save);


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

    showDialog(date) {
        this.startTimeDatepicker.datepicker.replaceDate(date);
        this.endTimeDatepicker.datepicker.replaceDate(date);

        this.dialog.classList.add(config.CSS_CLASS_ACTIVE_DIALOG);
    }

    hideDialog() {
        this.dialog.classList.remove(config.CSS_CLASS_ACTIVE_DIALOG);
    }
}
