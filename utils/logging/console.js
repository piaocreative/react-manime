
//const colors = require('./colors.js')


function noop(){}
const logs = {

    fatal: process.browser  ? (input, extra)  => console.error(`fatal: ${input}`) : noop,
    error: process.browser  ? (input, extra)  => console.error(`error: ${input}`) : noop,
    warn: process.browser ? (input, extra)  => console.warn(`warn: ${input}`) : noop,
    info: process.browser  ? (input, extra) => console.info(`info: ${input}`) : noop,
    http: process.browser? (input, extra)  => console.debug(`http: ${input}`) : noop,
    verbose : process.browser ? (input, extra)  => console.debug(`verbose: ${input}`) : noop,
}

module.exports = logs