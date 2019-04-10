'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _chromedriver = require('chromedriver');

var _chromedriver2 = _interopRequireDefault(_chromedriver);

var _seleniumWebdriver = require('selenium-webdriver');

var _seleniumWebdriver2 = _interopRequireDefault(_seleniumWebdriver);

var _tcpPortUsed = require('tcp-port-used');

var _tcpPortUsed2 = _interopRequireDefault(_tcpPortUsed);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('selenium-webdriver'),
    Builder = _require.Builder,
    By = _require.By,
    Key = _require.Key,
    until = _require.until,
    WebDriver = _require.WebDriver;

var Http = require('selenium-webdriver/http');
var driver = void 0,
    t = void 0;
var executor = void 0,
    sessionID = void 0;

var modifierKeys = [Key.CTRL, Key.ALT, Key.SHIFT, Key.META];
var keyPrintMap = new Map();
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = Array.from('~!@#$%^&*()_+|}{POIUYTREWQASDFGHJKL:"?><MNBVCXZ"}' + "`1234567890-=\\][poiuytrewqasdfghjkl;'/.,mnbvcxz'")[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var each = _step.value;

    keyPrintMap.set(each, each);
  }
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator.return) {
      _iterator.return();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}

var specialKeys = {};

var Tester = function () {
  function Tester(_ref) {
    var name = _ref.name,
        driver = _ref.driver,
        rootSelector = _ref.rootSelector,
        commentSelector = _ref.commentSelector,
        keySelector = _ref.keySelector,
        parent = _ref.parent;

    _classCallCheck(this, Tester);

    if (typeof rootSelector !== 'string') throw Error('root selector must be a string');
    this.parent = parent;
    this.parent.tasks[name] = this;
    this.name = name;
    this.driver = driver;
    this.d = this.driver;
    this.rootSelector = rootSelector;
    var root = driver.findElement(By.css(rootSelector));
    this.root = root;
    this.r = root;
    this.commentSelector = commentSelector || 'span.selenium-comment';
    this.keySelector = keySelector || 'span.selenium-key';
    this.running = true;
    var template = '\n      if (!window.seleniumRoot) {\n        window.seleniumRoot = new Map()\n        window.seleniumComment = new Map()\n        window.seleniumKey = new Map()\n      }\n      let root = document.querySelector("' + this.rootSelector + '")\n      if (!root) { throw Error(`no root element found with css(' + this.rootSelector + ')`) }\n      window.seleniumRoot.set("' + this.name + '", root)\n      let comment = root.querySelector("' + this.commentSelector + '")\n      if (!comment) { throw Error(`no comment element found with css(' + this.commentSelector + ')`) }\n      window.seleniumComment.set("' + this.name + '", comment)\n      let key = root.querySelector("' + this.keySelector + '")\n      if (!key) { throw Error(`no key element found with css(' + this.commentSelector + ')`) }\n      window.seleniumKey.set("' + this.name + '", key)\n    ';
    var result = this.driver.executeScript(template);
  }

  _createClass(Tester, [{
    key: 'setRunning',
    value: function setRunning(bool) {
      this.running = bool;
    }
  }, {
    key: 'sendKeys',
    value: async function sendKeys(_ref2) {
      var keys = _ref2.keys,
          interval = _ref2.interval,
          delay = _ref2.delay;

      if (!Array.isArray(keys)) {
        keys = Array.from(keys);
      }
      if (delay) {
        await this.driver.sleep(delay);
      }
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var each = _step2.value;

          if (!this.running) {
            this.changeComment('', null, each);
            throw Error('Stop in sendKeys at sending:', each);
          }
          var actions = this.driver.actions();
          if (Array.isArray(each)) {
            var reversed = [];
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = each[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var eacheach = _step3.value;

                if (modifierKeys.includes(eacheach)) {
                  actions = actions.keyDown(eacheach);
                  reversed.push(eacheach);
                } else {
                  actions = actions.sendKeys(eacheach);
                }
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = reversed.reverse()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var _eacheach = _step4.value;

                actions = actions.keyUp(_eacheach);
              }
            } catch (err) {
              _didIteratorError4 = true;
              _iteratorError4 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                  _iterator4.return();
                }
              } finally {
                if (_didIteratorError4) {
                  throw _iteratorError4;
                }
              }
            }

            await actions.perform();
          } else {
            await actions.sendKeys(each).perform();
          }
          if (interval) {
            await this.driver.sleep(interval);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: 'changeComment',
    value: async function changeComment(comment, delay, stopMessage) {
      var stop = void 0;
      var raw_comment = comment;
      if (!stopMessage && !this.running) {
        comment = '';
        stop = true;
      }
      if (!comment) {
        this.running = false;
      }
      var template = '\n      window.seleniumComment.get("' + this.name + '").textContent = `' + comment + '`\n    ';
      var result = this.driver.executeScript(template);
      if (stop) {
        throw Error('Stop in comment with comment:', raw_comment);
      }
      if (delay) {
        await this.driver.sleep(delay);
      }
    }
  }, {
    key: 'changeKey',
    value: async function changeKey(key) {
      var template = '\n      window.seleniumKey.get("' + this.name + '").textContent = `' + key + '`\n    ';
      var result = this.driver.executeScript(template);
    }
  }]);

  return Tester;
}();

