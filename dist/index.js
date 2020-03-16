"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.STATUS_MONITOR_ID = exports.SLACK_BOT_ID = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _constants = require("constants");

var _webApi = require("@slack/web-api");

var _memberUtils = require("./memberUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

require('dotenv').config();

var PORT = process.env.PORT || 3000;
var token = process.env.SLACK_TOKEN;
var secret = process.env.SLACK_SIGNING_SECRET;

var _require = require('@slack/bolt'),
    App = _require.App; // Initializes the app with your bot token and signing secret


var app = new App({
  token: token,
  signingSecret: secret
});
var SLACK_BOT_ID = 'USLACKBOT';
exports.SLACK_BOT_ID = SLACK_BOT_ID;
var STATUS_MONITOR_ID = 'U0100M7B8FJ';
exports.STATUS_MONITOR_ID = STATUS_MONITOR_ID;
app.event('user_change', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref2) {
    var event, context, _ref3, members, filteredMembersIds, membersPresence, statusBlocks, result;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            event = _ref2.event, context = _ref2.context;
            _context3.prev = 1;
            _context3.next = 4;
            return app.client.users.list({
              token: token
            });

          case 4:
            _ref3 = _context3.sent;
            members = _ref3.members;
            filteredMembersIds = (0, _memberUtils.getMembersIds)(members);
            membersPresence = filteredMembersIds.map( /*#__PURE__*/function () {
              var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(user) {
                var _ref5, presence;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return app.client.users.getPresence({
                          token: token,
                          user: user
                        });

                      case 2:
                        _ref5 = _context.sent;
                        presence = _ref5.presence;
                        return _context.abrupt("return", presence);

                      case 5:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              }));

              return function (_x2) {
                return _ref4.apply(this, arguments);
              };
            }());
            _context3.next = 10;
            return Promise.all(membersPresence).then( /*#__PURE__*/function () {
              var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(values) {
                var membersInfo;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return (0, _memberUtils.getMembersInfo)(members, values);

                      case 2:
                        membersInfo = _context2.sent;
                        return _context2.abrupt("return", membersInfo);

                      case 4:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, this);
              }));

              return function (_x3) {
                return _ref6.apply(this, arguments);
              };
            }());

          case 10:
            statusBlocks = _context3.sent;
            _context3.next = 13;
            return app.client.views.publish({
              /* retrieves your xoxb token from context */
              token: context.botToken,

              /* the user that opened your app's app home */
              user_id: event.user.id,

              /* the view payload that appears in the app home*/
              view: {
                type: 'home',
                callback_id: 'home_view',

                /* body of the view */
                blocks: [{
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "Hi there! Below you'll find the status of all the members in our workspace."
                  }
                }, {
                  "type": "divider"
                }].concat(_toConsumableArray(statusBlocks))
              }
            });

          case 13:
            result = _context3.sent;
            _context3.next = 19;
            break;

          case 16:
            _context3.prev = 16;
            _context3.t0 = _context3["catch"](1);
            console.error(_context3.t0);

          case 19:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this, [[1, 16]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());

_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
  return regeneratorRuntime.wrap(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return app.start(PORT || 3000);

        case 2:
          console.log('⚡️ Bolt app is running!');

        case 3:
        case "end":
          return _context4.stop();
      }
    }
  }, _callee4, this);
}))();