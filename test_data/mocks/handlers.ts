import { http, HttpResponse } from 'msw';

export default [
  http.post('https://github.com/login/device/code', () => {
    return HttpResponse.json({
      device_code: 'blah',
      user_code: 'hello',
      verification_uri: false,
      interval: 0,
    });
  }),
  http.post(
    'https://github.com/login/oauth/access_token',
    () => {
      // test retry on pending status
      return HttpResponse.json({
        error_code: 'authorization_pending',
      });
    },
    { once: true },
  ),
  http.post(
    'https://github.com/login/oauth/access_token',
    () => {
      // test retry on 404 from server
      return new HttpResponse(null, { status: 404 });
    },
    { once: true },
  ),
  http.post('https://github.com/login/oauth/access_token', () => {
    return HttpResponse.json({
      access_token: Math.random().toString(),
    });
  }),
];
