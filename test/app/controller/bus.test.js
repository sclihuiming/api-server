'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const _ = require('lodash');

describe('test/app/controller/bus.test.js', () => {

  before(async () => {
    app.mockCsrf();
  });

  it('should post /bus/bj/search_bus_lines return Array of Buslist', async () => {
    app.mockCsrf();
    // app.mockContext({ user });
    const res = await app.httpRequest()
      .post('/api/v1/bus/bj/search_bus_lines')
      .type('form')
      .send({});
    assert(res.status === 200);
    // assert(res.headers.location === '/api/v1/bus/bj/search_bus_lines');
    // console.log(res.body);
    assert(_.size(res.body.data) > 0);
  });

  it('should post /bus/bj/search_bus_direction return object of bus_direction', async () => {
    app.mockCsrf();
    const res = await app.httpRequest()
      .post('/api/v1/bus/bj/search_bus_direction')
      .type('form')
      .send({ selBLine: 996 });
    assert(res.status === 200);
    assert(_.size(res.body.data) > 0);
  });

  it('should post /bus/bj/search_bus_direction return Object no elem', async () => {
    app.mockCsrf();
    let res = await app.httpRequest()
      .post('/api/v1/bus/bj/search_bus_direction')
      .type('form')
      .send({ selBLine: 100000 });
    assert(res.status === 200);
    assert(_.size(res.body.data) === 0);

    res = await app.httpRequest()
      .post('/api/v1/bus/bj/search_bus_direction')
      .type('form')
      .send({});
    assert(res.status === 200);
    assert(_.size(res.body.data) === 0);
  });

  it('should post /bus/bj/search_bus_stops return array', async () => {
    app.mockCsrf();
    const res = await app.httpRequest()
      .post('/api/v1/bus/bj/search_bus_direction')
      .type('form')
      .send({ selBLine: 996 });
    assert(res.status === 200);

    assert(_.size(res.body.data) > 0);
    const keys = _.keys(res.body.data);

    const res1 = await app.httpRequest()
      .post('/api/v1/bus/bj/search_bus_stops')
      .type('form')
      .send({ selBLine: 996, selBDir: keys[0] });
    assert(res1.status === 200);
    assert(_.size(res1.body.data) > 0);
  });

  it('should post /bus/bj/search_bus_stops return no elem', async () => {
    app.mockCsrf();
    const res = await app.httpRequest()
      .post('/api/v1/bus/bj/search_bus_direction')
      .type('form')
      .send({ selBLine: 996 });
    assert(res.status === 200);
    assert(_.size(res.body.data) > 0);
    const keys = _.keys(res.body.data);

    let res1 = await app.httpRequest()
      .post('/api/v1/bus/bj/search_bus_stops')
      .type('form')
      .send({ selBLine: 996, selBDir: '234234234' });
    assert(res1.status === 200);
    assert(_.size(res1.body.data) === 0);

    res1 = await app.httpRequest()
      .post('/api/v1/bus/bj/search_bus_stops')
      .type('form')
      .send({ selBLine: 996, selBDir: keys[0] + '111' });
    assert(res1.status === 200);
    assert(_.size(res1.body.data) === 0);

    res1 = await app.httpRequest()
      .post('/api/v1/bus/bj/search_bus_stops')
      .type('form')
      .send({});
    assert(res1.status === 200);
    assert(_.size(res1.body.data) === 0);

    res1 = await app.httpRequest()
      .post('/api/v1/bus/bj/search_bus_stops')
      .type('form')
      .send({ selBLine: 10, selBDir: keys[0] + '11' });
    assert(res1.status === 200);
    assert(_.size(res1.body.data) === 0);

    res1 = await app.httpRequest()
      .post('/api/v1/bus/bj/search_bus_stops')
      .type('form')
      .send({});
    assert(res1.status === 200);
    assert(_.size(res1.body.data) === 0);
  });

  it('should post /bus/bj/search_rt_bus return Obejct', async () => {
    app.mockCsrf();
    const res = await app.httpRequest()
      .post('/api/v1/bus/bj/search_bus_direction')
      .type('form')
      .send({ selBLine: 996 });
    assert(res.status === 200);
    assert(_.size(res.body.data) > 0);
    const keys = _.keys(res.body.data);

    const res1 = await app.httpRequest()
      .post('/api/v1/bus/bj/search_bus_stops')
      .type('form')
      .send({ selBLine: 996, selBDir: keys[0] });
    assert(res1.status === 200);
    assert(_.size(res1.body.data) > 0);

    const stopKeys = _.keys(res1.body.data);

    const res2 = await app.httpRequest()
      .post('/api/v1/bus/bj/search_rt_bus')
      .type('form')
      .send({ selBLine: 996, selBDir: keys[0], selBStop: stopKeys[8] });
    assert(res2.status === 200);
    console.log(res2.body.data);
    assert(_.size(res2.body.data.detail) > 0);
  });

  it('should post /bus/bj/search_rt_bus return Obejct no elem', async () => {
    app.mockCsrf();
    const res = await app.httpRequest()
      .post('/api/v1/bus/bj/search_bus_direction')
      .type('form')
      .send({ selBLine: 996 });
    assert(res.status === 200);
    assert(_.size(res.body.data) > 0);
    const keys = _.keys(res.body.data);
    const res1 = await app.httpRequest()
      .post('/api/v1/bus/bj/search_bus_stops')
      .type('form')
      .send({ selBLine: 996, selBDir: keys[0] });
    assert(res1.status === 200);
    assert(_.size(res1.body.data) > 0);
    const stopKeys = _.keys(res1.body.data);

    let res2 = await app.httpRequest()
      .post('/api/v1/bus/bj/search_rt_bus')
      .type('form')
      .send({ selBLine: 999, selBDir: keys[0] + '1222', selBStop: stopKeys[8] + '111' });
    assert(res2.status === 200);
    assert(_.size(res2.body.data.detail) === 0);

    res2 = await app.httpRequest()
      .post('/api/v1/bus/bj/search_rt_bus')
      .type('form')
      .send({ selBLine: 996, selBDir: keys[0] + '1111', selBStop: stopKeys[8] + '111' });
    assert(res2.status === 200);
    assert(_.size(res2.body.data.detail) === 0);

    res2 = await app.httpRequest()
      .post('/api/v1/bus/bj/search_rt_bus')
      .type('form')
      .send({ selBLine: 999, selBDir: keys[0] + '1111', selBStop: stopKeys[8] + '111' });
    assert(res2.status === 200);
    assert(_.size(res2.body.data.detail) === 0);


    res2 = await app.httpRequest()
      .post('/api/v1/bus/bj/search_rt_bus')
      .type('form')
      .send({ selBLine: 996, selBDir: keys[0] });
    assert(res2.status === 200);
    assert(_.size(res2.body.data.detail) === 0);


    res2 = await app.httpRequest()
      .post('/api/v1/bus/bj/search_rt_bus')
      .type('form')
      .send({ selBLine: 996, selBStop: stopKeys[8] });
    assert(res2.status === 200);
    assert(_.size(res2.body.data.detail) === 0);

    res2 = await app.httpRequest()
      .post('/api/v1/bus/bj/search_rt_bus')
      .type('form')
      .send({ selBDir: keys[0], selBStop: stopKeys[8] });
    assert(res2.status === 200);
    assert(_.size(res2.body.data.detail) === 0);

    res2 = await app.httpRequest()
      .post('/api/v1/bus/bj/search_rt_bus')
      .type('form')
      .send({ selBLine: 999, selBDir: keys[0] });
    assert(res2.status === 200);
    assert(_.size(res2.body.data.detail) === 0);

    res2 = await app.httpRequest()
      .post('/api/v1/bus/bj/search_rt_bus')
      .type('form')
      .send({ selBStop: stopKeys[8] });
    assert(res2.status === 200);
    assert(_.size(res2.body.data.detail) === 0);

    res2 = await app.httpRequest()
      .post('/api/v1/bus/bj/search_rt_bus')
      .type('form')
      .send({});
    assert(res2.status === 200);
    assert(_.size(res2.body.data.detail) === 0);
  });

});
