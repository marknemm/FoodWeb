import { Account } from '~entity/account.entity';
import { SendMessageRequest } from '~shared';
import { MailTransporter, sendEmail } from '~web/helpers/messaging/email';

export async function testMessage(sendMessageReq: SendMessageRequest, myAccount: Account): Promise<void> {
  return sendEmail(
    MailTransporter.NOREPLY,
    myAccount,
    `Test Message: ${sendMessageReq.messageSubject}`,
    'custom-message',
    { messageBodyHTML: sendMessageReq.messageBodyHTML }
  );
}
