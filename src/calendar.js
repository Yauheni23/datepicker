const config =  {
    MONTH: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    DAYS_OF_WEEK: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],

    SELECTOR_INPUT_DATE_PICKER: 'input[type="date_picker"]',
    SELECTOR_DIV: 'div',
    SELECTOR_SELECT: 'select',
    SELECTOR_OPTION: 'option',
    SELECTOR_INPUT: 'INPUT',
    SELECTOR_SPAN: 'span',
    SELECTOR_BODY: 'body',

    EVENT_LISTENER_MOUSEDOWN: 'mousedown',
    EVENT_LISTENER_CHANGE: 'change',
    EVENT_LISTENER_FOCUS: 'focus',
    EVENT_LISTENER_BLUR: 'blur',
    EVENT_LISTENER_CLICK: 'click',

    CSS_CLASS_CALENDAR: 'calendar',
    CSS_CLASS_DATE_INPUT_WRAPPER: 'dateInputWrapper',
    CSS_CLASS_ROW_DAYS_OF_MONTH: 'rowDaysOfMonth',
    CSS_CLASS_DAYS_OF_MONTH: 'daysOfMonth',
    CSS_CLASS_DAY_OF_MONTH: 'dayOfMonth',
    CSS_CLASS_DAYS_OF_WEEK: 'daysOfWeek',
    CSS_CLASS_DAY_OF_WEEK: 'dayOfWeek',
    CSS_CLASS_TODAY: 'today',
    CSS_CLASS_ACTIVE: 'active',
    CSS_CLASS_ENABLED: 'enabled',
    CSS_CLASS_SELECTED: 'selected',

    CSS_ID_MONTH: 'month',
    CSS_ID_YEAR: 'year',

    ATTRIBUTE_TYPE_NUMBER: 'number',

};



class DateForMonth  extends Date {
    daysInMonth() {
        const NUMBER_FOR_COUNT_DAYS_IN_MONTH = 33;
        return NUMBER_FOR_COUNT_DAYS_IN_MONTH
            - new Date(this.getFullYear(), this.getMonth(), NUMBER_FOR_COUNT_DAYS_IN_MONTH).getDate();
    }
    arrayDaysInMonth() {
        const arrayDaysInMonth = [];
        const dayOfWeek = new Date(this.getFullYear(), this.getMonth()).getDay();
        const countWeeksInMonth = (this.daysInMonth() - 7 + dayOfWeek) / 7 | 0 ;

        for(let i = 0; i <= countWeeksInMonth + 1; i++) {
            arrayDaysInMonth[i] = [];
            for(let j = 0; j < 7; j++){
                const currentDayOfMonth = (7 * i) + j + 1 - dayOfWeek;
                arrayDaysInMonth[i][j] = (currentDayOfMonth > 0 && currentDayOfMonth <= this.daysInMonth()) ?
                    currentDayOfMonth + '' : '';
            }

        }
        return arrayDaysInMonth;
    }
    formatForInput(){
        let month = this.getMonth() + 1;
        let day = this.getDate();

        (month <= 9) ? month = '0' + month : month + '';
        (day <= 9) ? day = '0' + day : day + '';

        return `${this.getFullYear()}-${month}-${day}`;
    }
}



