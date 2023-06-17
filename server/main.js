const { Server } = require("socket.io")

const io = new Server({
  cors: { origin: "*" },
})

io.on("connection", (socket) => {
  socket.emit("connected")
  console.log("New connection")
})

io.listen(3000)
console.log("Listening at post 3000...")
