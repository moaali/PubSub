### PubSub

Dependency free Javascript implementation of the Publish/Subscribe pattern with wildcards, namespaces.


### Example Usages
```javascript
let fn1 = data => { console.log(`${data} from fn1`) }
let fn2 = data => { console.log(`${data} from fn2`) }
let fn2 = data => { console.log(`${data} from fn3`) }

PubSub.subscribe(['player.play', 'player.rest'], fn1);
PubSub.subscribe('player', fn2);
PubSub.subscribe('player.out', fn3);

PubSub.publish('player', 'hello');
// => Hello from fn1
// => Hello from fn2
// => Hello from fn3

PubSub.unsubscribe('player.out', fn3);

PubSub.publish('player', 'hello');
// => Hello from fn1
// => Hello from fn2
```
