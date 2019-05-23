# MessageSocket

Socket client and server sending and receiving messages.

## usage

### server
```js
const server = new MessageSocketServer()
server.on("error", err => {
    // ...
})
server.on("listening", address => {
    // ...
})
server.on("connection", socket => {
    socket.on("message", message => {
        // do something and send someguy back.
        // ...
        socket.send(message)
    })
})
server.listen(port)
```

### client

```js
 const socket = net.createConnection({ port }, () => {
    const session = new MessageSocket(socket)
    session.send("string is ok")
    session.send({object:"also is ok"})
    session.on("message", message => {
       // message from the other side
       // ...
    })
})
```