// 现代加密工具库
// 使用 Web Crypto API 实现 AES-GCM, HMAC, PBKDF2

// ==================== 辅助函数 ====================

/**
 * 将 ArrayBuffer 转换为十六进制字符串
 */
export function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * 将十六进制字符串转换为 ArrayBuffer
 */
export function hexToBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes.buffer as ArrayBuffer;
}

/**
 * 将 ArrayBuffer 转换为 Base64 字符串
 */
export function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * 将 Base64 字符串转换为 ArrayBuffer
 */
export function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer as ArrayBuffer;
}

/**
 * 生成随机字节
 */
export function generateRandomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

// ==================== AES-GCM 加密 ====================

/**
 * 从密码派生 AES 密钥 (使用 PBKDF2)
 */
async function deriveAESKey(
  password: string,
  salt: Uint8Array,
  iterations: number = 100000
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: new Uint8Array(salt) as BufferSource,
      iterations,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * AES-GCM 加密
 * 返回格式: salt(16字节) + iv(12字节) + 密文 (Base64编码)
 */
export async function aesGcmEncrypt(
  plaintext: string,
  password: string
): Promise<string> {
  const encoder = new TextEncoder();
  const salt = generateRandomBytes(16);
  const iv = generateRandomBytes(12);

  const key = await deriveAESKey(password, salt);

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: new Uint8Array(iv) as BufferSource },
    key,
    encoder.encode(plaintext)
  );

  // 合并 salt + iv + ciphertext
  const combined = new Uint8Array(
    salt.length + iv.length + ciphertext.byteLength
  );
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(ciphertext), salt.length + iv.length);

  return bufferToBase64(combined.buffer as ArrayBuffer);
}

/**
 * AES-GCM 解密
 */
export async function aesGcmDecrypt(
  encryptedBase64: string,
  password: string
): Promise<string> {
  const combined = new Uint8Array(base64ToBuffer(encryptedBase64));

  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const ciphertext = combined.slice(28);

  const key = await deriveAESKey(password, salt);

  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(iv) as BufferSource },
    key,
    new Uint8Array(ciphertext) as BufferSource
  );

  return new TextDecoder().decode(plaintext);
}

// ==================== HMAC ====================

type HmacAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

/**
 * 计算 HMAC
 */
export async function hmac(
  message: string,
  key: string,
  algorithm: HmacAlgorithm = "SHA-256"
): Promise<string> {
  const encoder = new TextEncoder();

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: algorithm },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(message)
  );

  return bufferToHex(signature);
}

/**
 * HMAC-MD5 (使用自定义实现，因为 Web Crypto 不支持 MD5)
 */
export function hmacMd5(message: string, key: string): string {
  // MD5 block size is 64 bytes
  const blockSize = 64;
  const encoder = new TextEncoder();

  let keyBytes = encoder.encode(key);

  // If key is longer than block size, hash it
  if (keyBytes.length > blockSize) {
    keyBytes = new Uint8Array(hexToBuffer(md5FromBytes(keyBytes)));
  }

  // Pad key to block size
  const paddedKey = new Uint8Array(blockSize);
  paddedKey.set(keyBytes);

  // Create ipad and opad
  const ipad = new Uint8Array(blockSize);
  const opad = new Uint8Array(blockSize);
  for (let i = 0; i < blockSize; i++) {
    ipad[i] = paddedKey[i] ^ 0x36;
    opad[i] = paddedKey[i] ^ 0x5c;
  }

  // Inner hash: H(K XOR ipad || message)
  const innerData = new Uint8Array(blockSize + encoder.encode(message).length);
  innerData.set(ipad);
  innerData.set(encoder.encode(message), blockSize);
  const innerHash = md5FromBytes(innerData);

  // Outer hash: H(K XOR opad || inner_hash)
  const outerData = new Uint8Array(blockSize + 16);
  outerData.set(opad);
  outerData.set(new Uint8Array(hexToBuffer(innerHash)), blockSize);

  return md5FromBytes(outerData);
}

