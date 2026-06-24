const app = require("./src/app");
const connect = require("./src/db/db");
require("dotenv").config();

const port = process.env.PORT || process.env.port || 3000;
connect();
app.listen(port, () => {
    console.log("server is ready on port : " + port);
});