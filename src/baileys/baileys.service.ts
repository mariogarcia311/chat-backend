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

  // Método para enviar mensajes
  async sendMessage(countryCode: string, cellPhone: string, text: string) {
    try {
      if (this.sock) {
        await this.sock.sendMessage(
          `${countryCode}${cellPhone}@s.whatsapp.net`,
          {
            text,
          },
        );
      } else {
        await this.connectToWhatsApp();
        setTimeout(async () => {
          console.log(this.sock);
        }, 3000);
      }
    } catch (error) {
      console.log('mario errorxd', error);
    }
  }
}
