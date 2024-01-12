const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)
const cors= require('cors');
const path = require("path");
const PORT=process.env.PORT || 5000;

const io = require('socket.io')(server, { cors: { origin: 'http://localhost:3000' } });

// module.exports = {
// 	//...
// 	devServer: {
// 		hot:true,
// 		// host: '0.0.0.0'		
// 	  },
// 	  target:'web',
// 	  mode:'development'
//   };

io.on("connection", (socket) => {
	
	socket.emit("me", socket.id)

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		
		io.to(data.to).emit("callAccepted", data.signal)
	})
})

if(process.env.NODE_ENV== "production"){
	app.use(express.static("frontend/build"));
	const path=require(path);
	app.get("*",(req,res)=>{
		res.sendFile(path.resolve(__dirname,'frontend','build','index.html'))
	})
}

server.listen(PORT,() => console.log(`server is running on port ${PORT}`))
