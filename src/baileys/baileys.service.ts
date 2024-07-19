import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  WASocket,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BaileysService implements OnModuleInit, OnModuleDestroy {
  constructor(private configService: ConfigService) {}
  private sock: WASocket;

  onModuleInit() {
    this.connectToWhatsApp();
  }

  onModuleDestroy() {
    // this.socket?.end(null);
  }

  async connectToWhatsApp() {
    try {
      const { state, saveCreds } =
        await useMultiFileAuthState('auth_info_baileyss');

      this.sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        defaultQueryTimeoutMs: undefined,
      });

      this.sock.ev.on('creds.update', saveCreds);
      this.sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
          console.log('error conection marrio');
          const shouldReconnect =
            (lastDisconnect.error as Boom)?.output?.statusCode !==
            DisconnectReason.loggedOut;
          console.log(
            'connection closed due to ',
            lastDisconnect.error,
            ', reconnecting ',
            shouldReconnect,
            'mario el loko',
          );
          // reconnect if not logged out
          if (shouldReconnect) {
            this.connectToWhatsApp();
          }
        } else if (connection === 'open') {
          console.log('opened connection');
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  private keepAlive() {
    setInterval(async () => {
      try {
        if (this.sock) {
          await this.sock.sendPresenceUpdate('available');
          await this.sock.sendMessage(
            `${this.configService.get<string>('whatsapp.myPhone')}@s.whatsapp.net`,
            {
              text: 'Hello ther!!',
            },
          );
          console.log('Sent presence update to keep the connection alive');
        }
      } catch (error) {
        console.error('Failed to send presence update:', error);
      }
    }, 1000 * 10); // Actualiza la presencia cada 2 minutos
  }

  // Método para enviar mensajes
  async sendMessage(countryCode: string, cellPhone: string, text: string) {
    await this.sock.sendMessage(`${countryCode}${cellPhone}@s.whatsapp.net`, {
      text,
    });
  }
}
