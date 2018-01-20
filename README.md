### PubSub

Dependency free Javascript implementation of the Publish/Subscribe design pattern.


### Example Usages
```javascript
const fn1 = data => { console.log(`${data} from fn1`) }
const fn2 = data => { console.log(`${data} from fn2`) }
const fn3 = data => { console.log(`${data} from fn3`) }

PubSub.subscribe('FUNCTIONS', fn1);
PubSub.subscribe('FUNCTIONS', fn2);
PubSub.subscribe('FUNCTIONS', fn3);

PubSub.publish('FUNCTIONS', 'Hello');
// => Hello from fn1
// => Hello from fn2
// => Hello from fn3

PubSub.unsubscribe('FUNCTIONS', 'fn3');

PubSub.publish('FUNCTIONS', 'Hello');
// => Hello from fn1
// => Hello from fn2
```
