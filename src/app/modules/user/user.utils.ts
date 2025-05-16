import bcrypt from "bcrypt";
import config from "../../../config";

export const hashedPassword = async (password: string): Promise<string> => {
  try {
    const saltRounds = Number(config.bcrypt_salt_rounds);
    // console.log(" password:", password); 
    const hashedPassword: string = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
};
