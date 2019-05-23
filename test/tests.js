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
            session.send({ hello: "world" })
            session.send("hello world")
            session.on("message", message => {
                assert(message == "hello world" || message.hello == "world")
                if (message == "hello world") {
                    done()
                }
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