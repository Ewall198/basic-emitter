const lib = require('./index.js');
const BasicEmitter = lib.BasicEmitter;
const before = lib.before;
const should = lib.should;
const after = lib.after;

class TestEmitter extends BasicEmitter {
    
    // @should('Test')
    // @before('Test')
    // @after('Test')
    // testFunc(val) {
    //     return val;
    // }

    @should('Test')
    testShouldFunc(val) {
        return val;
    }

    @after('Test')
    testAfterFunc(val) {
        return val;
    }

    @before('Test')
    testBeforeFunc(val) {
        return val;
    }
}

test('fire and subscription works', () => {
    const testEmitter = new TestEmitter();
    let success = false;
    const listener = (details) => {
        if( details.context === testEmitter &&
            details.eventName === 'test') {
                success = true;
        }
    }
    testEmitter.addEventListener('test', listener);
    let result = testEmitter.fire('test');
    testEmitter.removeEventListener('test', listener);
    expect(success).toBe(true);
});

test('basic function call works', () => {
    const testEmitter = new TestEmitter();
    expect(testEmitter.testBeforeFunc('Hello World')).toBe('Hello World');
});

test('before wrapper works', (done) => {
    const testEmitter = new TestEmitter();
    const listener = (details) => {
        expect(details.context).toBe(testEmitter);
        expect(details.eventName).toBe('beforeTest');
        expect(details.args).toEqual(['Hello World']);
        done();
    }
    testEmitter.addEventListener('beforeTest', listener);
    testEmitter.testBeforeFunc('Hello World');
});

test('after wrapper works', (done) => {
    const testEmitter = new TestEmitter();
    let result = {};
    const listener = (details) => {
        result = details;
        expect(result.context).toBe(testEmitter);
        expect(result.eventName).toBe('afterTest');
        expect(result.args).toEqual(['Hello World']);
        done();
    }
    testEmitter.addEventListener('afterTest', listener);
    testEmitter.testAfterFunc('Hello World');
});

test('should call func wrapper works', () => {
    const testEmitter = new TestEmitter();
    let listenerDetails = {};
    const listener = (details) => {
        listenerDetails = details;
        return true;
    }
    testEmitter.addEventListener('shouldTest', listener);
    let result = testEmitter.testShouldFunc('Hello World');
    expect(listenerDetails.context).toBe(testEmitter);
    expect(listenerDetails.eventName).toBe('shouldTest');
    expect(listenerDetails.args).toEqual(['Hello World']);
    expect(result).toBe('Hello World');
});


test('should cancel func wrapper works', () => {
    const testEmitter = new TestEmitter();
    let listenerDetails = {};
    const listener = (details) => {
        listenerDetails = details;
        return false;
    }
    testEmitter.addEventListener('shouldTest', listener);
    let result = testEmitter.testShouldFunc('Hello World');
    expect(listenerDetails.context).toBe(testEmitter);
    expect(listenerDetails.eventName).toBe('shouldTest');
    expect(listenerDetails.args).toEqual(['Hello World']);
    expect(result).toBe(undefined);
});

const emitter = new TestEmitter();
console.log({emitter})