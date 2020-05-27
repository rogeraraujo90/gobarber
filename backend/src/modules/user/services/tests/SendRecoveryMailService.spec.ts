import 'reflect-metadata';
import FakeUsersRepository from '@modules/user/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/providers/fakes/FakeMailProvider';
import SendRecoveryMailService from '../SendRecoveryMailService';

describe('Send Recovery Mail', () => {
  it('should be able to send a recovery password mail', async () => {
    const fakeRepository = new FakeUsersRepository();
    const fakeMailProvider = new FakeMailProvider();
    const service = new SendRecoveryMailService(
      fakeRepository,
      fakeMailProvider
    );
    const mailData = { email: 'arya@gobarber.com' };
    const sendMailMethod = jest.spyOn(fakeMailProvider, 'sendMail');

    await service.execute(mailData);

    expect(sendMailMethod).toHaveBeenCalledTimes(1);
    expect(sendMailMethod).toHaveBeenCalledWith(
      mailData.email,
      'Recover password request received.'
    );
  });
});
