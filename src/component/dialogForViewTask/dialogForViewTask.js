import { Dialog } from '../dialog/dialog';
import { config } from '../../config';
import { DeleteTask } from './deleteTask';
import { DateForMonth } from '../../dateForMonth';

export class DialogForViewTask extends Dialog{
  constructor() {
    super();
    this.dialog.classList.add(config.css_class.VIEW_TASK);
    this.name = document.createElement(config.selector.SPAN);
    this.startDate = document.createElement(config.selector.SPAN);
    this.endDate = document.createElement(config.selector.SPAN);

    this.deleteTask = new DeleteTask();

    this.dialog.appendChild(this.deleteTask.component);
    this.dialog.appendChild(this.name);
    this.dialog.appendChild(this.startDate);
    this.dialog.appendChild(this.endDate);
  }

  removeTaskFromLocalStorage() {
    const dateOfLocalStorage = new DateForMonth(Date.parse(this.selectedElement.startDate)).formatForInput();
    const taskOfDay = JSON.parse(localStorage.getItem(dateOfLocalStorage));
    if (taskOfDay && taskOfDay.tasks.length > 1) {
      const indexOfRemove = taskOfDay.tasks.findIndex(elementOfRemove => {
        return elementOfRemove.name === this.selectedElement.name
          && elementOfRemove.startDate === this.selectedElement.startDate
          && elementOfRemove.endDate === this.selectedElement.endDate;
      });
      taskOfDay.tasks.splice(indexOfRemove, 1);
      localStorage.setItem(dateOfLocalStorage, JSON.stringify(taskOfDay));
    } else {
      localStorage.removeItem(dateOfLocalStorage);
    }
    this.hideDialog();
    this.callCustomEventDelete();
  }

  callCustomEventDelete() {
    this.deleteTask.setDataForDelete({
      startDate: new DateForMonth(Date.parse(this.selectedElement.startDate))
    });
    this.deleteTask.callCustomEventDeleteForElement(document.querySelector(`.${ config.css_class.CALENDAR_MONTH }`));
  }

  showDialog(el) {
    this.selectedElement = el;
    this.fillDialog();
    this.replaceDeleteTask();
    super.showDialog();
  }

  fillDialog() {
    this.name.innerText = `Name: ${ this.selectedElement.name }`;
    this.startDate.innerText = `Start date: ${ new DateForMonth(Date.parse(this.selectedElement.startDate)) }`;
    if (this.selectedElement.duration !== 0) {
      this.endDate.innerText = `End date: ${ new DateForMonth(Date.parse(this.selectedElement.endDate)) }`;
    } else {
      this.endDate.innerText = '';
    }
  }

  replaceDeleteTask() {
    this.deleteTask = new DeleteTask();
    this.dialog.replaceChild(this.deleteTask.component, this.dialog.querySelector(`.${config.css_class.DELETE_TASK}`));
  }

}