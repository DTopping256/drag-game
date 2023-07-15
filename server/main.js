const { Server } = require("socket.io")

const io = new Server({
  cors: { origin: "*" },
})

const connections = []
const initialState = {
  card1: {
    x: 0,
    y: 0,
    content: "Card 1",
    color: "#8634eb",
    shape: "circle",
    zone: "board",
  },
}

let nextCardNumber = 2
let movablesState = Object.assign({}, initialState)

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

  socket.on("add", () => {
    console.log("add", socket.id)
    movablesState[`card${nextCardNumber}`] = {
      x: Math.random() * 300,
      y: Math.random() * 300,
      content: `Card ${nextCardNumber}`,
      color: `rgb(${Math.random() * 150}, ${Math.random() * 150}, ${
        Math.random() * 150
      })`,
      shape: "circle",
      zone: "board",
    }
    nextCardNumber++
    io.emit("movables_state_updated", movablesState)
  })

  socket.on("reset", () => {
    console.log("reset", socket.id)
    movablesState = Object.entries(movablesState)
      .filter(([, { zone }]) => zone === "hand")
      .reduce((acc, [cardId, card]) => ({ ...acc, [cardId]: card }), {})
    io.emit("movables_state_updated", movablesState)
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
