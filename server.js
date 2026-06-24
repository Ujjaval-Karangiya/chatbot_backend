const app = require("./src/app")
const connect = require("./src/db/db")
require("dotenv").config();

const port = process.env.port;
connect();
app.listen(port, () => {
    console.log("server is ready on port : " + port);
})