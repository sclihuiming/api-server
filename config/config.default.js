'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1533553553060_5537';

  // add your config here
  config.middleware = [];

  config.bus_request_path = {
    bj_bus: {
      bus_line: 'http://www.bjbus.com/home/index.php',
      rtbus: 'http://www.bjbus.com/home/ajax_rtbus_data.php',
    },
  };

  return config;
};
