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
  updateMovableElements()
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
  updateMovableElements()
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

function updateMovableElements() {
  const boardEl = document.getElementById("board")
  const fragment = document.createDocumentFragment()
  Object.entries(movablesState).forEach(([cardId, cardData]) => {
    const card = document.createElement("div")
    card.setAttribute("id", cardId)
    card.setAttribute(
      "style",
      `
        color: ${cardData.color};
        top: calc(1rem + ${cardData.y}px);
        left: calc(1rem + ${cardData.x}px);`
    )
    card.setAttribute("class", "card")
    card.textContent = cardData.content
    fragment.appendChild(card)
  })
  boardEl.replaceChildren(fragment)
}

window.addEventListener("load", () => {
  document.getElementById("addButton").addEventListener("click", () => {
    socket.emit("add")
  })

  document.getElementById("resetButton").addEventListener("click", () => {
    socket.emit("reset")
  })
})
