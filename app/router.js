'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  require('./router/base')(app);
  require('./router/api')(app);
};
