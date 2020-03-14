"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _webApi = require("@slack/web-api");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var PORT = process.env.PORT || 5000;
var token = process.env.SLACK_TOKEN;
var web = new _webApi.WebClient(token);
var botName = 'vantalunch';
var botId = 'UK9BK01V1';
var app = (0, _express["default"])();
app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: false
}));
app.get('/', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            res.status(200).send("Slack status bot");

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
app.post('/statusbot', /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var slackReqObj, challengeData, channelId, _ref3, members, channelInfo, memberIdsInChannel;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            slackReqObj = req.body;
            console.log(slackReqObj);

            if ('challenge' in slackReqObj) {
              challengeData = {
                challenge: slackReqObj.challenge
              };
              res.json(data);
            }

            channelId = slackReqObj.channel_id;
            _context2.next = 7;
            return web.users.list({
              token: token
            });

          case 7:
            _ref3 = _context2.sent;
            members = _ref3.members;
            _context2.next = 11;
            return web.channels.info({
              token: token,
              channel: channelId
            });

          case 11:
            channelInfo = _context2.sent;
            memberIdsInChannel = channelInfo.channel.members;
            res.json(response);
            _context2.next = 20;
            break;

          case 16:
            _context2.prev = 16;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);
            return _context2.abrupt("return", res.status(500).send('Something blew up. We\'re looking into it.'));

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 16]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());