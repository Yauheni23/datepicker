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



document.querySelectorAll('input[type="date_picker"]').forEach((datepicker) => {
    let clickDatepicker = false;

    const currentDate = new Date(2019, 1);

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






    dateInputWrapper.appendChild(selectMonth);

    dateInputWrapper.appendChild(inputYear);

    calendar.appendChild(dateInputWrapper);

    calendar.appendChild(daysOfWeek);

    calendar.appendChild(daysOfMonth);

    document.querySelector("body").appendChild(calendar);


    calendar.addEventListener("mousedown", () => {
        clickDatepicker = true;
    });


    datepicker.addEventListener('focus', () => {
        calendar.classList.add('active');
    });

    datepicker.addEventListener('blur', (event) => {
        clickDatepicker ? datepicker.focus() : calendar.classList.remove('active');
        clickDatepicker = false;
    })

});




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

            if(day !== '') dayOfMonth.classList.add('enabled');


            dayOfMonth.appendChild(spanDayOfMonth);
            rowDaysOfMonth.appendChild(dayOfMonth);
        }

        daysOfMonth.appendChild(rowDaysOfMonth);
    }

    return daysOfMonth;

}




























