"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMembersInfo = exports.getMembersIds = void 0;

var _index = require("./index");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getMembersIds = function getMembersIds(members) {
  // Filter out Slackbot and this app's bot
  var filteredMembers = members.filter(function (member) {
    return !member.is_bot && member.id !== _index.SLACK_BOT_ID;
  });
  var membersIds = filteredMembers.map(function (member) {
    return member.id;
  });
  return membersIds;
};

exports.getMembersIds = getMembersIds;

var getMembersInfo = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(members, membersPresence) {
    var filteredMembers, membersInfo;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // Filter out Slackbot and this app's bot
            filteredMembers = members.filter(function (member) {
              return !member.is_bot && member.id !== _index.SLACK_BOT_ID;
            }); // Create a list of sections (one for each user)

            membersInfo = filteredMembers.map(function (member, index) {
              var id = member.id;
              var status_text = member.profile.status_text;
              var status_emoji = member.profile.status_emoji;
              var status_expiration = member.profile.status_expiration;
              var indicator = ':empty-dot:';
              if (membersPresence[index] == 'active') indicator = ':green-dot:'; // Construct return string

              var return_string = indicator + " <@".concat(id, ">\n>"); // Check if a user has a status

              if (status_emoji && status_emoji != ':speech_balloon:') return_string = return_string + "".concat(status_emoji, " ");

              if (status_text) {
                return_string = return_string + "*".concat(status_text, "*");
              } // Check if a user intentionally set a status expiration (not the default)


              if (status_expiration) {
                var exp_time = new Date(status_expiration * 1000);
                var hours = exp_time.getHours();
                var minutes = exp_time.getMinutes();

                if (hours != '23' && minutes != '59') {
                  return_string = return_string + "\n><!date^".concat(status_expiration, "^Until {time}|until 11:59 PM>");
                }
              }

              return_string = return_string + "\n"; // Format the return section object

              var return_section = {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "".concat(return_string)
                }
              }; // console.log(result)

              return return_section;
            });
            return _context.abrupt("return", membersInfo);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getMembersInfo(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.getMembersInfo = getMembersInfo;