interface IMailConfig {
  driver: 'ethereal' | 'ses';
  default: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',
  default: {
    from: {
      email: process.env.DEFAULT_MAIL_SENDER,
      name: process.env.DEFAULT_MAIL_SENDER_NAME,
    },
  },
} as IMailConfig;
