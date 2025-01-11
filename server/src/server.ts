import { Server } from 'socket.io';
import {
  OllamaChatRequest,
  MessageInterface,
  PartialResponse,
} from './types/interface.js';
import ollama from 'ollama';
import { SocketManagerInstance } from './manager.js';
import { Enums } from './enums.js';
import { log } from 'console';
const io = new Server();

io.on('connection', (socket) => {
  console.log('New socket connected :', socket.id);

  socket.on(Enums.chat, async (data: OllamaChatRequest) => {
    console.log(
      'New message received :',
      data.messages[data.messages.length - 1]
    );
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
      console.log('Partial response received :', part.message.content);
      const partialResponse: PartialResponse = {
        isFirst: numberOfResponse === 1,
        response: part,
      };

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

io.listen(7000);
console.log(`Socket.IO server is running on port ${7000}`);
