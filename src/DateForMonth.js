export class DateForMonth  extends Date {
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
