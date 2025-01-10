import { Server } from "socket.io";
import { OllamaChatRequest, MessageInterface, PartialResponse } from "./types/interface.js";
import ollama from 'ollama'
const io = new Server();

io.on("connection", (socket) => {
   console.log('New socket connected :', socket.id)

   socket.on('Chat', async (data : OllamaChatRequest)=> {
    console.log('New message received :', data.messages[data.messages.length - 1])
     const response = await ollama.chat({
        messages : data.messages ,
        model : data.model,
        stream : true        
     })
     let numberOfResponse = 0;
     for await (const part of response) {
        numberOfResponse += 1
        console.log('Partial response received :', part.message.content)
        const partialResponse : PartialResponse = {isFirst : numberOfResponse === 1 ,response : part}
        
        socket.emit("PartialResponse", (partialResponse))
     }

   })

   socket.on('disconnect', (r)=> {
    console.log('Socket disconnected :', socket.id , 'REASON : ', r )

   })
   socket.on('error', (error)=> {
    console.log(`Socket with socket id ${socket.id} meet an error : ${error}`)
    socket.emit('Error', error)
   })

});

io.listen(7000);
console.log(`Socket.IO server is running on port ${7000}`);