var SeleniumTest = function () {
  function SeleniumTest(_ref3) {
    var options = _ref3.options,
        tests = _ref3.tests;

    _classCallCheck(this, SeleniumTest);

    this.tests = tests;
    var defaultOptions = {};
    this.options = Object.assign(defaultOptions, options);
    this.tasks = {};
  }

  _createClass(SeleniumTest, [{
    key: 'apply',
    value: function apply(compiler) {
      var options = this.options;
      compiler.plugin("compilation", function (compilation) {
        //console.log("Pre build...");
      });
      compiler.plugin("emit", function (compilation, callback) {
        callback();
        setTimeout(function () {
          this.init();
        }, 2000);
      });
    }
  }, {
    key: 'init',
    value: async function init() {
      console.log('init backend of vue-selenium-unittest');
      var options = this.options;
      await this.openChrome('http://localhost:' + options.appPort);
      await this.createHttpServer(options.seleniumPort);
    }
  }, {
    key: 'openChrome',
    value: async function openChrome(url) {
      var browser = 'chrome';
      if (sessionID) {
        this.driver = await new WebDriver(sessionID, executor);
      } else {
        this.driver = await new Builder().forBrowser(browser).build();
        sessionID = await this.driver.getSession();
        sessionID = sessionID.id_;
        executor = await this.driver.getExecutor();
      }
      await this.driver.get(url);
      return this.driver;
    }
  }, {
    key: 'block',
    value: function block(_ref4) {
      var name = _ref4.name,
          rootSelector = _ref4.rootSelector,
          commentSelector = _ref4.commentSelector,
          keySelector = _ref4.keySelector;

      return new Tester({
        name: name, rootSelector: rootSelector, commentSelector: commentSelector, keySelector: keySelector,
        driver: this.driver,
        parent: this
      });
    }
  }, {
    key: 'response',
    value: async function response(_ref5) {
      var _this = this;

      var req = _ref5.req,
          res = _ref5.res;

      res.writeHead(200, {
        'Content-Type': 'text/json',
        'Access-Control-Allow-Origin': '*',
        "Access-Control-Allow-Headers": "Authorization,Origin, X-Requested-With, Content-Type, Accept",
        "Access-Control-Allow-Methods": "GET,POST"
      });
      if (req.method === 'POST') {
        var body = '';
        req.on('data', function (data) {
          body += data;
          // Too much POST data, kill the connection!
          // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
          if (body.length > 1e6) request.connection.destroy();
        });
        req.on('end', function () {
          var data = JSON.parse(body);
          if (!data.name) throw Error('shoud give name');
          var name = data.name;
          res.write(JSON.stringify({ ok: true, data: name }));
          res.end();
          console.log('start test:', name);
          if (!_this.tests[name]) {
            console.log(_this.tests);
            throw Error('no test named', name);
          }
          if (!(_this.tasks[name] && _this.tasks[name].running)) {
            _this.tests[name]({
              name: name,
              Key: Key,
              By: By,
              until: until,
              driver: _this.driver,
              Test: _this
            }).then(function () {
              console.log('finish test:', name);
            }).catch(function (error) {
              if (!error.message.startsWith('Stop')) throw error;
            });
          } else {
            console.log('stop test:', name);
            _this.tasks[name].setRunning(false);
          }
        });
      } else {
        res.write(JSON.stringify({ ok: false }));
        res.end();
      }
    }
  }, {
    key: 'createHttpServer',
    value: async function createHttpServer(port) {
      var _this2 = this;

      var portUsed = await _tcpPortUsed2.default.check(port, 'localhost');
      if (!portUsed) {
        var server = _http2.default.createServer(function (req, res) {
          _this2.response({ req: req, res: res });
        }).listen(port);
        return server;
        console.log('\tcreate new debug http server at', 'http://localhost:' + port);
      } else {
        console.log('\treuse old debug http server:', 'http://localhost:' + port);
      }
    }
  }]);

  return SeleniumTest;
}();

