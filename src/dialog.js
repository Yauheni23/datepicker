import {DatepickerHtmlElement} from './datepickerHtmlElement';
import {config} from './config';
import {DateForMonth} from './dateForMonth';

export class Dialog {
    constructor() {
        this.name = 'lol';
        this.startDate = new Date();
        this.endDate = new Date();

        this.dialog = document.createElement(config.SELECTOR_DIV);
        this.dialog.className = config.CSS_CLASS_DIALOG;

        const close = document.createElement(config.SELECTOR_DIV);
        close.className = config.CSS_CLASS_CLOSE;
        close.innerHTML = '<i class="fas fa-times"></i>';
        close.addEventListener(config.EVENT_LISTENER_CLICK, () => {

        });

        const nameTask = document.createElement(config.SELECTOR_INPUT);
        nameTask.className = config.CSS_CLASS_NAME_TASK;
        nameTask.placeholder = 'Добавьте название и время';

        const timeTask = document.createElement(config.SELECTOR_DIV);
        timeTask.className = config.CSS_CLASS_TIME_TASK;

        const startTimeDatepicker = this.createDatepicker(0);
        startTimeDatepicker.className = config.CSS_CLASS_START_TIME_DATE_PICKER;

        const endTimeDatepicker = this.createDatepicker(1, {
            defaultDate: new DateForMonth(2015, 0, 2)
        });
        endTimeDatepicker.className = config.CSS_CLASS_END_TIME_DATE_PICKER;

        const span = document.createElement(config.SELECTOR_SPAN);
        span.innerHTML = '-';

        this.dialog.appendChild(close);

        const save = document.createElement(config.SELECTOR_DIV);
        save.className = 'btn btn-success';
        save.innerText = 'Сохранить';


        timeTask.appendChild(startTimeDatepicker);
        timeTask.appendChild(span);
        timeTask.appendChild(endTimeDatepicker);

        this.dialog.appendChild(nameTask);

        this.dialog.appendChild(timeTask);

        this.dialog.appendChild(save);


    }

    createDatepicker(index, params = {}) {
        const divWrapper = document.createElement(config.SELECTOR_DIV);
        divWrapper.style.position = 'relative';

        const datepicker = document.createElement(config.SELECTOR_INPUT);
        datepicker.className = config.CSS_CLASS_INPUT_TIME_DATE_PICKER;
        datepicker.type = config.ATTRIBUTE_TYPE_DATE_PICKER;
        datepicker.dataset.id = index;
        divWrapper.appendChild(datepicker);

        const calendar = new DatepickerHtmlElement(params);
        calendar.connectWithInput(index, datepicker);
        divWrapper.appendChild(calendar.calendar);

        return divWrapper;
    }
}
