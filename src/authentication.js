const fetch = require('node-fetch');
const { cli } = require('cli-ux');
const fs = require('fs');


const jsonHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};
const OAUTH_CLIENT_ID = '98364a543e873178bcaa';
const tokenFilePath = `${__dirname}/.token`;
const encoding = 'utf8';

const authenticate = async () => {
  const codeResponse = await fetch('https://github.com/login/device/code', {
    method: 'POST',
    body: JSON.stringify({
      client_id: OAUTH_CLIENT_ID,
      scope: null
    }),
    headers: jsonHeaders
  });
  const { device_code, user_code, verification_uri, interval } = await codeResponse.json();

  cli.action.start(`Please paste this device code into the site opening in your default browser: "${user_code}"`);
  cli.open(verification_uri);

  const hasVerified = async () => {
    const verifiedResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      body: JSON.stringify({
        client_id: OAUTH_CLIENT_ID,
        device_code,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code'
      }),
      headers: jsonHeaders
    });

    try {
      const response = await verifiedResponse.json();

      if (response.access_token) {
        cli.action.stop();

        return response.access_token;
      }

      return false;
    } catch (error) {
      console.log(error, verifiedResponse);

      return false;
    }
  };

  return new Promise((resolve) => {
    const intervalHandle = setInterval(async () => {
      const token = await hasVerified();

      if (token) {
        resolve(token);
        clearInterval(intervalHandle);
      }
      // if you check right at the allowed interval, it breaks the request
    }, (interval + 1) * 1000);
  });
};

const doesCachedTokenFileExist = (path) => {
  try {
    fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK);

    return true;
  } catch {
    return false;
  }
};

const cacheToken = (token, path) => {
  fs.writeFileSync(path, token, encoding);
};

const getCachedToken = (path) => {
  const token = fs.readFileSync(path, { encoding: encoding });

  return token;
};

const getToken = async () => {
  if (doesCachedTokenFileExist(tokenFilePath)) {
    return getCachedToken(tokenFilePath);
  }

  const token = await authenticate();

  cacheToken(token, tokenFilePath);

  return token;
};

module.exports = getToken;
