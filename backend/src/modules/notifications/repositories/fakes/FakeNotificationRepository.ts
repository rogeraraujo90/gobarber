import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import { ObjectID } from 'mongodb';
import INotificationRepository from '../INotificationRepository';

class FakeNotificationRepository implements INotificationRepository {
  private notifications: Notification[] = [];

  public async create({
    recipientId,
    content,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, {
      id: new ObjectID(),
      recipientId,
      content,
    });

    this.notifications.push(notification);

    return notification;
  }
}

export default FakeNotificationRepository;
