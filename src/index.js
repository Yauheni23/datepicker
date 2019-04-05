import './style.css';

const Month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];

const DaysOfWeek = [
    'Su',
    'Mo',
    'Tu',
    'We',
    'Th',
    'Fr',
    'Sa',
];

Date.prototype.daysInMonth = function() {
    return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
};

document.addEventListener('DOMContentLoaded', function() {


document.querySelectorAll('input[type="date_picker"]').forEach((datepicker, index) => {
    let clickDatepicker = false;

    datepicker.dataset.id = index + '';


    const currentDate = new Date();

    const coordinates = datepicker.getBoundingClientRect();

    const calendar = document.createElement('div');
    calendar.className = 'calendar';


    calendar.style.top = `${coordinates.bottom}px`;
    calendar.style.left = `${coordinates.left}px`;

    const dateInputWrapper = document.createElement('div');

    dateInputWrapper.className = 'dateInputWrapper';

    const selectMonth = document.createElement('select');

    selectMonth.id = 'month';

    Month.forEach((el, index) => {
        const option = document.createElement('option');
        option.value = `${index}`;
        option.innerText = el;
        selectMonth.appendChild(option);
    });

    selectMonth.value = currentDate.getMonth() + '';

    const inputYear = document.createElement('input');

    inputYear.id = 'year';
    inputYear.type = "number";
    inputYear.value = currentDate.getFullYear() + '';

    const daysOfWeek = document.createElement('div');

    daysOfWeek.className = 'daysOfWeek';

    DaysOfWeek.forEach(name => {
        const dayOfWeek = document.createElement('div');
        dayOfWeek.className= 'dayOfWeek';

        const spanDayOfWeek = document.createElement('span');
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

    document.querySelector("body").appendChild(calendar);





    calendar.addEventListener("mousedown", () => {
        clickDatepicker = true;
    });

    selectMonth.addEventListener('change', () => {
        daysOfMonth.innerHTML = createDaysOfMonth(new Date(+inputYear.value, +selectMonth.value)).innerHTML;
        selectDate(daysOfMonth);
    });

    inputYear.addEventListener('change', () => {
        daysOfMonth.innerHTML = createDaysOfMonth(new Date(+inputYear.value, +selectMonth.value)).innerHTML;
        selectDate(daysOfMonth);
    });


    datepicker.addEventListener('focus', () => {
        calendar.classList.add('active');
    });

    datepicker.addEventListener('blur', (event) => {

        if(clickDatepicker) datepicker.focus()
            else {
                calendar.classList.remove('active');
                const selectedDate = datepicker.value.split('-');

                selectedDate[1] = `${+selectedDate[1] -1}`;

                if(+selectedDate[1] < 10) selectedDate[1] = '0' + selectedDate[1];

                const checkSelectedDate = (+selectedDate[0] >= 1000) && (+selectedDate[0] < 9999) && (+selectedDate[1] >= 1) && (+selectedDate[1] <= 12) && (+selectedDate[2] >= 1) && (+selectedDate[2] <= new Date(+selectedDate[0], +selectedDate[1]).daysInMonth());
                if (selectedDate && checkSelectedDate && !Number.isNaN(+selectedDate[0] + +selectedDate[1] + +selectedDate[2])){
                    daysOfMonth.innerHTML = createDaysOfMonth(new Date(+selectedDate[0], +selectedDate[1])).innerHTML;
                    selectDate(daysOfMonth);
                    inputYear.value = selectedDate[0];
                    selectMonth.value = `${+selectedDate[1]}`;
                    daysOfMonth.querySelector(`div[data-date="${selectedDate[0]}-${selectedDate[1]}-${selectedDate[2]}"]`).classList.add('selected');
                }

        }

        clickDatepicker = false;
    })

});

}, false);



function createDaysOfMonth( date ) {
    const daysOfMonth = document.createElement('div');
    daysOfMonth.className = 'daysOfMonth';

    const dayOfWeek = new Date(date.getFullYear(), date.getMonth()).getDay();
    const countWeeksInMonth = (date.daysInMonth() - 7 + dayOfWeek) / 7 | 0 ;

    for(let i = 0; i <= countWeeksInMonth + 1; i++) {
        const rowDaysOfMonth = document.createElement('div');
        rowDaysOfMonth.className = 'rowDaysOfMonth';

        for(let j = 0; j < 7; j++){
            const dayOfMonth = document.createElement('div');
            dayOfMonth.className = 'dayOfMonth';

            const currentDayOfMonth = (7 * i) + j + 1 - dayOfWeek;

            const spanDayOfMonth = document.createElement('span');

            const day = (currentDayOfMonth > 0 && currentDayOfMonth <= date.daysInMonth()) ?
                currentDayOfMonth + '' : '';

            spanDayOfMonth.innerText = day;

            if(day !== '') {
                dayOfMonth.classList.add('enabled');
                dayOfMonth.dataset.date = `${date.getFullYear()}-${(date.getMonth() < 9) ? '0' + date.getMonth() : date.getMonth() }-${(day <= 9) ? '0' + day : day }`;
            }

            dayOfMonth.appendChild(spanDayOfMonth);
            rowDaysOfMonth.appendChild(dayOfMonth);
        }

        daysOfMonth.appendChild(rowDaysOfMonth);
    }

    if(new Date().getFullYear() === date.getFullYear() && new Date().getMonth() === date.getMonth()){
        daysOfMonth.querySelectorAll('.dayOfMonth.enabled').forEach( el => {
            if(el.childNodes && +el.childNodes[0].innerText === new Date().getDate()){
                el.classList.add('today');
            }
        })
    }

    return daysOfMonth;

}

function selectDate(daysOfMonth) {
    daysOfMonth.childNodes.forEach(week => {
        week.childNodes.forEach( day => {
            if (day.dataset.date && day.dataset.date !==''){
                day.addEventListener('click', () => {
                    if (daysOfMonth.querySelector('.rowDaysOfMonth .dayOfMonth.selected'))
                        daysOfMonth.querySelector('.rowDaysOfMonth .dayOfMonth.selected').classList.remove('selected');

                    document.querySelectorAll('input[type="date_picker"]').forEach(input => {
                        if(input.dataset.id === daysOfMonth.dataset.id){
                            const selectedDate = day.dataset.date.split('-');

                            selectedDate[1] = `${+selectedDate[1] + 1}`;

                            if(+selectedDate[1] < 10) selectedDate[1] = '0' + selectedDate[1];

                            input.value = `${selectedDate[0]}-${selectedDate[1]}-${selectedDate[2]}`;

                            day.classList.add('selected');
                            input.blur()
                        }
                    })
                });

            }
        })
    });
}




























