class BasicEmitter {
    constructor() {
        this._listeners = {}; // {eventName: [listener, ..]}
        this.garbage = 'howdy';

        // this.fire = this.fire.bind(this);
    }

    addEventListener(eventName, listener) {
        // Register a listener for eventName.
        if(!this._listeners.hasOwnProperty(eventName)) {
            this._listeners[eventName] = []
        }
        this._listeners[eventName].push(listener);
    }

    removeEventListener(eventName, listener) {
        // Remove the last occurrence of listener from listeners to eventName.
        if(this._listeners.hasOwnProperty(eventName)) {
            let index = this._listeners[eventName].lastIndexOf(listener);
            if(index != -1) {
                this._listeners[eventName].splice(index, 1);
            }
        }
    }

    /** Trigger listeners to eventName and pass key details.
     * @param {string} eventName 
     * @param {*} args 
     * @return {array} responses from all listeners.
     */
    fire(eventName, ...args) {
        let details = {
            context: this,
            eventName,
            args
        };

        let responses = [];

        if(this._listeners.hasOwnProperty(eventName)) {
            for(let listener of this._listeners[eventName]) {
                responses.push(listener(details));
            }
        }

        return responses;
    }
}

module.exports = {
    BasicEmitter
};