// MD5 from bytes (internal helper)
function md5FromBytes(input: Uint8Array): string {
  function rotateLeft(x: number, n: number): number {
    return (x << n) | (x >>> (32 - n));
  }

  function addUnsigned(x: number, y: number): number {
    const x8 = x & 0x80000000;
    const y8 = y & 0x80000000;
    const x4 = x & 0x40000000;
    const y4 = y & 0x40000000;
    const result = (x & 0x3fffffff) + (y & 0x3fffffff);
    if (x4 & y4) return result ^ 0x80000000 ^ x8 ^ y8;
    if (x4 | y4) {
      if (result & 0x40000000) return result ^ 0xc0000000 ^ x8 ^ y8;
      else return result ^ 0x40000000 ^ x8 ^ y8;
    } else return result ^ x8 ^ y8;
  }

  function F(x: number, y: number, z: number): number {
    return (x & y) | (~x & z);
  }
  function G(x: number, y: number, z: number): number {
    return (x & z) | (y & ~z);
  }
  function H(x: number, y: number, z: number): number {
    return x ^ y ^ z;
  }
  function I(x: number, y: number, z: number): number {
    return y ^ (x | ~z);
  }

  function FF(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    ac: number
  ): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function GG(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    ac: number
  ): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function HH(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    ac: number
  ): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function II(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    ac: number
  ): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function wordToHex(value: number): string {
    let hex = "";
    for (let i = 0; i <= 3; i++) {
      const byte = (value >>> (i * 8)) & 255;
      hex += ("0" + byte.toString(16)).slice(-2);
    }
    return hex;
  }

  const bytes = input;
  const bitLength = bytes.length * 8;
  const padding = new Uint8Array(((bytes.length + 8) >>> 6) * 64 + 64);
  padding.set(bytes);
  padding[bytes.length] = 0x80;

  const view = new DataView(padding.buffer as ArrayBuffer);
  view.setUint32(padding.length - 8, bitLength, true);

  let a = 0x67452301,
    b = 0xefcdab89,
    c = 0x98badcfe,
    d = 0x10325476;

  const S11 = 7,
    S12 = 12,
    S13 = 17,
    S14 = 22;
  const S21 = 5,
    S22 = 9,
    S23 = 14,
    S24 = 20;
  const S31 = 4,
    S32 = 11,
    S33 = 16,
    S34 = 23;
  const S41 = 6,
    S42 = 10,
    S43 = 15,
    S44 = 21;

  for (let i = 0; i < padding.length; i += 64) {
    const x: number[] = [];
    for (let j = 0; j < 16; j++) {
      x[j] = view.getUint32(i + j * 4, true);
    }

    const AA = a,
      BB = b,
      CC = c,
      DD = d;

    a = FF(a, b, c, d, x[0], S11, 0xd76aa478);
    d = FF(d, a, b, c, x[1], S12, 0xe8c7b756);
    c = FF(c, d, a, b, x[2], S13, 0x242070db);
    b = FF(b, c, d, a, x[3], S14, 0xc1bdceee);
    a = FF(a, b, c, d, x[4], S11, 0xf57c0faf);
    d = FF(d, a, b, c, x[5], S12, 0x4787c62a);
    c = FF(c, d, a, b, x[6], S13, 0xa8304613);
    b = FF(b, c, d, a, x[7], S14, 0xfd469501);
    a = FF(a, b, c, d, x[8], S11, 0x698098d8);
    d = FF(d, a, b, c, x[9], S12, 0x8b44f7af);
    c = FF(c, d, a, b, x[10], S13, 0xffff5bb1);
    b = FF(b, c, d, a, x[11], S14, 0x895cd7be);
    a = FF(a, b, c, d, x[12], S11, 0x6b901122);
    d = FF(d, a, b, c, x[13], S12, 0xfd987193);
    c = FF(c, d, a, b, x[14], S13, 0xa679438e);
    b = FF(b, c, d, a, x[15], S14, 0x49b40821);

    a = GG(a, b, c, d, x[1], S21, 0xf61e2562);
    d = GG(d, a, b, c, x[6], S22, 0xc040b340);
    c = GG(c, d, a, b, x[11], S23, 0x265e5a51);
    b = GG(b, c, d, a, x[0], S24, 0xe9b6c7aa);
    a = GG(a, b, c, d, x[5], S21, 0xd62f105d);
    d = GG(d, a, b, c, x[10], S22, 0x2441453);
    c = GG(c, d, a, b, x[15], S23, 0xd8a1e681);
    b = GG(b, c, d, a, x[4], S24, 0xe7d3fbc8);
    a = GG(a, b, c, d, x[9], S21, 0x21e1cde6);
    d = GG(d, a, b, c, x[14], S22, 0xc33707d6);
    c = GG(c, d, a, b, x[3], S23, 0xf4d50d87);
    b = GG(b, c, d, a, x[8], S24, 0x455a14ed);
    a = GG(a, b, c, d, x[13], S21, 0xa9e3e905);
    d = GG(d, a, b, c, x[2], S22, 0xfcefa3f8);
    c = GG(c, d, a, b, x[7], S23, 0x676f02d9);
    b = GG(b, c, d, a, x[12], S24, 0x8d2a4c8a);

    a = HH(a, b, c, d, x[5], S31, 0xfffa3942);
    d = HH(d, a, b, c, x[8], S32, 0x8771f681);
    c = HH(c, d, a, b, x[11], S33, 0x6d9d6122);
    b = HH(b, c, d, a, x[14], S34, 0xfde5380c);
    a = HH(a, b, c, d, x[1], S31, 0xa4beea44);
    d = HH(d, a, b, c, x[4], S32, 0x4bdecfa9);
    c = HH(c, d, a, b, x[7], S33, 0xf6bb4b60);
    b = HH(b, c, d, a, x[10], S34, 0xbebfbc70);
    a = HH(a, b, c, d, x[13], S31, 0x289b7ec6);
    d = HH(d, a, b, c, x[0], S32, 0xeaa127fa);
    c = HH(c, d, a, b, x[3], S33, 0xd4ef3085);
    b = HH(b, c, d, a, x[6], S34, 0x4881d05);
    a = HH(a, b, c, d, x[9], S31, 0xd9d4d039);
    d = HH(d, a, b, c, x[12], S32, 0xe6db99e5);
    c = HH(c, d, a, b, x[15], S33, 0x1fa27cf8);
    b = HH(b, c, d, a, x[2], S34, 0xc4ac5665);

    a = II(a, b, c, d, x[0], S41, 0xf4292244);
    d = II(d, a, b, c, x[7], S42, 0x432aff97);
    c = II(c, d, a, b, x[14], S43, 0xab9423a7);
    b = II(b, c, d, a, x[5], S44, 0xfc93a039);
    a = II(a, b, c, d, x[12], S41, 0x655b59c3);
    d = II(d, a, b, c, x[3], S42, 0x8f0ccc92);
    c = II(c, d, a, b, x[10], S43, 0xffeff47d);
    b = II(b, c, d, a, x[1], S44, 0x85845dd1);
    a = II(a, b, c, d, x[8], S41, 0x6fa87e4f);
    d = II(d, a, b, c, x[15], S42, 0xfe2ce6e0);
    c = II(c, d, a, b, x[6], S43, 0xa3014314);
    b = II(b, c, d, a, x[13], S44, 0x4e0811a1);
    a = II(a, b, c, d, x[4], S41, 0xf7537e82);
    d = II(d, a, b, c, x[11], S42, 0xbd3af235);
    c = II(c, d, a, b, x[2], S43, 0x2ad7d2bb);
    b = II(b, c, d, a, x[9], S44, 0xeb86d391);

    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }

  return wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
}

// ==================== PBKDF2 ====================

export interface Pbkdf2Options {
  password: string;
  salt: string;
  iterations: number;
  keyLength: number; // in bytes
  hash: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";
}

/**
 * PBKDF2 密钥派生
 */
export async function pbkdf2(options: Pbkdf2Options): Promise<string> {
  const { password, salt, iterations, keyLength, hash } = options;
  const encoder = new TextEncoder();

  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations,
      hash,
    },
    passwordKey,
    keyLength * 8
  );

  return bufferToHex(derivedBits);
}

/**
 * 生成随机盐值 (十六进制)
 */
export function generateSalt(length: number = 16): string {
  return bufferToHex(generateRandomBytes(length).buffer as ArrayBuffer);
}
