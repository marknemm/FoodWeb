import { Account, AccountEntity } from '~entity/account.entity';
import { QueryResult } from '~orm/index';
import { AccountReadFilters, AccountReadRequest, SendMessageRequest } from '~shared';
import { broadcastEmail, MailTransporter, sendEmail } from '~web/helpers/messaging/email';
import { readAccounts } from '~web/services/account/read-accounts';

/**
 * Sends a given (custom) message to accounts specified by a given set of account filters.
 * @param sendMessageReq The message that is to be sent.
 * @param accountFilters The account filters.
 * @param myAccount The account of the admin user submitting the request.
 * @return A promise that resolves once the operation completes.
 */
export async function sendMessage(sendMessageReq: SendMessageRequest, accountFilters: AccountReadFilters, myAccount: Account): Promise<void> {
  const limit = 300;
  let page = 1;
  let numQueried: number;

  do {
    const readRequest: AccountReadRequest = accountFilters;
    readRequest.page = page++;
    readRequest.limit = limit;
    const queryResult: QueryResult<AccountEntity> = await readAccounts(readRequest, myAccount);
    numQueried = queryResult.entities.length;
    await _messageTargetAccounts(sendMessageReq, queryResult.entities);
  } while (numQueried === limit);
}

/**
 * Sends a given message to a given list of accounts.
 * @param sendMessageReq The message to send.
 * @param accounts The accounts to send the message to.
 * @return A promise that resolves once the operation completes.
 */
async function _messageTargetAccounts(sendMessageReq: SendMessageRequest, accounts: AccountEntity[]): Promise<void> {
  await broadcastEmail(
    MailTransporter.NOREPLY,
    accounts,
    sendMessageReq.messageSubject,
    'custom-message',
    { messageBodyHTML: sendMessageReq.messageBodyHTML },
    true
  );
}

/**
 * Sends a given (custom) test message to the current user's email.
 * @param sendMessageReq The send message request to test.
 * @param myAccount The account of the current user, which the test message will be sent to.
 * @return A promise that resolves once the operation completes.
 */
export async function testMessage(sendMessageReq: SendMessageRequest, myAccount: Account): Promise<void> {
  return sendEmail(
    MailTransporter.NOREPLY,
    myAccount,
    `Test Message: ${sendMessageReq.messageSubject}`,
    'custom-message',
    { messageBodyHTML: sendMessageReq.messageBodyHTML },
    true
  );
}
