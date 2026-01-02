// import bcrypt from "bcrypt";

// const SALT_ROUNDS = 10;

// export const hashPassword = (password) => {
//   return bcrypt.hash(password, SALT_ROUNDS);
// };

// export const comparePassword = async (password, hashedPassword) => {
//   return await bcrypt.compare(password, hashedPassword);
// };


import argon2 from "argon2";

// * - Automatically generates and stores salt inside the hash we don't need to add salt manually

export const hashPassword = async (password) => {
  return await argon2.hash(password, {
    type: argon2.argon2id, // Best variant: protects against GPU & side-channel attacks
    memoryCost: 2 ** 16,   // Amount of memory used (64 MB) → makes brute-force expensive
    timeCost: 3,           // Number of iterations (higher = slower but more secure)
    parallelism: 1,        // Number of threads (1 is enough for most APIs)
  });
};


export const comparePassword = async (password, hashedPassword) => {
  return await argon2.verify(hashedPassword, password); //first hashedPassword then password this is the syntax opposite of bcrypt
};
