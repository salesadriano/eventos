import { randomUUID as nodeRandomUUID } from "crypto";

type MaybeWebCrypto = {
  randomUUID?: () => string;
  getRandomValues?: (array: Uint8Array) => Uint8Array;
};

const getWebCrypto = (): MaybeWebCrypto | undefined => {
  const globalCrypto = (globalThis as { crypto?: MaybeWebCrypto }).crypto;
  return globalCrypto;
};

const randomNibble = (): number => {
  const webCrypto = getWebCrypto();
  if (webCrypto?.getRandomValues) {
    const buffer = new Uint8Array(1);
    webCrypto.getRandomValues(buffer);
    return buffer[0] & 0xf;
  }

  return Math.floor(Math.random() * 16) & 0xf;
};

export const generateUUID = (): string => {
  if (typeof nodeRandomUUID === "function") {
    return nodeRandomUUID();
  }

  const webCrypto = getWebCrypto();
  if (webCrypto?.randomUUID) {
    return webCrypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const nibble = randomNibble();
    const value = char === "x" ? nibble : (nibble & 0x3) | 0x8;
    return value.toString(16);
  });
};
