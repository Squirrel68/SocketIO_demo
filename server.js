const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = express();

app.use("/static", express.static(`${__dirname}/public`));
app.set("views", "./views");
app.set("view engine", "ejs");

const server = require("http").Server(app);
const io = require("socket.io")(server);

// SERVER WEB
const port = process.env.PORT || 3000;
server.listen(port, (req, res) => {
  console.log(`Server running on port ${port}`);
});

var UsersArr = ["Tu"];

// SOCKET IO
io.on("connection", function (socket) {
  // console.log("Connector: " + socket.id);

  socket.on("client-send-Username", function (data) {
    // console.log(data);
    if (UsersArr.indexOf(data) >= 0) {
      //Login fail -> return to A
      socket.emit("sever-send-login-fail");
    } else {
      // Login Success
      UsersArr.push(data);
      socket.Username = data;
      socket.emit("server-send-login-success", data);
      io.sockets.emit("server-end-List-Users", UsersArr);
    }
  });

  socket.on("logout", function () {
    UsersArr.splice(UsersArr.indexOf(socket.Username), 1);
    socket.broadcast.emit("server-end-List-Users", UsersArr);
  });

  socket.on("user-send-message", function (data) {
    io.sockets.emit("server-send-message", { un: socket.Username, nd: data });
  });
});

app.get("/", (req, res) => {
  res.render("home");
});
