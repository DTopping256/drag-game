const socket = io("http://localhost:3000")

socket.on("connect", () => {
  console.log("Connected", socket.id)
})

socket.on("disconnect", () => {
  console.log("Disconnected", socket.id)
})
