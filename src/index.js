class PubSub {
  constructor() {
    this.actions = [];
  }

  /**
   * This used to subscribe new actions or new functions to existent actions.
   *
   * @param  {String}   actionName String represents action name.
   * @param  {Function} fn         Function that will to be registered.
   */
  subscribe(actionName, fn) {
    let
      actions = this.actions,
      fnName = fn.name,
      action = this.find(actionName);

    if (!action) {
      action = { name: actionName, subscriptions: [] };
      actions.push(action);
    }

    action.subscriptions.push({ fnName, fn });
  }

  /**
   * Remove complete actions or some of their related functions.
   *
   * @param  {String}   actionName String represents action name.
   * @param  {Funcion}  fnName     String represents function to be removed.
   */
  unsubscribe(actionName, fnName) {
    if (!fnName) {
      this.actions = this.actions.filter(action => action.name !== actionName);
      return;
    }

    let action = this.find(actionName);

    action.subscriptions = action.subscriptions.filter(subscription => subscription.fnName !== fnName);
  }

  /**
   * Dispatches the related functions attached to the given action.
   */
  publish(...args) {
    let actionName = Array.prototype.slice.call(args).shift();

    if (!actionName) {
      throw new Error('PubSub | Action not found!!!');
    }

    let action = this.find(actionName);

    for (let subscription of action.subscriptions) {
      subscription.fn.call(...args);
    }

    return true;
  }

  /**
   * Query `actions` for the provided string.
   *
   * @param  {String} actionName String represents action name.
   * @return {Object}            Action Object.
   */
  find(actionName) {
    return this.actions.find(action => action.name === actionName);
  }
}

window.PubSub = new PubSub();
export default new PubSub();
