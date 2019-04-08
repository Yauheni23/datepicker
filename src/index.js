import './style.css';
import { config } from './config';

Date.prototype.daysInMonth = function() {
    return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
};

document.addEventListener('DOMContentLoaded', function() {


    document.querySelectorAll(config.SELECTOR_INPUT_DATE_PICKER).forEach((datepicker, index) => {

        let clickDatepicker = false;



        datepicker.dataset.id = index + '';
        const currentDate = new Date();



        const calendar = document.createElement(config.SELECTOR_DIV);
        calendar.className = config.CSS_CLASS_CALENDAR;

        /* Location calendar*/

        const coordinates = datepicker.getBoundingClientRect();
        calendar.style.top = `${coordinates.bottom}px`;
        calendar.style.left = `${coordinates.left}px`;



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

        const daysOfMonth = createDaysOfMonth(currentDate);
        daysOfMonth.dataset.id = index + '';

        selectDate(daysOfMonth);



        dateInputWrapper.appendChild(selectMonth);

        dateInputWrapper.appendChild(inputYear);

        calendar.appendChild(dateInputWrapper);

        calendar.appendChild(daysOfWeek);

        calendar.appendChild(daysOfMonth);

        document.querySelector(config.SELECTOR_BODY).appendChild(calendar);


        /* Event-listeners for calendar */


        calendar.addEventListener(config.EVENT_LISTENER_MOUSEDOWN, () => {
            clickDatepicker = true;
        });

        selectMonth.addEventListener(config.EVENT_LISTENER_CHANGE, () => {
            daysOfMonth.innerHTML = createDaysOfMonth(new Date(+inputYear.value, +selectMonth.value)).innerHTML;
            selectDate(daysOfMonth);
        });

        inputYear.addEventListener(config.EVENT_LISTENER_CHANGE, () => {
            daysOfMonth.innerHTML = createDaysOfMonth(new Date(+inputYear.value, +selectMonth.value)).innerHTML;
            selectDate(daysOfMonth);
        });


        datepicker.addEventListener(config.EVENT_LISTENER_FOCUS, () => {
            calendar.classList.add(config.CSS_CLASS_ACTIVE);
        });

        datepicker.addEventListener(config.EVENT_LISTENER_BLUR, () => {

            if(clickDatepicker) { datepicker.focus(); }
            else {
                calendar.classList.remove(config.CSS_CLASS_ACTIVE);
                const selectedDate = datepicker.value.split('-');

                selectedDate[1] = `${+selectedDate[1] -1}`;

                if(+selectedDate[1] < 10) { selectedDate[1] = '0' + selectedDate[1]; }

                const checkSelectedDate = (+selectedDate[0] >= 1000)
                    && (+selectedDate[0] < 9999)
                    && (+selectedDate[1] >= 1)
                    && (+selectedDate[1] <= 12)
                    && (+selectedDate[2] >= 1)
                    && (+selectedDate[2] <= new Date(+selectedDate[0], +selectedDate[1]).daysInMonth());

                if (selectedDate
                    && checkSelectedDate
                    && !Number.isNaN(+selectedDate[0] + +selectedDate[1] + +selectedDate[2])) {

                    daysOfMonth.innerHTML = createDaysOfMonth(new Date(+selectedDate[0], +selectedDate[1])).innerHTML;
                    selectDate(daysOfMonth);
                    inputYear.value = selectedDate[0];
                    selectMonth.value = `${+selectedDate[1]}`;
                    daysOfMonth.querySelector(`div[data-date="${selectedDate[0]}-${selectedDate[1]}-${selectedDate[2]}"]`).classList.add('selected');
                }
            }

            clickDatepicker = false;
        });

    });


}, false);



function createDaysOfMonth( date ) {
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
            });
    }

    return daysOfMonth;

}

function selectDate(daysOfMonth) {
    daysOfMonth.childNodes.forEach(week => {
        week.childNodes.forEach( day => {
            if (day.dataset.date && day.dataset.date !==''){
                day.addEventListener(config.EVENT_LISTENER_CLICK, () => {
                    if (daysOfMonth.querySelector(`.${config.CSS_CLASS_ROW_DAYS_OF_MONTH} 
                                                   .${config.CSS_CLASS_DAY_OF_MONTH}.${config.CSS_CLASS_SELECTED}`)) {

                        daysOfMonth.querySelector(`.${config.CSS_CLASS_ROW_DAYS_OF_MONTH} 
                                                   .${config.CSS_CLASS_DAY_OF_MONTH}.${config.CSS_CLASS_SELECTED}`)
                            .classList.remove(config.CSS_CLASS_SELECTED);
                    }

                    document.querySelectorAll(config.SELECTOR_INPUT_DATE_PICKER).forEach(input => {
                        if(input.dataset.id === daysOfMonth.dataset.id){
                            const selectedDate = day.dataset.date.split('-');

                            selectedDate[1] = `${+selectedDate[1] + 1}`;

                            if(+selectedDate[1] < 10) { selectedDate[1] = '0' + selectedDate[1]; }

                            input.value = `${selectedDate[0]}-${selectedDate[1]}-${selectedDate[2]}`;

                            day.classList.add(config.CSS_CLASS_SELECTED);
                            input.blur();
                        }
                    });
                });

            }
        });
    });
}




























