import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import getToken, { config, TOKEN_KEY } from './authentication.js';

describe('getToken', () => {
  const cleanUp = () => {
    config.delete(TOKEN_KEY);
  };

  beforeEach(cleanUp);
  afterAll(cleanUp);

  const mockedValue = 'mocked_token_value';

  it('returns a cached token', async () => {
    config.set(TOKEN_KEY, mockedValue);
    const token = await getToken();

    expect(token).toMatch(mockedValue);
  });
  it('writes a new cached token', async () => {
    await getToken();

    expect(config.get(TOKEN_KEY)).toBeTruthy();
  });
  it('clears an existing token', async () => {
    config.set(TOKEN_KEY, mockedValue);

    await getToken(true);

    expect(config.get(TOKEN_KEY)).toBeUndefined();
  });
});
