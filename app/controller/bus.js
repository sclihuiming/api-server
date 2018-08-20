'use strict';

const Controller = require('egg').Controller;
const _ = require('lodash');
const request = require('request-promise');
const cheerio = require('cheerio');

class BusController extends Controller {
  // 取得所有的公交线路
  async searchBJBusLines() {
    const { ctx } = this;
    const options = {
      url: ctx.app.config.bus_request_path.bj_bus.bus_line,
      method: 'get',
    };
    const lines = [];
    try {
      const html = await request(options);
      const $ = cheerio.load(html);
      // 根据北京公交官网的网页结构来解析,如有变动,下面的取值也得随之改动
      const lineHtml = $('#selBLine a');
      lineHtml.each(function() {
        const line = $(this).text();
        lines.push(line);
      });
      ctx.body = {
        success: true,
        data: lines,
      };
    } catch (e) {
      ctx.body = {
        success: true,
        data: lines,
      };
    }
  }

  // 查找指定公交线路的方向(上行/下行)
  async searchBJBusDirection() {
    const { ctx } = this;
    const selBLine = ctx.request.body.selBLine || ctx.query.selBLine;

    const options = {
      url: ctx.app.config.bus_request_path.bj_bus.rtbus,
      method: 'get',
      qs: {
        act: 'getLineDir',
        selBLine,
      },
    };
    const directions = {};
    try {
      const html = await request(options);
      const $ = cheerio.load(html);
      const directionHtml = $('a');
      directionHtml.each(function() {
        const id = $(this).attr('data-uuid');
        const describe = $(this).text();
        directions[id] = describe;
      });
      ctx.body = {
        success: true,
        data: directions,
      };
    } catch (e) {
      ctx.body = {
        success: true,
        data: directions,
      };
    }
  }
  // 查询指定线路,指定方向的公交站点
  async searchBJBusStopList() {
    const { ctx } = this;
    const selBLine = ctx.request.body.selBLine || ctx.query.selBLine;
    const selBDir = ctx.request.body.selBDir || ctx.query.selBDir;

    const options = {
      url: ctx.app.config.bus_request_path.bj_bus.rtbus,
      method: 'get',
      qs: {
        act: 'getDirStation',
        selBLine,
        selBDir,
      },
    };
    const stops = {};
    try {
      const html = await request(options);
      const $ = cheerio.load(html);
      const stopHtml = $('a');
      stopHtml.each(function() {
        const seq = $(this).attr('data-seq');
        const stopName = $(this).text();
        stops[seq] = stopName;
      });
      ctx.body = {
        success: true,
        data: stops,
      };
    } catch (e) {
      ctx.body = {
        success: true,
        data: stops,
      };
    }
  }

  // 实时公交
  async seachRealTimeBus() {
    const { ctx } = this;
    const selBLine = ctx.request.body.selBLine || ctx.query.selBLine;
    const selBDir = ctx.request.body.selBDir || ctx.query.selBDir;
    const selBStop = ctx.request.body.selBStop || ctx.query.selBStop;

    const options = {
      url: ctx.app.config.bus_request_path.bj_bus.rtbus,
      method: 'get',
      qs: {
        act: 'busTime',
        selBLine,
        selBDir,
        selBStop,
      },
      json: true,
    };
    const info = {
      line: '',
      direction: '',
      stop: '',
      busInfo: '',
      detail: [],
    };
    try {
      const body = await request(options);
      // body = eval("'" + body + "'");
      // 如果有乱码,可以使用一下方式转码
      // const html = Buffer.from(body.html).toString('utf8');
      const html = body.html;
      const $ = cheerio.load(html);
      const line = $('.inquiry_header .left h3').text();
      const direction = $('.inquiry_header .inner h2').text();
      const stop = $('.inquiry_header .inner article p').first().text();
      const busInfo = $('.inquiry_header .inner article p').last().text();
      // 公交的基本信息
      info.line = line;
      info.direction = direction;
      info.stop = stop;
      info.busInfo = busInfo;

      const detail = [];
      $('#cc_stop ul li').each(function() {
        // let that = this;
        const id = $(this).children('div').attr('id'); // 公交站点的id
        let stop = $(this).children('div').children('span')
          .attr('title'); // 公交站点的名称
        const isStop = !!stop; // 是公交站点,还是途中
        let hasBus = $(this).children('div').children('i')
          .attr('clstag');// 有这个属性 代表有公交
        hasBus = !(_.isUndefined(hasBus) || _.isNull(hasBus));
        if (id.indexOf('m') > -1) { // id中有m就是2个站点的途中
          stop = '途中';
        }
        const obj = {
          id,
          stop,
          isStop,
          hasBus,
        };
        detail.push(obj);
      });
      info.detail = detail;
      const ajaxOption = {
        url: ctx.app.config.bus_request_path.bj_bus.rtbus,
        method: 'get',
        qs: {
          act: 'ajax',
        },
      };
      request(ajaxOption, () => { });
      ctx.body = {
        success: true,
        data: info,
      };

    } catch (e) {
      ctx.body = {
        success: true,
        data: info,
      };
    }
  }
}

module.exports = BusController;
