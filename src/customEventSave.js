export class CustomEventSave {
    constructor(data) {
        this.event = new CustomEvent('save', {
            detail: data
        });
    }
    callCustomEvent(elem){
        elem.dispatchEvent(this.event);
    }
}