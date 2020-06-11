/**
 * Register an log
 * @param m
 * @param level 0 = Simple. For Dev env | 1 = Important. For Any Env
 */
const log = (env) => {
  return function (m, level) {
    level = typeof level !== 'undefined' ? level : 0;
    if (env === 'production' && level === 0) return;
    console.log(m);
    /*if (arguments.length > 2) { // Disable it to all extra arguments send to log
      for (var i = 0; i < arguments.length; i++) {
        if (i > 1) {
          console.log(arguments[i])
        }
      }
    }*/
  }
}

module.exports = log
