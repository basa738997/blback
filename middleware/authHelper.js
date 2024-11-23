import bcrypt from "bcrypt";
export const hashPassword = async (password) => {
  try {
    const saltRounds = 15;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: error.message, error });
  }
};

export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
