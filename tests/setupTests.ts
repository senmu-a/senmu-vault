// import { setupServer } from 'msw/node';
jest.retryTimes(1);
jest.setTimeout(180000);
// const server = setupServer(
//   rest.post('/login', (req, res, ctx) => {
//     console.log('req: ', req);
//     return res(ctx.json({ token: 'mocked_user_token' }));
//   })
