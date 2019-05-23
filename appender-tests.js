const log4js = require("log4js")
const path = require("path")

log4js.configure({
    appenders: {
        my: { type: path.relative(process.cwd(), path.resolve(__dirname, "../lib/appender.js")) }
    },
    categories: {
        default: { appenders: ["my"], level: "all" }
    }
})
describe("my-tests", () => {
    it("test", () => {
        const logger = log4js.getLogger("test")
        logger.info("shit")
        logger.error("fuck")
    })
})