const encoder = new TextEncoder();

const toBase64Url = (bytes: Uint8Array): string =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

export const generateCodeVerifier = (): string => {
  const random = crypto.getRandomValues(new Uint8Array(32));
  return toBase64Url(random);
};

export const generateCodeChallenge = async (
  codeVerifier: string
): Promise<string> => {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(codeVerifier));
  return toBase64Url(new Uint8Array(digest));
};
