import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class MessagesWsService {
  private clientsMap = new Map<string, Socket>();

  addClient(completePhone: string, client: Socket) {
    this.clientsMap.set(completePhone, client);
  }

  removeClient(completePhone: string) {
    this.clientsMap.delete(completePhone);
  }

  getClient(completePhone: string): Socket | undefined {
    return this.clientsMap.get(completePhone);
  }

  sendMessageToClientByNumberPhone({
    receiverPhone,
    message,
    senderPhone,
  }: {
    receiverPhone: string;
    message: string;
    senderPhone: string;
  }) {
    const client = this.getClient(receiverPhone);
    if (client) {
      client.emit('message-from-server', {
        message,
        senderPhone,
      });
    } else {
      console.log(`No client found with phone: ${receiverPhone}`);
    }
  }
}
