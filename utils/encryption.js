// utils/encryption.js
import { encrypt, decrypt } from 'crypto-js';

export const secureStorage = {
  async setItem(key, value) {
    const encrypted = encrypt(JSON.stringify(value), process.env.ENCRYPTION_KEY);
    await chrome.storage.local.set({ [key]: encrypted.toString() });
  },

  async getItem(key) {
    const encrypted = await chrome.storage.local.get(key);
    return decrypt(encrypted, process.env.ENCRYPTION_KEY).toString(Utf8);
  }
};