class Calendar {
    constructor(selectedMonth = new DateForMonth(), selectedDate = null, id = 1) {
        this.clickDatepicker = false;

        this.selectedMonth = selectedMonth;
        this.currentDate = new DateForMonth();
        this.id = id;

        const calendar = document.createElement(config.SELECTOR_DIV);
        calendar.className = config.CSS_CLASS_CALENDAR;
        calendar.dataset.id = this.id;

        const dateInputWrapper = document.createElement(config.SELECTOR_DIV);
        dateInputWrapper.className = config.CSS_CLASS_DATE_INPUT_WRAPPER;

        const selectMonth = document.createElement(config.SELECTOR_SELECT);
        selectMonth.id = config.CSS_ID_MONTH;

        config.MONTH.forEach((el, index) => {
            const option = document.createElement(config.SELECTOR_OPTION);
            option.value = `${index}`;
            option.innerText = el;
            selectMonth.appendChild(option);
        });

        selectMonth.value = this.currentDate.getMonth() + '';

        const inputYear = document.createElement(config.SELECTOR_INPUT);

        inputYear.id = config.CSS_ID_YEAR;
        inputYear.type = config.ATTRIBUTE_TYPE_NUMBER;
        inputYear.value = this.currentDate.getFullYear() + '';

        const daysOfWeek = document.createElement(config.SELECTOR_DIV);
        daysOfWeek.className = config.CSS_CLASS_DAYS_OF_WEEK;

        config.DAYS_OF_WEEK.forEach(name => {
            const dayOfWeek = document.createElement(config.SELECTOR_DIV);
            dayOfWeek.className= config.CSS_CLASS_DAY_OF_WEEK;

            const spanDayOfWeek = document.createElement(config.SELECTOR_SPAN);
            spanDayOfWeek.innerText = name;

            dayOfWeek.appendChild(spanDayOfWeek);
            daysOfWeek.appendChild(dayOfWeek);
        });

        let daysOfMonth = this.createDaysOfMonth(this.selectedMonth.arrayDaysInMonth());


        dateInputWrapper.appendChild(selectMonth);

        dateInputWrapper.appendChild(inputYear);

        calendar.appendChild(dateInputWrapper);

        calendar.appendChild(daysOfWeek);

        calendar.appendChild(daysOfMonth);

        this.calendar = calendar ;




        calendar.addEventListener(config.EVENT_LISTENER_MOUSEDOWN, () => {
            this.clickDatepicker = true;
        });

        selectMonth.addEventListener(config.EVENT_LISTENER_CHANGE, () => {
            this.selectedMonth = new DateForMonth(+inputYear.value, +selectMonth.value);
            this.calendar.replaceChild(
                this.createDaysOfMonth(this.selectedMonth.arrayDaysInMonth()),
                this.calendar.childNodes[2]
            );
        });

        inputYear.addEventListener(config.EVENT_LISTENER_CHANGE, () => {
            this.selectedMonth = new DateForMonth(+inputYear.value, +selectMonth.value);
            this.calendar.replaceChild(
                this.createDaysOfMonth(this.selectedMonth.arrayDaysInMonth()),
                this.calendar.childNodes[2]
            );
        });


    }

    createDaysOfMonth ( arrayDate ) {
        const daysOfMonth = document.createElement(config.SELECTOR_DIV);
        daysOfMonth.className = config.CSS_CLASS_DAYS_OF_MONTH;

        for(let i = 0; i < arrayDate.length; i++) {
            const rowDaysOfMonth = document.createElement(config.SELECTOR_DIV);
            rowDaysOfMonth.className = config.CSS_CLASS_ROW_DAYS_OF_MONTH;

            for(let j = 0; j < 7; j++){
                const dayOfMonth = document.createElement(config.SELECTOR_DIV);
                dayOfMonth.className = config.CSS_CLASS_DAY_OF_MONTH;

                if(arrayDate[i][j] !== '') {
                    const spanDayOfMonth = document.createElement(config.SELECTOR_SPAN);
                    spanDayOfMonth.innerText = arrayDate[i][j];

                    this.selectDate(dayOfMonth, arrayDate[i][j]);

                    if(new Date().getFullYear() === this.selectedMonth.getFullYear()
                        && new Date().getMonth() === this.selectedMonth.getMonth()
                        && new Date().getDate() === +arrayDate[i][j]) {
                        dayOfMonth.classList.add(config.CSS_CLASS_TODAY);
                    }
                    dayOfMonth.classList.add(config.CSS_CLASS_ENABLED);
                    dayOfMonth.appendChild(spanDayOfMonth);
                }

                rowDaysOfMonth.appendChild(dayOfMonth);
            }

            daysOfMonth.appendChild(rowDaysOfMonth);
        }

        return daysOfMonth;

    }

    selectDate(daySelector, dayDate) {
        daySelector.addEventListener(config.EVENT_LISTENER_CLICK, () => {
            const input = document.querySelector(config.SELECTOR_INPUT_DATE_PICKER + `[data-id="${this.id}"]`);

            input.value = new DateForMonth(this.selectedMonth.getFullYear(),
                                           this.selectedMonth.getMonth(),
                                           dayDate).formatForInput();

            const selectedDay = this.calendar.childNodes[2].querySelector(`.${config.CSS_CLASS_SELECTED}`);
                if(selectedDay) { selectedDay.classList.remove(config.CSS_CLASS_SELECTED); }

            daySelector.classList.add(config.CSS_CLASS_SELECTED);
            input.blur();
        });
    }

}


const calendar = new Calendar(new DateForMonth(2019, 2));

console.log(calendar);
// const newDate = new DateForMonth(2019,3);
// console.log(newDate.getMonth());
// console.log(newDate.formatForInput());
// console.log(newDate.arrayDaysInMonth());
document.body.appendChild(calendar.calendar);













