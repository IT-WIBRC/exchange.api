export type AccountConfirmation = {
  email: string;
  username: string;
  code: number;
};

export interface IMail {
  sendUserConfirmation(config: AccountConfirmation): Promise<void>;
  sendUserWelcome(config: Omit<AccountConfirmation, "code">): Promise<void>;
}
