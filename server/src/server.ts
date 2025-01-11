import { Server } from 'socket.io';
import { Socket } from 'socket.io';

import {
  OllamaChatRequest,
  MessageInterface,
  PartialResponse,
} from './types/interface.js';
import ollama from 'ollama';
import { SocketManagerInstance } from './manager.js';
import { Enums } from './enums.js';
const io = new Server();

io.on('connection', (socket) => {
  console.log('New socket connected :', socket.id);
  
  socket.on(Enums.chat, async (data: OllamaChatRequest) => { 
    console.log(
      'New message received :',
      data.messages[data.messages.length - 1]
    );   
    if (data.messages.length < 3) {
     await findTitle(socket , data.messages[data.messages.length - 1].content)

    }

    const savedSocket = await SocketManagerInstance.getSocketWithId(socket.id);

    if (savedSocket) {
      await SocketManagerInstance.updateIsStopped(socket.id, false);
    } else {
      SocketManagerInstance.addSocket(socket);
    }
    const response = await ollama.chat({
      messages: data.messages,
      model: data.model,
      stream: true,
    });
    let numberOfResponse = 0;
    for await (const part of response) {
      const savedSocket = await SocketManagerInstance.getSocketWithId(
        socket.id
      );
      if (savedSocket) {
        if (savedSocket.isDeleted) {
          console.log('Generation stopped.');
          break;
        }
      }
      numberOfResponse += 1;
      const partialResponse: PartialResponse = {
        isFirst: numberOfResponse === 1,
        response: part,
      }; 
      if (part.done) {
        console.log('Full response sent to the user')
      }

      socket.emit('PartialResponse', partialResponse);
    }
  });

  socket.on('disconnect', (r) => {
    console.log('Socket disconnected :', socket.id, 'REASON : ', r);
    SocketManagerInstance.deleteSocket(socket.id);
  });
  socket.on(Enums.stopGeneration, async () => {
    try {
      if (await SocketManagerInstance.getSocketWithId(socket.id)) {
        SocketManagerInstance.updateIsStopped(socket.id, true);
        console.log('Generation stopeed');
      } else {
        console.error('can stop generation because socket is not registered');
      }
    } catch (error) {
      console.error(error);
    }
  });
  socket.on('error', (error) => {
    console.log(`Socket with socket id ${socket.id} meet an error : ${error}`);
    socket.emit('Error', error);
  });
});


const findTitle = async (socket : Socket , text : string)=> {
  try {
    const response = await ollama.generate({
      model : "llama3.2:1b",
      prompt : `Text : ${text} . Your task is Give a Title to this text Which corresponds to the text in a professional manner, always stay in the context of the text , Respond using JSON`,
      stream : false ,
      options : {
        temperature : 0 ,
      },
      format : {
        "type": "object",
        "properties": {
          "title": {
            "type": "string"
          }
        },
        "required": [
          "title",
        ]
      }
    })
    if (response.done) {
      console.log("Title Response :",JSON.parse( response.response))
      socket.emit(Enums.titleFound , JSON.parse( response.response))
    }
  } catch (error) {
    console.error(error)
    socket.emit(Enums.Error, {error})
    
  }
}

io.listen(7000);
console.log(`Socket.IO server is running on port ${7000}`);

