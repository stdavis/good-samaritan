const { rest } = require('msw');


module.exports = [
  rest.post('https://github.com/login/device/code', (request, response, context) => {
    return response(
      context.json({
        device_code: 'blah',
        user_code: 'hello',
        verification_uri: false,
        interval: 0
      })
    );
  }),
  rest.post('https://github.com/login/oauth/access_token', (request, response, context) => {
    // test retry on pending status
    return response.once(
      context.json({
        "error_code": "authorization_pending"
      })
    );
  }),
  rest.post('https://github.com/login/oauth/access_token', (request, response, context) => {
    // test retry on 404 from server
    return response.once(
      context.status(404)
    );
  }),
  rest.post('https://github.com/login/oauth/access_token', (request, response, context) => {
    return response(
      context.json({
        access_token: Math.random().toString()
      })
    );
  })
];
