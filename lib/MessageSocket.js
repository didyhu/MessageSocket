'use strict'

const events = require('events')
const net = require('net')

/**
 * @class MessageSocket
 * @emits drain
 * @emits error
 * @emits close
 * @emits MessageSocket#message
 */
class MessageSocket extends events.EventEmitter {
    /**
     * 
     * @param {net.Socket} socket 
     */
    constructor(socket) {
        super()
        this.socket = socket
        this.state = "head"
        this.length = null
        this.socket.on("readable", this._onReadable.bind(this))
        this.socket.on("drain", () => this.emit("drain"))
        this.socket.on("error", err => this.emit("error", err))
        this.socket.on("close", () => this.emit("close"))
    }
    /**
     * destroy
     */
    destroy() {
        this.socket.destroy()
    }
    /**
     * send message
     * @param {any} object 
     */
    send(object) {
        const json = JSON.stringify(object)
        const buffer = Buffer.from(json)
        const length = buffer.byteLength
        const head = Buffer.alloc(4)
        head.writeUInt32LE(length)
        return this.socket.write(head) && this.socket.write(buffer)
    }
    _onReadable() {
        while (true) {
            if (this.state == "head") {
                const buffer = this.socket.read(4)
                if (!buffer) {
                    return
                }
                this.state = "body"
                this.length = buffer.readUInt32LE()
            }
            if (this.state == "body") {
                const buffer = this.socket.read(this.length)
                if (!buffer) {
                    return
                }
                /**
                 * message event.
                 *
                 * @event MessageSocket#message
                 * @type {any}
                 */
                this.emit("message", JSON.parse(buffer.toString()))
                this.state = "head"
                this.length = null
            }
        }
    }
}

module.exports = MessageSocket