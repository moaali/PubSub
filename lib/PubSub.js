(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("PubSub", [], factory);
	else if(typeof exports === 'object')
		exports["PubSub"] = factory();
	else
		root["PubSub"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PubSub = function () {
  function PubSub() {
    _classCallCheck(this, PubSub);

    this.actions = [];
  }

  /**
   * This used to subscribe new actions or new functions to existent actions.
   *
   * @param  {String}   actionName String represents action name.
   * @param  {Function} fn         Function that will to be registered.
   */


  _createClass(PubSub, [{
    key: 'subscribe',
    value: function subscribe(actionName, fn) {
      var actions = this.actions,
          fnName = fn.name,
          action = this.find(actionName);

      if (!action) {
        action = { name: actionName, subscriptions: [] };
        actions.push(action);
      }

      action.subscriptions.push({ fnName: fnName, fn: fn });
    }

    /**
     * Remove complete actions or some of their related functions.
     *
     * @param  {String}   actionName String represents action name.
     * @param  {Funcion}  fnName     String represents function to be removed.
     */

  }, {
    key: 'unsubscribe',
    value: function unsubscribe(actionName, fnName) {
      if (!fnName) {
        this.actions = this.actions.filter(function (action) {
          return action.name !== actionName;
        });
        return;
      }

      var action = this.find(actionName);

      action.subscriptions = action.subscriptions.filter(function (subscription) {
        return subscription.fnName !== fnName;
      });
    }

    /**
     * Dispatches the related functions attached to the given action.
     */

  }, {
    key: 'publish',
    value: function publish() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var actionName = Array.prototype.slice.call(args).shift();

      if (!actionName) {
        throw new Error('PubSub | Action not found!!!');
      }

      var action = this.find(actionName);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = action.subscriptions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _subscription$fn;

          var subscription = _step.value;

          (_subscription$fn = subscription.fn).call.apply(_subscription$fn, args);
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

      return true;
    }

    /**
     * Query `actions` for the provided string.
     *
     * @param  {String} actionName String represents action name.
     * @return {Object}            Action Object.
     */

  }, {
    key: 'find',
    value: function find(actionName) {
      return this.actions.find(function (action) {
        return action.name === actionName;
      });
    }
  }]);

  return PubSub;
}();

window.PubSub = new PubSub();
exports.default = new PubSub();
module.exports = exports['default'];

/***/ })
/******/ ]);
});
//# sourceMappingURL=PubSub.js.map