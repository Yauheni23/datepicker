export const config = {
  MONTH: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  DAYS_OF_WEEK: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  MONTH_CALENDAR_MONTH: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  DAYS_OF_WEEK_CALENDAR_MONTH: ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
  NUMBER_FOR_COUNT_DAYS_IN_MONTH: 33,
  API_KEY: 'e5eb129d-cb73-43b6-b846-68a2f6014f4e',
  GOOGLE_MAPS: 'https://geocode-maps.yandex.ru/1.x/',

  selector: {
    INPUT_DATE_PICKER: 'input[type="date_picker"]',
    DIV: 'div',
    UL: 'ul',
    LI: 'li',
    SELECT: 'select',
    OPTION: 'option',
    INPUT: 'INPUT',
    SPAN: 'span',
    BODY: 'body',
    BUTTON: 'button',
    DIV_CALENDAR: 'div[type="calendar"]',
  },
  event_listener: {
    MOUSEDOWN: 'mousedown',
    CHANGE: 'change',
    FOCUS: 'focus',
    BLUR: 'blur',
    CLICK: 'click',
  },
  css_class: {
    DATE_PICKER: 'datepicker',
    DATE_INPUT_WRAPPER: 'dateInputWrapper',
    ROW_DAYS_OF_MONTH: 'rowDaysOfMonth',
    DAYS_OF_MONTH: 'daysOfMonth',
    DAY_OF_MONTH: 'dayOfMonth',
    DAYS_OF_WEEK: 'daysOfWeek',
    DAY_OF_WEEK: 'dayOfWeek',
    TODAY: 'today',
    WEEKEND: 'weekend',
    ACTIVE: 'activeBlock',
    ACTIVE_FLEX: 'activeDialog',
    ENABLED: 'enabled',
    DISABLED: 'disabled',
    SELECTED: 'selected',
    SHOW_HOVER: 'showHover',
    DATE_PICKER_WRAPPER: 'datePickerWrapper',

    CALENDAR_MONTH: 'calendarMonth',
    DIALOG: 'dialog',
    OUTSIDE_DIALOG: 'outsideDialog',
    CLOSE: 'close',
    DELETE_TASK: 'deleteTask',
    NAME_TASK: 'nameTask',
    TIME_TASK: 'timeTask',
    START_TIME_DATE_PICKER: 'startTimeDatepicker',
    END_TIME_DATE_PICKER: 'endTimeDatepicker',
    INPUT_TIME_DATE_PICKER: 'inputTimeDatepicker',
    BUTTON_ADD_TIME: 'buttonAddTime',
    TIME_WRAPPER: 'timeWrapper',
    INPUT_TIME_WRAPPER: 'inputTimeWrapper',
    INPUT_TIME: 'inputTime',
    SELECT_TIME: 'selectTime',
    OPTION_TIME: 'optionTime',
    BUTTON_TODAY: 'buttonToday',
    BUTTON_SAVE: 'buttonSave',
    WRAPPER_SAVE: 'wrapperSave',

    LIST_TASK: 'listTasks',
    TASK: 'task',
    TASK_ALL_DAY: 'taskAllDay',
    VIEW_TASK: 'viewTask',

    ERROR: 'error',
    ERROR_INPUT: 'errorInput',
    ENTER_INPUT: 'enterInput',

    bootstrap: {
      BTN_SUCCESS: 'btn btn-success',
      BTN_OUTLINE_PRIMARY: 'btn btn-outline-primary',
    }
  },
  css_id: {
    MONTH: 'month',
    YEAR: 'year',
    MONTH_CALENDAR_MONTH: 'monthCalendarMonth',
    YEAR_CALENDAR_MONTH: 'yearCalendarMonth',
  },

  attribute: {
    TYPE_NUMBER: 'number',
    TYPE_DATE_PICKER: 'date_picker',
  },

  text: {
    BUTTON_TODAY: 'Today',
    BUTTON_ADD_TIME: '<span><i class="fas fa-plus"></i> Add time</span>',
    BUTTON_DELETE: '<i class="fas fa-trash-alt"></i>',
    PLACEHOLDER_NAME_TASK: 'Add name and time',
    PLACEHOLDER_NAME_TASK_WITHOUT_TIME: 'Add name',
    BUTTON_SAVE: 'Save',
    BUTTON_SAVE_ERROR_MESSAGE: 'The selected date is busy!',
    DEFAULT_ERROR_MESSAGE: 'Error!!!',
    DIALOG_NAME: 'Name',
    DIALOG_START_DATE: 'Start date',
    DIALOG_END_DATE: 'End date'
  },
  custom_event: {
    SAVE: 'save',
    DELETE: 'delete'
  }

};





