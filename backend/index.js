const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const authRouter = require("./routes/auth-route");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const messengerRoute = require("./routes/messenger-route");

const app = express();

app.use(cors());
const server = http.createServer(app);
dotenv.config();

const PORT = process.env.PORT || 8080;
connectDB();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", messengerRoute);

app.get("/", (req, res) => {
  res.send("Hey there!");
});

server.listen(PORT, () => {
  console.log(`🚀Server has launched on ${PORT}`);
});
