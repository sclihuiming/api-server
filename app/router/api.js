'use strict';

module.exports = app => {
  const apiV1Router = app.router.namespace('/api/v1');
  const { controller } = app;
  const { bus } = controller;

  apiV1Router.post('/bus/bj/search_bus_lines', bus.searchBJBusLines);
  apiV1Router.post('/bus/bj/search_bus_direction', bus.searchBJBusDirection);
  apiV1Router.post('/bus/bj/search_bus_stops', bus.searchBJBusStopList);
  apiV1Router.post('/bus/bj/search_rt_bus', bus.seachRealTimeBus);

};
