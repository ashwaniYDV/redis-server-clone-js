# redis-clone-js

How to run the server
---
Install dependencies

```
npm install
```
Start the server
```
npm start
```

How to tak to the server
---
You can talk to this redis server using official [redis-cli](https://redis.io/docs/latest/develop/connect/cli/).

In another terminal you can try the following:

```
$redis-cli -p 3000
127.0.0.1:3000> ping
PONG
127.0.0.1:3000> echo "hello world"
hello world
127.0.0.1:3000> set name ashwani 
OK
127.0.0.1:3000> get name
ashwani
```

Performance
-----------
My server's performance

```
$ redis-benchmark -p 3000 -t set,get, -n 100000 -q

SET: 80128.20 requests per second
GET: 89847.26 requests per second
```


Redis docker server's performance
```
$ redis-benchmark -t set,get, -n 100000 -q

SET: 41858.52 requests per second
GET: 40209.09 requests per second
```

Note: My code has huge performance due to less complexity and overhead 

References
----------
* https://redis.io/docs/latest/develop/reference/protocol-spec/
* https://github.com/NodeRedis/node-redis-parser/blob/master/lib/parser.js