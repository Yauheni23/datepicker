import { config } from './config';

export class DateForMonth extends Date {
  constructor(...args) {
    super(...args);
  }

  daysInMonth() {
    return config.NUMBER_FOR_COUNT_DAYS_IN_MONTH
      - new Date(this.getFullYear(), this.getMonth(), config.NUMBER_FOR_COUNT_DAYS_IN_MONTH).getDate();
  }

  arrayDaysInMonth() {
    const arrayDaysInMonth = [];
    const dayOfWeek = new Date(this.getFullYear(), this.getMonth()).getDay();
    const countWeeksInMonth = (this.daysInMonth() - 7 + dayOfWeek - 0.0001) / 7 | 0;

    for (let i = 0; i <= countWeeksInMonth + 1; i++) {
      arrayDaysInMonth[i] = [];
      for (let j = 0; j < 7; j++) {
        const currentDayOfMonth = (7 * i) + j + 1 - dayOfWeek;
        arrayDaysInMonth[i][j] = (currentDayOfMonth > 0 && currentDayOfMonth <= this.daysInMonth()) ?
          currentDayOfMonth + '' : '';
      }
    }
    return arrayDaysInMonth;
  }

  formatForInput() {
    let month = this.getMonth() + 1;
    let day = this.getDate();

    (month <= 9) ? month = '0' + month : month + '';
    (day <= 9) ? day = '0' + day : day + '';

    return `${ this.getFullYear() }-${ month }-${ day }`;
  }

  formatForInputTime(addHours = 0, addMinutes = 0) {
    let hours = this.getHours() + addHours;
    let minutes = this.getMinutes() + addMinutes;

    if (minutes > 0 && minutes <= 30) {
      minutes = 30;
    } else if (minutes > 30) {
      minutes = 0;
      hours++;
    }
    if (hours >= 24) {
      hours = hours % 24;
    }
    (hours <= 9) ? hours = '0' + hours : hours + '';
    (minutes <= 9) ? minutes = '0' + minutes : minutes + '';

    return `${ hours }:${ minutes }`;
  }

  static convertInMilliseconds(hours = 0, minutes = 0) {
    return hours * 60 * 60 * 1000 + minutes * 60 * 1000;
  }

  equate(element) {
    this.setFullYear(element.getFullYear());
    this.setMonth(element.getMonth());
    this.setDate(element.getDate());
    this.setHours(element.getHours());
    this.setMinutes(element.getMinutes());
    this.setSeconds(element.getSeconds());
    this.setMilliseconds(element.getMilliseconds());
  }
}
