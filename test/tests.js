const net = require('net')
const assert = require('assert')
const { MessageSocket, MessageSocketServer } = require('../')

describe("host-tests", () => {
    let server, port = 1234
    it("create-server", done => {
        'use strict'
        server = new MessageSocketServer()
        server.on("error", err => {
            console.error(err)
            done(err)
        })
        server.on("listening", address => {
            assert(address.port == port)
            done()
        })
        server.on("connection", socket => {
            socket.on("message", message => {
                socket.send(message)
            })
        })
        server.listen(port)
    })
    it("send-and-receive-message", (done) => {
        const socket = net.createConnection({ port: 1234 }, () => {
            const session = new MessageSocket(socket)
            const strings = ["hello world hello world hello world", "hello world", "hello world hello world hello world"]
            const objects = [{ hello: "world" }, { hello: "hello" }, { hello: "foo" }, { hello: "bar" }]
            for (const object of objects) {
                session.send(object)
            }
            for (const string of strings) {
                session.send(string)
            }
            session.send("close")
            session.on("message", message => {
                if (message == "close") {
                    return done()
                }
                assert(objects.find(o => o.hello == message.hello) || strings.find(s => s == message))
            })
        })
    })
    after((done) => {
        server.close()
        server.on("close", () => {
            done()
        })
    })
})