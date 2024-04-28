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
