export default {
  jwt: {
    secret: process.env.APP_SECRET || 'I am not secret',
    expiresIn: '0.5d',
  },
};
