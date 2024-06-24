import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../../serviceAccount.json';
import { BatchResponse } from 'firebase-admin/lib/messaging/messaging-api';
import { mapLimit } from 'async';
import { chunk } from 'lodash';
import { CreateFcmNotificationDto } from './dto/create-fcm-notification.dto';
import { UserEnitity } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FcmNotificationEntity } from './entities/fcm-notification.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

export interface ISendFirebaseMessages {
  token: string;
  title?: string;
  message: string;
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

@Injectable()
export class FcmNotificationService {
  constructor(
    @InjectRepository(FcmNotificationEntity)
    private readonly fcmTokenRepository: Repository<FcmNotificationEntity>,
    private readonly userService: UserService,
  ) {}

  async addNotification(user: UserEnitity, dto: CreateFcmNotificationDto) {
    const tokenData = await this.fcmTokenRepository.findOneBy({ user: user });

    if (!tokenData) {
      const device_token = dto.device_token;

      const token = this.fcmTokenRepository.create({
        user: user,
        device_token,
      });
      await this.fcmTokenRepository.save(token);

      throw new HttpException(`Уведомления включены`, HttpStatus.OK);
    }

    await this.fcmTokenRepository.remove(tokenData);

    throw new HttpException(`Уведомления отключены`, HttpStatus.OK);
  }

  public async sendFirebaseMessages(
    title: string,
    message: string,
    dryRun?: boolean,
  ): Promise<BatchResponse> {
    const allDeviceTokens = await this.fcmTokenRepository.find();

    const messagesForAllUsers = allDeviceTokens.map((deviceToken) => {
      return {
        title: title,
        // 'Запись',
        message: message,
        // 'smokeynagato\n9 июня 19:00-20:00',
        token: deviceToken.device_token,
      };
    });

    const batchedFirebaseMessages = chunk(messagesForAllUsers, 500);

    const batchResponses = await mapLimit<
      ISendFirebaseMessages[],
      BatchResponse
    >(
      batchedFirebaseMessages,
      3,
      async (
        groupedFirebaseMessages: ISendFirebaseMessages[],
      ): Promise<BatchResponse> => {
        try {
          const tokenMessages: admin.messaging.TokenMessage[] =
            groupedFirebaseMessages.map(({ message, title, token }) => ({
              notification: { body: message, title },
              token,
              apns: {
                payload: {
                  aps: {
                    'content-available': 1,
                  },
                },
              },
            }));

          return await this.sendAll(tokenMessages, dryRun);
        } catch (error) {
          return {
            responses: groupedFirebaseMessages.map(() => ({
              success: false,
              error,
            })),
            successCount: 0,
            failureCount: groupedFirebaseMessages.length,
          };
        }
      },
    );

    return batchResponses.reduce(
      ({ responses, successCount, failureCount }, currentResponse) => {
        return {
          responses: responses.concat(currentResponse.responses),
          successCount: successCount + currentResponse.successCount,
          failureCount: failureCount + currentResponse.failureCount,
        };
      },
      {
        responses: [],
        successCount: 0,
        failureCount: 0,
      } as unknown as BatchResponse,
    );
  }

  public async sendAll(
    messages: admin.messaging.TokenMessage[],
    dryRun?: boolean,
  ): Promise<BatchResponse> {
    return admin.messaging().sendEach(messages, dryRun);
  }
}
