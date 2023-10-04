var socket = io("http://localhost:3000");

socket.on("sever-send-login-fail", function () {
  alert("Username already exist!!!");
});

socket.on("server-end-List-Users", function (data) {
  $("#boxContent").html("");
  data.forEach(function (i) {
    $("#boxContent").append("<div class='user'>" + i + "</div>");
  });
});

socket.on("server-send-login-success", function (data) {
  $("#currentUser").html(data);
  $("#loginForm").hide(2000);
  $("#chatForm").show(1000);
});

socket.on("server-send-message", function (data) {
  $("#ListMessages").append(
    "<div class='ms'>" + data.un + ": " + data.nd + "</div>"
  );
});

$(document).ready(function () {
  $("#loginForm").show();
  $("#chatForm").hide();

  $("#btnRegister").click(function () {
    socket.emit("client-send-Username", $("#txtUsername").val());
  });

  $("#btnLogout").click(function () {
    socket.emit("logout");
    $("#loginForm").show(1000);
    $("#chatForm").hide(2000);
  });

  $("#btnMessage").click(function () {
    socket.emit("user-send-message", $("#txtMessage").val());
  });
});
