'use strict'

const net = require('net')
const events = require('events')
const MessageSocket = require('./MessageSocket')

/**
 * @class MessageSocketServer
 * @emits error
 * @emits MessageSocketServer#connection
 * @emits close
 * @emits MessageSocketServer#listening
 */
class MessageSocketServer extends events.EventEmitter {
    constructor() {
        super()
        this.server = null
        this.sessions = new Set()
    }
    /**
     * 
     * @param {number} port 
     */
    listen(port) {
        if (this.server) {
            throw new Error("MessageSocketServer is listening.")
        }
        this.port = port
        this.server = net.createServer((socket) => {
            const session = new MessageSocket(socket)
            /**
             * connection event.
             *
             * @event MessageSocketServer#connection
             * @type {MessageSocket}
             */
            this.emit("connection", session)
            this.sessions.add(session)
            session.on("close", () => {
                this.sessions.delete(session)
            })
        })
        this.server.on("error", err => {
            this.emit("error", err)
        })
        this.server.on("listening", () => {
            /**
             * listening event.
             *
             * @event MessageSocketServer#listening
             * @type {AddressInfo}
             */
            this.emit("listening", this.server.address())
        })
        this.server.on("close", () => {
            this.emit("close")
        })
        this.server.listen(this.port)
    }
    close() {
        for (const session of this.sessions) {
            session.destroy()
        }
        this.server.close()
    }
}

module.exports = MessageSocketServer