import { Socket } from 'socket.io';
interface SocketData {
  isDeleted: boolean;
  socket: Socket;
}
class SocketManager {
  private sockets: Map<string, SocketData> = new Map();

  async addSocket(socket: Socket) {
    try {
      if (!this.sockets.has(socket.id)) {
        this.sockets.set(socket.id, { isDeleted: false, socket });
        console.log('New socket added :', socket.id);
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  async updateIsStopped(socketID: string, status: boolean) {
    try {
      if (this.sockets.has(socketID)) {
        const socketData = this.sockets.get(socketID);
        if (socketData) {
          socketData.isDeleted = status;
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  async getSocketWithId(socketID: string) {
    try {
      const socket = await this.sockets.get(socketID);
      if (socket) {
        return socket;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async deleteSocket(socketID: string) {
    try {
      if (this.sockets.has(socketID)) {
        this.sockets.delete(socketID);
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

export const SocketManagerInstance = new SocketManager();
