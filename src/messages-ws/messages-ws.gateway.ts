import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly authService: AuthService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const user = await this.authService.verifyToken(
        client.handshake.auth.token,
      );
      client.data.user = user;
      this.messagesWsService.addClient(user.completePhone, client);
    } catch (error) {
      client.disconnect();
      console.log('Client disconnected due to invalid token:', client.id);
    }
  }

  handleDisconnect(client: Socket) {
    const { user } = client.data;
    if (user && user.completePhone) {
      this.messagesWsService.removeClient(client.data.user.completePhone);
    }
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(
    client: Socket,
    payload: { receiverPhone: string; message: string },
  ) {
    const { message, receiverPhone } = payload;
    console.log(payload, client.data);
    this.messagesWsService.sendMessageToClientByNumberPhone({
      message,
      receiverPhone,
      senderPhone: client.data.user.completePhone,
    });
  }
}
