const BasicEmitter = require('./emitter').BasicEmitter;
const wrappers = require('./wrappers');

module.exports = {
    BasicEmitter,
    before: wrappers.before,
    should: wrappers.should,
    after: wrappers.after
};