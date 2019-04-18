import { DateForMonth } from './dateForMonth';

export class Calendar {
  constructor(selectedDate = null) {
    this.selectedDate = selectedDate;
    this.selectedMonth = selectedDate || new DateForMonth();
  }

  replaceMonth(inputYear = new Date().getFullYear(), selectMonth = new Date().getMonth()) {
    this.selectedMonth = new DateForMonth(+inputYear, +selectMonth);
  }

  setSelectedDate(date) {
    this.selectedDate = new DateForMonth(+date.year, +date.month, +date.day);
  }

  static validDate(dateString) {
    const selectedDate = dateString.split('-');
    let date = null;

    if ((+selectedDate[0] >= 1000)
      && (+selectedDate[0] < 9999)
      && (+selectedDate[1] >= 1)
      && (+selectedDate[1] <= 12)
      && (+selectedDate[2] >= 1)
      && (+selectedDate[2] <= new DateForMonth(+selectedDate[0], +selectedDate[1]).daysInMonth())) {
      date = {};
      date.year = +selectedDate[0];
      date.month = +selectedDate[1] - 1;
      date.day = +selectedDate[2];
    }

    return date || null;
  }
}














