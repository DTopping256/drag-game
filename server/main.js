const { Server } = require("socket.io")

const io = new Server({
  cors: { origin: "*" },
})

function updateMovables() {
  movablesState = Object.entries(movablesState).reduce((o, [name, movable]) => {
    return { ...o, [name]: { ...movable, x: vx + x, y: vy + y } }
  }, movablesState)

  io.emit("movables_state_updated", movablesState)
}

setInterval(updateMovables, 1000)

const connections = []
let movablesState = { redBox: { x: 0, y: 0, vx: 0.1, vy: 0.5 } }

function registerSocketListeners(socket) {
  socket.on("update_moveables", ({ movableId, position }) => {
    movablesState = { ...movablesState, [movableId]: position }
    socket.broadcast.emit("movables_state_updated", movablesState)
  })

  socket.on("disconnect", () => {
    const indexToDelete = connections.indexOf(socket.id)
    socket.broadcast.emit("user_disconnected", socket.id)
    connections.splice(indexToDelete, 1)
    console.log(
      `Disconnect: ${socket.id}\nActive connections: [${connections.join(",")}]`
    )
  })
}

io.on("connection", (socket) => {
  socket.emit("initialise", { movablesState, connections })
  socket.broadcast.emit("user_connected", socket.id)
  connections.push(socket.id)
  console.log(
    `New connection: ${socket.id}\nActive connections: [${connections.join(
      ","
    )}]`
  )
  registerSocketListeners(socket)
})

io.listen(3000)
console.log("Listening at post 3000...")
