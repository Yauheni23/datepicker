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

Date.prototype.daysInMonth = function() {
    return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
};






class Calendar {
    constructor() {
        const currentDate = new Date();

        const calendar = document.createElement(config.SELECTOR_DIV);
        calendar.className = config.CSS_CLASS_CALENDAR;

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

        selectMonth.value = currentDate.getMonth() + '';

        const inputYear = document.createElement(config.SELECTOR_INPUT);

        inputYear.id = config.CSS_ID_YEAR;
        inputYear.type = config.ATTRIBUTE_TYPE_NUMBER;
        inputYear.value = currentDate.getFullYear() + '';

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

        const daysOfMonth = this.createDaysOfMonth(currentDate);


        dateInputWrapper.appendChild(selectMonth);

        dateInputWrapper.appendChild(inputYear);

        calendar.appendChild(dateInputWrapper);

        calendar.appendChild(daysOfWeek);

        calendar.appendChild(daysOfMonth);

        this.calendar =calendar ;

        // document.querySelector(config.SELECTOR_BODY).appendChild(calendar);


    }

    createDaysOfMonth ( date ) {
        const daysOfMonth = document.createElement(config.SELECTOR_DIV);
        daysOfMonth.className = config.CSS_CLASS_DAYS_OF_MONTH;

        const dayOfWeek = new Date(date.getFullYear(), date.getMonth()).getDay();
        const countWeeksInMonth = (date.daysInMonth() - 7 + dayOfWeek) / 7 | 0 ;

        for(let i = 0; i <= countWeeksInMonth + 1; i++) {
            const rowDaysOfMonth = document.createElement(config.SELECTOR_DIV);
            rowDaysOfMonth.className = config.CSS_CLASS_ROW_DAYS_OF_MONTH;

            for(let j = 0; j < 7; j++){
                const dayOfMonth = document.createElement(config.SELECTOR_DIV);
                dayOfMonth.className = config.CSS_CLASS_DAY_OF_MONTH;

                const currentDayOfMonth = (7 * i) + j + 1 - dayOfWeek;

                const spanDayOfMonth = document.createElement(config.SELECTOR_SPAN);

                const day = (currentDayOfMonth > 0 && currentDayOfMonth <= date.daysInMonth()) ?
                    currentDayOfMonth + '' : '';

                spanDayOfMonth.innerText = day;

                if(day !== '') {
                    dayOfMonth.classList.add(config.CSS_CLASS_ENABLED);
                    dayOfMonth.dataset.date = `${date.getFullYear()}-${(date.getMonth() < 9) ? '0' + date.getMonth() : date.getMonth() }-${(day <= 9) ? '0' + day : day }`;
                }

                dayOfMonth.appendChild(spanDayOfMonth);
                rowDaysOfMonth.appendChild(dayOfMonth);
            }

            daysOfMonth.appendChild(rowDaysOfMonth);
        }

        if(new Date().getFullYear() === date.getFullYear() && new Date().getMonth() === date.getMonth()){
            daysOfMonth.querySelectorAll(`.${config.CSS_CLASS_DAY_OF_MONTH}.${config.CSS_CLASS_ENABLED}`)
                .forEach( el => {
                    if(el.childNodes && +el.childNodes[0].innerText === new Date().getDate()){
                        el.classList.add(config.CSS_CLASS_TODAY);
                    }
                })
        }

        return daysOfMonth;

    }



}
const calendar = new Calendar()
document.body.appendChild(calendar.calendar);



