// src/app/utils/crypto.utils.ts
import * as CryptoJS from 'crypto-js';

const AES_KEY = CryptoJS.SHA256('FINSOVA-SECRET-KEY');
const HMAC_KEY = CryptoJS.SHA256('FINSOVA-HMAC-KEY');
const IV = CryptoJS.enc.Hex.parse('00000000000000000000000000000000'); // 16 bytes IV (same as Node.js)

export function doubleEncryptAES(plainText: string): string {
  const encrypted = CryptoJS.AES.encrypt(plainText, AES_KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString();

  const hmac = CryptoJS.HmacSHA256(encrypted, HMAC_KEY).toString(CryptoJS.enc.Hex);
  return `${encrypted}::${hmac}`;
}

export function doubleDecryptAES(encryptedInput: string): string {
  const [encrypted, hmac] = encryptedInput.split('::');

  const expectedHmac = CryptoJS.HmacSHA256(encrypted, HMAC_KEY).toString(CryptoJS.enc.Hex);
  if (hmac !== expectedHmac) {
    throw new Error('HMAC verification failed');
  }

  const decrypted = CryptoJS.AES.decrypt(encrypted, AES_KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}
