;(function () {
  /**
   * Initiating all necessary variables
   */
  var
    is,  _,    PubSub,    unsubscribe,
    obj, arr,  storage,   checks,
    str, fn,   subscribe, publish,
    log, type, globStorage;

  /**
   * [1] : Storage for all non-global events.
   * [2] : Storage for all global events.
   */
  storage     = {}; // [1]
  globStorage = {}; // [2]

  /**
   * All utils used across the script lives in here.
   */
  _ = {
    log,
    type,
    union: arr => [...new Set([...arr])],
    splice : Array.prototype.splice,
    toStr  : Object.prototype.toString
  };

  type = type => _.toStr.call(type);
  str  = type => _.type(type) === '[object String]';
  obj  = type => _.type(type) === '[object Object]';
  fn   = type => _.type(type) === '[object Function]';

  is = {
    'object'   : obj,
    'array'    : Array.isArray,
    'string'   : str,
    'function' : fn
  };

  /**
   * Proper checks for events string and callback functions.
   */
  checks = {
    events(events) {
      if (!is.array(events) && !is.string(events))
        throw new TypeError(`The first argument of the subscribe function should be of the type "String" or "Array" of "String"s.`);
      return this
    },

    callbacks(callbacks) {
      if (!is.array(callbacks) && !is['function'](callbacks))
        throw new TypeError(`The second argument of the subscribe function should be of the type "Function" or "Array" of "Function"s.`);
      return this
    }
  };

  /**
   * Function used to make array of the provided input.
   */
  let
    mkArr = input => {
      if (!is.array(input))
        return [input];
      else
        return input
    }

  /**
   * Function used to determine if there is a globing pattern
   * contained in the eevent string.
   */
  let
    isGlob = input => input.indexOf('*') !== -1;

  /**
   * Function used to get all the parts of a global pattern
   * by extracting everything but wildcard.
   */
  let
    extractPtrns = (globEvent) => {
      let
        ptrns       = [],
        wildcadrIdx = globEvent.indexOf('*'),
        txtBefore   = globEvent.slice(0, wildcadrIdx),
        txtAfter    = globEvent.slice(wildcadrIdx + 1);

      if (!txtBefore && !txtAfter)
        return '*' // indicating '*' that match all events.

      txtBefore && ptrns.push(txtBefore);
      txtAfter  && ptrns.push(txtAfter);

      return ptrns
    };

  /**
   * Function used to match the provided patterns against
   * the provided object.
   */
  let
    matchEvents = (ptrns, obj) => {
      let
        matchedEvents = [],
        events        = Object.keys(obj),
        ptrnLenSub    = ptrns.length - 1;

      for (let event of events) {
        let isMatch = false;

        for (let ptrn of mkArr(ptrns)) {
          if (event.indexOf(ptrn) === -1)
            break;

          if (ptrns.indexOf(ptrn) === ptrnLenSub)
            isMatch = true
        }

        isMatch && matchedEvents.push(event)
      }

      return matchedEvents
    };

  /**
   * Events lookup in the local storage.
   */
  let
    lookup = (events, obj, remove = false) => {
      let
        ret        = [],
        targetKeys = Object.keys(obj);

      events = mkArr(events);

      for (let e of events) {
        let eLen = e.length;

        for (let k of targetKeys) {
          let kLen = k.length;
          let foundMatch = false

          if ( eLen > kLen )
            continue;

          if (~k.indexOf(e))
            ret.push(k);
            foundMatch = true

          if (!foundMatch && k[k.indexOf(e)] === k[kLen - 1] && remove)
            throw new Error(`"${key}" event isn't subscribed!`);
        }
      }

      return ret;
    };


  /**
   * Function used to add callbacks to the right events.
   */
  let
    addCBS = (cbs, events, obj, ctx) => {
      for (let event of mkArr(events)) {
        let boundCBS;
        let foundMatches = lookup(event, obj)
        if (foundMatches.length === 0 || !obj[event]) {
          obj[event] = [];
        }

        if (ctx)
          boundCBS = mkArr(cbs).map(cb => cb.bind(ctx))
        else
          boundCBS = mkArr(cbs)

        for (let match of foundMatches) {
          obj[match].push.apply(obj[match], boundCBS);
          obj[match] = _.union(obj[match])
        }

        obj[event].push.apply(obj[event], boundCBS);
        obj[event] = _.union(obj[event])
      }
    };

  /**
   * Function remove callbacks from the target object.
   */
  let
    delCBS = (events, cbs) => {
      let delKeys = lookup(events, storage, true);

      for (delKey of delKeys) {
        if (cbs == null || mkArr(cbs) === storage[delKey]) {
          delete storage[delKey];
        } else {
          let newCBS = (storage[delKey]).filter((val, i) => {
            return !((mkArr(cbs)).includes(val))
          });
          storage[delKey] = newCBS
        }
      }
    }

  /**
   * Function used to subscribe/register event(s)/callback(s).
   *
   * @param  {String|Array}   events    Single/Multiple events to register.
   * @param  {Function|Array} callbacks Callacks to invoke when the related events are published.
   * @param  {Object}         ctx       Context bounded to the callbacks.
   *
   * @return {Object}
   *    Returns PubSub object to allow for nesting methods.
   */
  subscribe = (events, callbacks, ctx) => {
    checks
      .events(events)
      .callbacks(callbacks);

    let
      globEvents = [],
      localEvents = [];

    for (let event of mkArr(events)) {
      if (isGlob(event))
        globEvents.push(event);
      else
        localEvents.push(event)
    }


    addCBS(callbacks, globEvents, globStorage, ctx);
    addCBS(callbacks, localEvents, storage, ctx);

    for (let globEvent of Object.keys(globStorage)) {
      let
        ptrns         = extractPtrns(globEvent),
        matchedEvents = ptrns === '*' ? Object.keys(storage) : matchEvents(ptrns, storage);

      addCBS(globStorage[globEvent], matchedEvents, storage, ctx)
    }

    return PubSub
  };

  /**
   * Function used to unsubscribe/remove events/callbacks.
   *
   * @param  {String|Array}   events    Single/Multiple events to remove.
   * @param  {Function|Array} callbacks Callacks to remove.
   *
   * @return {Object}
   *    Returns PubSub object to allow for nesting methods.
   */
  unsubscribe = (events, callbacks = null) => {
    checks.events(events);
    callbacks && checks.callbacks(callbacks);

    let
      globEvents = [],
      localEvents = [];

    for (let event of mkArr(events)) {
      if (isGlob(event))
        globEvents.push(event);
      else
        localEvents.push(event)
    }

    delCBS(localEvents, callbacks);

    for (let globEvent of mkArr(events)) {
      let
        ptrns         = extractPtrns(globEvent),
        matchedEvents = ptrns === '*' ? Object.keys(storage) : matchEvents(ptrns, storage);

      delCBS(matchedEvents, callbacks)
    }

    return PubSub
  };

  /**
   * Function used to trigger events.
   *
   * @param  {String|Array}   events    Single/Multiple events to register.
   * @param  {Object}         data      Data passed to the callbacks.
   * @param  {Boolean}        ret       Defines if PubSub or return from function.
   * @param  {[type]}         ctx       Context bounded to callbacks.
   *
   * @return {Object}
   *    - Returns PubSub object to allow for nesting methods if `ret` === false.
   *    - Returns callbacks return in object if `ret` === true.
   */
  publish = (events, data, ret = false, ctx) => {
    let output = {};

    checks.events(events);
    events = mkArr(events);

    events.forEach(e => {
      if (isGlob(e))
        events = events.concat(matchGlob(e));
    })

    events.forEach(e => {
      if (!storage[e] && !isGlob(e))
        throw new Error(`Can't publish "${e}" because it doesn't exist.`);

      storage[e].forEach(cb => {
        !ret && cb.call(ctx, data);

        if (ret)
          output[cb.name.replace(/bound /, '')] = cb.call(ctx, data);
      })
    })

    if (ret)
      return output

    return PubSub
  };

  PubSub = {
    subscribe,
    unsubscribe,
    publish
  };

  window.PubSub = PubSub
})();
