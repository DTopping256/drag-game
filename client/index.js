const socket = io("http://localhost:3000")

let isConnected = false
let uids = []
let movablesState = {}

function printState() {
  console.log("state", { isConnected, uids, movablesState })
}

socket.on("connect", (args) => {
  console.log(
    "%cConnected",
    "background: green; color: lime; font-weight: 600;"
  )
  isConnected = true

  printState()
})

socket.on("initialise", ({ movablesState: newMovablesState, connections }) => {
  console.log("Initialised")
  uids = connections
  movablesState = newMovablesState
  printState()
})

socket.on("disconnect", () => {
  console.log(
    "%cDisconnected",
    "background: red; color: maroon; font-weight: 600;"
  )
  isConnected = false
  printState()
})

socket.on("movables_state_updated", (newMovablesState) => {
  console.log("Updated moveables")
  movablesState = newMovablesState
  printState()
})

socket.on("user_connected", (connectedUserId) => {
  console.log("User connected")
  uids = [...uids, connectedUserId]
  printState()
})

socket.on("user_disconnected", (disconnectedUserId) => {
  console.log("User disconnected")
  uids = uids.filter((uid) => uid !== disconnectedUserId)
  printState()
})
