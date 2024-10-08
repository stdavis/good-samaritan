import { ux } from '@oclif/core';
import Conf from 'conf';
import fetch from 'node-fetch';
import open from 'open';

export const config = new Conf({ projectName: 'good-samaritan', clearInvalidConfig: true });
const jsonHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};
const OAUTH_CLIENT_ID = '98364a543e873178bcaa';
export const TOKEN_KEY = 'GITHUB_TOKEN';

async function authenticate(): Promise<string> {
  const codeResponse = await fetch('https://github.com/login/device/code', {
    method: 'POST',
    body: JSON.stringify({
      client_id: OAUTH_CLIENT_ID,
      scope: null,
    }),
    headers: jsonHeaders,
  });
  const { device_code, user_code, verification_uri, interval } = (await codeResponse.json()) as {
    device_code: string;
    user_code: string;
    verification_uri: string;
    interval: number;
  };

  ux.action.start(`Please paste this device code into the site opening in your default browser: "${user_code}"`);

  // skip this in tests, couldn't figure out how to mock the open function
  if (verification_uri) {
    open(verification_uri);
  }

  const hasVerified = async () => {
    const verifiedResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      body: JSON.stringify({
        client_id: OAUTH_CLIENT_ID,
        device_code,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
      }),
      headers: jsonHeaders,
    });

    try {
      const response = await verifiedResponse.json();

      const typedResponse = response as { access_token?: string };
      if (typedResponse.access_token) {
        ux.action.stop();

        return typedResponse.access_token;
      }

      return false;
    } catch {
      return false;
    }
  };

  return new Promise((resolve) => {
    const intervalHandle = setInterval(
      async () => {
        const token = await hasVerified();

        if (token) {
          resolve(token);
          clearInterval(intervalHandle);
        }
        // if you check right at the allowed interval, it breaks the request
      },
      (interval + 1) * 1000,
    );
  });
}

async function getToken(resetToken: boolean = false): Promise<string> {
  const cachedToken = config.get(TOKEN_KEY) as string;
  if (cachedToken) {
    if (resetToken) {
      config.delete(TOKEN_KEY);
      console.log('GitHub token has been cleared.');

      return '';
    } else {
      return cachedToken;
    }
  }

  const token = await authenticate();

  config.set(TOKEN_KEY, token);

  return token;
}

export default getToken;
