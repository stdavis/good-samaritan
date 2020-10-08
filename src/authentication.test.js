const getToken = require('./authentication');
const path = require('path');
const fs = require('fs');


const TEST_DATA_FOLDER = path.join(__dirname, '..', 'test_data');
const EXISTING_TOKEN_FILE = path.join(TEST_DATA_FOLDER, 'mock_token');
const NON_EXISTING_TOKEN_FILE = path.join(TEST_DATA_FOLDER, 'new_token_file');


describe('getToken', () => {
  const cleanUp = () => {
    try {
      fs.unlinkSync(NON_EXISTING_TOKEN_FILE);
    } catch {
      return;
    }
  };

  beforeEach(cleanUp);
  afterAll(cleanUp);

  it('returns a cached token', async () => {
    const token = await getToken(false, EXISTING_TOKEN_FILE);

    expect(token).toMatch('mocked_token_value');
  });
  it('writes a new cached token', async () => {
    expect(fs.existsSync(NON_EXISTING_TOKEN_FILE)).toBe(false);

    await getToken(false, NON_EXISTING_TOKEN_FILE);

    expect(fs.existsSync(NON_EXISTING_TOKEN_FILE)).toBe(true);
  });
  it('clears an existing token', async () => {
    const originalToken = await getToken(false, NON_EXISTING_TOKEN_FILE);

    expect(fs.existsSync(NON_EXISTING_TOKEN_FILE)).toBe(true);

    const newToken = await getToken(true, NON_EXISTING_TOKEN_FILE);

    expect(newToken).not.toEqual(originalToken);
  });
});
