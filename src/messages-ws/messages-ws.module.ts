import { Module } from '@nestjs/common';
import { MessagesWsService } from './messages-ws.service';
import { MessagesWsGateway } from './messages-ws.gateway';
import { AuthService } from 'src/auth/auth.service';

@Module({
  providers: [MessagesWsGateway, MessagesWsService, AuthService],
  imports: [],
})
export class MessagesWsModule {}
