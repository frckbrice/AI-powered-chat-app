import { createCipheriv } from "crypto";

function RndNum(a: number, b: number) {
  // Generate a random number within the range of a to b
  return Math.ceil((a + (b - a)) * Math.random());
}

// Generate a random number within the range of int32
function makeNonce() {
  return RndNum(-2147483648, 2147483647);
}

function makeRandomIv(): string {
  // Generate a random 16-character string
  const str = "0123456789abcdefghijklmnopqrstuvwxyz";
  const result = [];
  for (let i = 0; i < 16; i++) {
    const r = Math.floor(Math.random() * str.length);
    result.push(str.charAt(r));
  }
  return result.join("");
}

// Determine the algorithm based on the length of the key, only supports 16 24 32 bits
function getAlgorithm(keyBase64: string): string {
  const key = Buffer.from(keyBase64);
  switch (key.length) {
    case 16:
      return "aes-128-cbc";
    case 24:
      return "aes-192-cbc";
    case 32:
      return "aes-256-cbc";
  }

  throw new Error("Invalid key length: " + key.length);
}

// AES encryption, using mode: CBC/PKCS5Padding
function aesEncrypt(plainText: string, key: string, iv: string): ArrayBuffer {
  const cipher = createCipheriv(getAlgorithm(key), key, iv);
  cipher.setAutoPadding(true);
  const encrypted = cipher.update(plainText);
  const final = cipher.final();
  const out = Buffer.concat([encrypted, final]);

  return Uint8Array.from(out).buffer;
}

export function generateToken04(
  appId: number,
  userId: string,
  secret: string,
  effectiveTimeInSeconds: number,
  payload?: string,
): string {
  if (!appId || typeof appId !== "number") {
    throw new Error(`appID invalid: ${appId}`);
  }

  if (!userId || typeof userId !== "string") {
    throw new Error(`userId invalid: ${userId}`);
  }

  if (!secret || typeof secret !== "string" || secret.length !== 32) {
    throw new Error(`secret must be a 32 byte string, got length: ${secret?.length || 0}`);
  }

  if (!effectiveTimeInSeconds || typeof effectiveTimeInSeconds !== "number") {
    throw new Error(`effectiveTimeInSeconds invalid: ${effectiveTimeInSeconds}`);
  }

  const createTime = Math.floor(new Date().getTime() / 1000);
  const tokenInfo = {
    app_id: appId,
    user_id: userId,
    nonce: makeNonce(),
    ctime: createTime,
    expire: createTime + effectiveTimeInSeconds,
    payload: payload || "",
  };

  // Convert token information to json
  const plaintText = JSON.stringify(tokenInfo);
  console.log("plain text: ", plaintText);

  // A randomly generated 16-byte string used as the AES encryption vector, which is Base64 encoded with the ciphertext to generate the final token
  const iv: string = makeRandomIv();
  console.log("iv", iv);

  // Encrypt
  const encryptBuf = aesEncrypt(plaintText, secret, iv);

  // Token binary splicing: expiration time + Base64(iv length + iv + encrypted information length + encrypted information)
  const [b1, b2, b3] = [new Uint8Array(8), new Uint8Array(2), new Uint8Array(2)];
  new DataView(b1.buffer).setBigInt64(0, BigInt(tokenInfo.expire), false);
  new DataView(b2.buffer).setUint16(0, iv.length, false);
  new DataView(b3.buffer).setUint16(0, encryptBuf.byteLength, false);
  const buf = Buffer.concat([
    Buffer.from(b1),
    Buffer.from(b2),
    Buffer.from(iv),
    Buffer.from(b3),
    Buffer.from(encryptBuf),
  ]);
  const dv = new DataView(Uint8Array.from(buf).buffer);
  // Package data
  // console.log('-----------------');
  // console.log('-------getBigInt64----------', dv.getBigInt64(0));
  // console.log('-----------------');
  // console.log('-------getUint16----------', dv.getUint16(8));
  // console.log('-----------------');
  return "04" + Buffer.from(dv.buffer).toString("base64");
}
