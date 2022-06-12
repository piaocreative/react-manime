const chalk = require('chalk');
const ctx = new chalk.Instance({level: 3});

let info = ctx.cyan
let error = ctx.red
let warning = ctx.yellow
let verbose = ctx.magenta
let http = ctx.green
module.exports = {
    info, error, warning, verbose, http
}