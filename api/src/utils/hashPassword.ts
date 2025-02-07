import { pbkdf2Sync, randomBytes } from "crypto";

export const hashPassword = (
  password: string,
  salt = randomBytes(1000).toString("hex")
): [salt: string, hash: string] => {
  const passwordHash = pbkdf2Sync(password, salt, 100000, 16, "sha512");
  return [passwordHash.toString("hex"), salt];
};