exports.default = SeleniumTest;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBWix3QkFBcUUsSUFBckU7QUFDRCxPQU5ELE1BTU87QUFDTCxnQkFBUSxHQUFSLENBQVksZ0NBQVosd0JBQWtFLElBQWxFO0FBQ0Q7QUFDRjs7Ozs7O2tCQUVZLFkiLCJmaWxlIjoiYmFja2VuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBodHRwIGZyb20gJ2h0dHAnXG5pbXBvcnQgY2hyb21lZHJpdmVyIGZyb20gJ2Nocm9tZWRyaXZlcidcbmltcG9ydCB3ZWJkcml2ZXIgZnJvbSAnc2VsZW5pdW0td2ViZHJpdmVyJ1xuaW1wb3J0IHRjcFBvcnRVc2VkIGZyb20gJ3RjcC1wb3J0LXVzZWQnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IG9zIGZyb20gJ29zJ1xuY29uc3Qge0J1aWxkZXIsIEJ5LCBLZXksIHVudGlsLCBXZWJEcml2ZXJ9ID0gcmVxdWlyZSgnc2VsZW5pdW0td2ViZHJpdmVyJylcbmNvbnN0IEh0dHAgPSByZXF1aXJlKCdzZWxlbml1bS13ZWJkcml2ZXIvaHR0cCcpXG5sZXQgZHJpdmVyLCB0XG5sZXQgZXhlY3V0b3IsIHNlc3Npb25JRFxuXG5jb25zdCBtb2RpZmllcktleXMgPSBbXG4gIEtleS5DVFJMLFxuICBLZXkuQUxULFxuICBLZXkuU0hJRlQsXG4gIEtleS5NRVRBLFxuXVxubGV0IGtleVByaW50TWFwID0gbmV3IE1hcCgpXG5mb3IgKGxldCBlYWNoIG9mIEFycmF5LmZyb20oJ34hQCMkJV4mKigpXyt8fXtQT0lVWVRSRVdRQVNERkdISktMOlwiPz48TU5CVkNYWlwifScrXCJgMTIzNDU2Nzg5MC09XFxcXF1bcG9pdXl0cmV3cWFzZGZnaGprbDsnLy4sbW5idmN4eidcIikpIHtcbiAga2V5UHJpbnRNYXAuc2V0KGVhY2gsIGVhY2gpXG59XG5sZXQgc3BlY2lhbEtleXMgPSB7XG5cbn1cbmNsYXNzIFRlc3RlciB7XG4gIGNvbnN0cnVjdG9yICh7bmFtZSwgZHJpdmVyLCByb290U2VsZWN0b3IsIGNvbW1lbnRTZWxlY3Rvciwga2V5U2VsZWN0b3IsIHBhcmVudH0pIHtcbiAgICBpZiAodHlwZW9mKHJvb3RTZWxlY3RvcikhPT0nc3RyaW5nJykgdGhyb3cgRXJyb3IoJ3Jvb3Qgc2VsZWN0b3IgbXVzdCBiZSBhIHN0cmluZycpXG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnRcbiAgICB0aGlzLnBhcmVudC50YXNrc1tuYW1lXSA9IHRoaXNcbiAgICB0aGlzLm5hbWUgPSBuYW1lXG4gICAgdGhpcy5kcml2ZXIgPSBkcml2ZXJcbiAgICB0aGlzLmQgPSB0aGlzLmRyaXZlclxuICAgIHRoaXMucm9vdFNlbGVjdG9yID0gcm9vdFNlbGVjdG9yXG4gICAgbGV0IHJvb3QgPSBkcml2ZXIuZmluZEVsZW1lbnQoQnkuY3NzKHJvb3RTZWxlY3RvcikpXG4gICAgdGhpcy5yb290ID0gcm9vdFxuICAgIHRoaXMuciA9IHJvb3RcbiAgICB0aGlzLmNvbW1lbnRTZWxlY3RvciA9IGNvbW1lbnRTZWxlY3RvciB8fCAnc3Bhbi5zZWxlbml1bS1jb21tZW50J1xuICAgIHRoaXMua2V5U2VsZWN0b3IgPSBrZXlTZWxlY3RvciB8fCAnc3Bhbi5zZWxlbml1bS1rZXknXG4gICAgdGhpcy5ydW5uaW5nID0gdHJ1ZVxuICAgIGxldCB0ZW1wbGF0ZT1gXG4gICAgICBpZiAoIXdpbmRvdy5zZWxlbml1bVJvb3QpIHtcbiAgICAgICAgd2luZG93LnNlbGVuaXVtUm9vdCA9IG5ldyBNYXAoKVxuICAgICAgICB3aW5kb3cuc2VsZW5pdW1Db21tZW50ID0gbmV3IE1hcCgpXG4gICAgICAgIHdpbmRvdy5zZWxlbml1bUtleSA9IG5ldyBNYXAoKVxuICAgICAgfVxuICAgICAgbGV0IHJvb3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiJHt0aGlzLnJvb3RTZWxlY3Rvcn1cIilcbiAgICAgIGlmICghcm9vdCkgeyB0aHJvdyBFcnJvcihcXGBubyByb290IGVsZW1lbnQgZm91bmQgd2l0aCBjc3MoJHt0aGlzLnJvb3RTZWxlY3Rvcn0pXFxgKSB9XG4gICAgICB3aW5kb3cuc2VsZW5pdW1Sb290LnNldChcIiR7dGhpcy5uYW1lfVwiLCByb290KVxuICAgICAgbGV0IGNvbW1lbnQgPSByb290LnF1ZXJ5U2VsZWN0b3IoXCIke3RoaXMuY29tbWVudFNlbGVjdG9yfVwiKVxuICAgICAgaWYgKCFjb21tZW50KSB7IHRocm93IEVycm9yKFxcYG5vIGNvbW1lbnQgZWxlbWVudCBmb3VuZCB3aXRoIGNzcygke3RoaXMuY29tbWVudFNlbGVjdG9yfSlcXGApIH1cbiAgICAgIHdpbmRvdy5zZWxlbml1bUNvbW1lbnQuc2V0KFwiJHt0aGlzLm5hbWV9XCIsIGNvbW1lbnQpXG4gICAgICBsZXQga2V5ID0gcm9vdC5xdWVyeVNlbGVjdG9yKFwiJHt0aGlzLmtleVNlbGVjdG9yfVwiKVxuICAgICAgaWYgKCFrZXkpIHsgdGhyb3cgRXJyb3IoXFxgbm8ga2V5IGVsZW1lbnQgZm91bmQgd2l0aCBjc3MoJHt0aGlzLmNvbW1lbnRTZWxlY3Rvcn0pXFxgKSB9XG4gICAgICB3aW5kb3cuc2VsZW5pdW1LZXkuc2V0KFwiJHt0aGlzLm5hbWV9XCIsIGtleSlcbiAgICBgXG4gICAgbGV0IHJlc3VsdCA9IHRoaXMuZHJpdmVyLmV4ZWN1dGVTY3JpcHQodGVtcGxhdGUpXG4gIH1cbiAgc2V0UnVubmluZyAoYm9vbCkge1xuICAgIHRoaXMucnVubmluZyA9IGJvb2xcbiAgfVxuICBhc3luYyBzZW5kS2V5cyh7a2V5cywgaW50ZXJ2YWwsIGRlbGF5fSkge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShrZXlzKSkge1xuICAgICAga2V5cyA9IEFycmF5LmZyb20oa2V5cylcbiAgICB9XG4gICAgaWYgKGRlbGF5KXtcbiAgICAgIGF3YWl0IHRoaXMuZHJpdmVyLnNsZWVwKGRlbGF5KVxuICAgIH1cbiAgICBmb3IgKGxldCBlYWNoIG9mIGtleXMpIHtcbiAgICAgIGlmICghdGhpcy5ydW5uaW5nKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlQ29tbWVudCgnJywgbnVsbCwgZWFjaClcbiAgICAgICAgdGhyb3cgRXJyb3IoJ1N0b3AgaW4gc2VuZEtleXMgYXQgc2VuZGluZzonLCBlYWNoKVxuICAgICAgfVxuICAgICAgbGV0IGFjdGlvbnMgPSB0aGlzLmRyaXZlci5hY3Rpb25zKClcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGVhY2gpKSB7XG4gICAgICAgIGxldCByZXZlcnNlZCA9IFtdXG4gICAgICAgIGZvciAobGV0IGVhY2hlYWNoIG9mIGVhY2gpIHtcbiAgICAgICAgICBpZiAobW9kaWZpZXJLZXlzLmluY2x1ZGVzKGVhY2hlYWNoKSkge1xuICAgICAgICAgICAgYWN0aW9ucyA9IGFjdGlvbnMua2V5RG93bihlYWNoZWFjaClcbiAgICAgICAgICAgIHJldmVyc2VkLnB1c2goZWFjaGVhY2gpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFjdGlvbnMgPSBhY3Rpb25zLnNlbmRLZXlzKGVhY2hlYWNoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBlYWNoZWFjaCBvZiByZXZlcnNlZC5yZXZlcnNlKCkpIHtcbiAgICAgICAgICBhY3Rpb25zID0gYWN0aW9ucy5rZXlVcChlYWNoZWFjaClcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBhY3Rpb25zLnBlcmZvcm0oKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXdhaXQgYWN0aW9ucy5zZW5kS2V5cyhlYWNoKS5wZXJmb3JtKClcbiAgICAgIH1cbiAgICAgIGlmIChpbnRlcnZhbCkge1xuICAgICAgICBhd2FpdCB0aGlzLmRyaXZlci5zbGVlcChpbnRlcnZhbClcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgYXN5bmMgY2hhbmdlQ29tbWVudCAoY29tbWVudCwgZGVsYXksIHN0b3BNZXNzYWdlKSB7XG4gICAgbGV0IHN0b3BcbiAgICBsZXQgcmF3X2NvbW1lbnQgPSBjb21tZW50XG4gICAgaWYgKCFzdG9wTWVzc2FnZSAmJiAhdGhpcy5ydW5uaW5nKSB7XG4gICAgICBjb21tZW50ID0gJydcbiAgICAgIHN0b3AgPSB0cnVlXG4gICAgfVxuICAgIGlmICghY29tbWVudCkge1xuICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2VcbiAgICB9XG4gICAgbGV0IHRlbXBsYXRlPWBcbiAgICAgIHdpbmRvdy5zZWxlbml1bUNvbW1lbnQuZ2V0KFwiJHt0aGlzLm5hbWV9XCIpLnRleHRDb250ZW50ID0gXFxgJHtjb21tZW50fVxcYFxuICAgIGBcbiAgICBsZXQgcmVzdWx0ID0gdGhpcy5kcml2ZXIuZXhlY3V0ZVNjcmlwdCh0ZW1wbGF0ZSlcbiAgICBpZiAoc3RvcCkge1xuICAgICAgdGhyb3cgRXJyb3IoJ1N0b3AgaW4gY29tbWVudCB3aXRoIGNvbW1lbnQ6JywgcmF3X2NvbW1lbnQpXG4gICAgfVxuICAgIGlmIChkZWxheSkge1xuICAgICAgYXdhaXQgdGhpcy5kcml2ZXIuc2xlZXAoZGVsYXkpXG4gICAgfVxuICB9XG4gIGFzeW5jIGNoYW5nZUtleSAoa2V5KSB7XG4gICAgbGV0IHRlbXBsYXRlPWBcbiAgICAgIHdpbmRvdy5zZWxlbml1bUtleS5nZXQoXCIke3RoaXMubmFtZX1cIikudGV4dENvbnRlbnQgPSBcXGAke2tleX1cXGBcbiAgICBgXG4gICAgbGV0IHJlc3VsdCA9IHRoaXMuZHJpdmVyLmV4ZWN1dGVTY3JpcHQodGVtcGxhdGUpXG4gIH1cbn1cbmNsYXNzIFNlbGVuaXVtVGVzdCB7XG4gIGNvbnN0cnVjdG9yICh7b3B0aW9ucywgdGVzdHN9KSB7XG4gICAgdGhpcy50ZXN0cyA9IHRlc3RzXG4gICAgbGV0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgIH1cbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKVxuICAgIHRoaXMudGFza3MgPSB7fVxuICB9XG4gIGFwcGx5IChjb21waWxlcikge1xuICAgIGxldCBvcHRpb25zID0gdGhpcy5vcHRpb25zXG4gICAgY29tcGlsZXIucGx1Z2luKFwiY29tcGlsYXRpb25cIiwgY29tcGlsYXRpb24gPT4ge1xuICAgICAgLy9jb25zb2xlLmxvZyhcIlByZSBidWlsZC4uLlwiKTtcbiAgICB9KVxuICAgIGNvbXBpbGVyLnBsdWdpbihcImVtaXRcIiwgZnVuY3Rpb24gKGNvbXBpbGF0aW9uLCBjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2soKVxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5pbml0KClcbiAgICAgIH0sIDIwMDApXG4gICAgfSlcbiAgfVxuICBhc3luYyBpbml0ICgpIHtcbiAgICBjb25zb2xlLmxvZygnaW5pdCBiYWNrZW5kIG9mIHZ1ZS1zZWxlbml1bS11bml0dGVzdCcpXG4gICAgbGV0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNcbiAgICBhd2FpdCB0aGlzLm9wZW5DaHJvbWUoYGh0dHA6Ly9sb2NhbGhvc3Q6JHtvcHRpb25zLmFwcFBvcnR9YClcbiAgICBhd2FpdCB0aGlzLmNyZWF0ZUh0dHBTZXJ2ZXIob3B0aW9ucy5zZWxlbml1bVBvcnQpXG4gIH1cbiAgYXN5bmMgb3BlbkNocm9tZSh1cmwpIHtcbiAgICBsZXQgYnJvd3NlciA9ICdjaHJvbWUnXG4gICAgaWYgKHNlc3Npb25JRCkge1xuICAgICAgdGhpcy5kcml2ZXIgPSBhd2FpdCBuZXcgV2ViRHJpdmVyKCBzZXNzaW9uSUQsIGV4ZWN1dG9yIClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kcml2ZXIgPSBhd2FpdCBuZXcgQnVpbGRlcigpXG4gICAgICAgIC5mb3JCcm93c2VyKGJyb3dzZXIpXG4gICAgICAgIC5idWlsZCgpXG4gICAgICBzZXNzaW9uSUQgPSBhd2FpdCB0aGlzLmRyaXZlci5nZXRTZXNzaW9uKClcbiAgICAgIHNlc3Npb25JRCA9IHNlc3Npb25JRC5pZF9cbiAgICAgIGV4ZWN1dG9yID0gYXdhaXQgdGhpcy5kcml2ZXIuZ2V0RXhlY3V0b3IoKVxuICAgIH1cbiAgICBhd2FpdCB0aGlzLmRyaXZlci5nZXQodXJsKVxuICAgIHJldHVybiB0aGlzLmRyaXZlclxuICB9XG4gIGJsb2NrICh7bmFtZSwgcm9vdFNlbGVjdG9yLCBjb21tZW50U2VsZWN0b3IsIGtleVNlbGVjdG9yfSkge1xuICAgIHJldHVybiBuZXcgVGVzdGVyKHtcbiAgICAgIG5hbWUsIHJvb3RTZWxlY3RvciwgY29tbWVudFNlbGVjdG9yLCBrZXlTZWxlY3RvcixcbiAgICAgIGRyaXZlcjogdGhpcy5kcml2ZXIsXG4gICAgICBwYXJlbnQ6IHRoaXNcbiAgICB9KVxuICB9XG4gIGFzeW5jIHJlc3BvbnNlICh7cmVxLCByZXN9KSB7XG4gICAgcmVzLndyaXRlSGVhZCgyMDAsIHtcbiAgICAgICdDb250ZW50LVR5cGUnOiAndGV4dC9qc29uJyxcbiAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOicqJyxcbiAgICAgIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVyc1wiOlwiQXV0aG9yaXphdGlvbixPcmlnaW4sIFgtUmVxdWVzdGVkLVdpdGgsIENvbnRlbnQtVHlwZSwgQWNjZXB0XCIsXG4gICAgICBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHNcIjpcIkdFVCxQT1NUXCJcbiAgICB9KVxuICAgIGlmIChyZXEubWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICAgIGxldCBib2R5ID0gJydcbiAgICAgIHJlcS5vbignZGF0YScsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGJvZHkgKz0gZGF0YVxuICAgICAgICAvLyBUb28gbXVjaCBQT1NUIGRhdGEsIGtpbGwgdGhlIGNvbm5lY3Rpb24hXG4gICAgICAgIC8vIDFlNiA9PT0gMSAqIE1hdGgucG93KDEwLCA2KSA9PT0gMSAqIDEwMDAwMDAgfn5+IDFNQlxuICAgICAgICBpZiAoYm9keS5sZW5ndGggPiAxZTYpXG4gICAgICAgIHJlcXVlc3QuY29ubmVjdGlvbi5kZXN0cm95KClcbiAgICAgIH0pXG4gICAgICByZXEub24oJ2VuZCcsICgpID0+IHtcbiAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGJvZHkpXG4gICAgICAgIGlmICghZGF0YS5uYW1lKSB0aHJvdyBFcnJvcignc2hvdWQgZ2l2ZSBuYW1lJylcbiAgICAgICAgbGV0IG5hbWUgPSBkYXRhLm5hbWVcbiAgICAgICAgcmVzLndyaXRlKEpTT04uc3RyaW5naWZ5KHtvazogdHJ1ZSwgZGF0YTogbmFtZX0pKVxuICAgICAgICByZXMuZW5kKClcbiAgICAgICAgY29uc29sZS5sb2coJ3N0YXJ0IHRlc3Q6JywgbmFtZSlcbiAgICAgICAgaWYgKCF0aGlzLnRlc3RzW25hbWVdKSB7XG4gICAgICAgICAgY29uc29sZS5sb2codGhpcy50ZXN0cylcbiAgICAgICAgICB0aHJvdyBFcnJvcignbm8gdGVzdCBuYW1lZCcsIG5hbWUpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEodGhpcy50YXNrc1tuYW1lXSAmJiB0aGlzLnRhc2tzW25hbWVdLnJ1bm5pbmcpKSB7XG4gICAgICAgICAgdGhpcy50ZXN0c1tuYW1lXSh7XG4gICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgS2V5LFxuICAgICAgICAgICAgQnksXG4gICAgICAgICAgICB1bnRpbCxcbiAgICAgICAgICAgIGRyaXZlcjogdGhpcy5kcml2ZXIsXG4gICAgICAgICAgICBUZXN0OiB0aGlzXG4gICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZmluaXNoIHRlc3Q6JywgbmFtZSlcbiAgICAgICAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICBpZiAoIWVycm9yLm1lc3NhZ2Uuc3RhcnRzV2l0aCgnU3RvcCcpKSB0aHJvdyBlcnJvclxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3N0b3AgdGVzdDonLCBuYW1lKVxuICAgICAgICAgIHRoaXMudGFza3NbbmFtZV0uc2V0UnVubmluZyhmYWxzZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzLndyaXRlKEpTT04uc3RyaW5naWZ5KHtvazogZmFsc2V9KSlcbiAgICAgIHJlcy5lbmQoKVxuICAgIH1cbiAgfVxuICBhc3luYyBjcmVhdGVIdHRwU2VydmVyKHBvcnQpIHtcbiAgICBsZXQgcG9ydFVzZWQgPSBhd2FpdCB0Y3BQb3J0VXNlZC5jaGVjayhwb3J0LCAnbG9jYWxob3N0JylcbiAgICBpZiAoIXBvcnRVc2VkKSB7XG4gICAgICBsZXQgc2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgIHRoaXMucmVzcG9uc2Uoe3JlcSwgcmVzfSlcbiAgICAgIH0pLmxpc3Rlbihwb3J0KVxuICAgICAgcmV0dXJuIHNlcnZlclxuICAgICAgY29uc29sZS5sb2coJ1xcdGNyZWF0ZSBuZXcgZGVidWcgaHR0cCBzZXJ2ZXIgYXQnLCBgaHR0cDovL2xvY2FsaG9zdDoke3BvcnR9YClcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ1xcdHJldXNlIG9sZCBkZWJ1ZyBodHRwIHNlcnZlcjonLCBgaHR0cDovL2xvY2FsaG9zdDoke3BvcnR9YClcbiAgICB9XG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFNlbGVuaXVtVGVzdFxuIl19