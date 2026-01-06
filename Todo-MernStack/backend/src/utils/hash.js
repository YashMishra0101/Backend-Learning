/*
📌 bcrypt – Important Notes (Industry-Level)

1️⃣ Hash Length
A bcrypt hash is always exactly 60 characters long.
- No less
- No more
- Always 60
This is independent of:
- password length
- cost factor (often incorrectly called salt rounds)

2️⃣ What bcrypt is
bcrypt is a password hashing algorithm based on the Blowfish key-expansion function.
It is:
- One-way (cannot be decrypted)
- Designed specifically for password storage
- Intentionally slow to resist brute-force attacks

3️⃣ Salt in bcrypt
bcrypt automatically generates a cryptographically secure random salt using
operating-system-level CSPRNG (Cryptographically Secure Random Number Generator).

A cryptographically secure random number generator (CSPRNG) produces unpredictable random values suitable for security-sensitive operations such as password salts, authentication tokens, session IDs, and encryption keys. The randomness comes from the operating system, which gathers entropy from multiple unpredictable sources such as keyboard timing, mouse movements, disk I/O timings, network interrupts, and CPU noise.

Important:
- Salt is NOT provided manually
- Salt is NOT secret
- Salt is embedded inside the final hash string
- Salt generation is independent of the cost factor

4️⃣ Cost Factor (❗ commonly misnamed as SALT_ROUNDS)
The cost factor controls how many hashing iterations bcrypt performs.

Formula:
Number of hashing rounds = 2 ^ costFactor

Practical industry recommendations:

2^8  = 256   → ❌ Avoid (too fast, weak against modern hardware)
2^10 = 1024  → ✅ Acceptable minimum for most applications
2^12 = 4096  → ⭐ Best balance of security & performance (recommended)
2^14 = 16384 → ⚠️ Very secure but slow (use only for high-security, low-traffic systems)

Note:
- Cost factor affects hashing time, means 10 means 1024 hashing , NOT hash length
- Higher cost = slower hashing = stronger security
- Security comes from time delay, not RAM usage (Memory-based protection = Argon2 feature, not bcrypt, Argon2 uses time + memory CPU + RAM)

5️⃣ Why bcrypt is slow on purpose
- Login attempts by real users are few (acceptable delay ~100–300ms)
- Attackers try millions of passwords
- Slow hashing makes brute-force attacks impractical

*/

/*
import bcrypt from "bcrypt";

const COST_FACTOR = 12;

export const hashPassword = (password) => {
  // Generates salt automatically and hashes password using cost factor
  return bcrypt.hash(password, COST_FACTOR);
};

export const comparePassword = async (password, hashedPassword) => {
  // Extracts salt + cost factor from stored hash and compares securely
  return bcrypt.compare(password, hashedPassword);
};

*/



import argon2 from "argon2"; 

export const hashPassword = async (password) => {
  return await argon2.hash(password, {
    // ----------------------------------------------------------
    // type: argon2.argon2id
    // ----------------------------------------------------------
    // Chooses the Argon2 variant.
    // argon2id is recommended because:
    // - It is resistant to GPU-based brute-force attacks
    // - It is safe against side-channel attacks
    // This is the industry-standard choice for password hashing.
    // ----------------------------------------------------------
    type: argon2.argon2id,

    // ----------------------------------------------------------
    // memoryCost: 2 ** 16
    // ----------------------------------------------------------
    // Defines how much memory Argon2 must use PER HASH ATTEMPT.
    // 2^16 = 65536 KB = 64 MB RAM.
    //
    // This memory is required:
    // - During registration
    // - During every login password verification
    //
    // Purpose:
    // - Makes GPU and parallel attacks extremely expensive
    // - Attackers cannot scale easily because memory is costly
    // ----------------------------------------------------------
    memoryCost: 2 ** 16,

    // ----------------------------------------------------------
    // timeCost: 3
    // ----------------------------------------------------------
    // Number of SEQUENTIAL PASSES Argon2 performs over the memory.
    // This is NOT like bcrypt's 2^n rounds.
    //
    // timeCost = 3 means:
    // - Argon2 processes the same 64 MB memory 3 times
    // - Each pass increases CPU work and security
    //
    // More timeCost = slower hashing = stronger protection
    // 3 is a balanced, production-safe default.
    // ----------------------------------------------------------
    timeCost: 3,

    // ----------------------------------------------------------
    // parallelism: 1
    // ----------------------------------------------------------
    // Number of CPU threads used AT THE SAME TIME per hash.
    //
    // parallelism = 1 means:
    // - Hashing runs on a single thread
    // - timeCost iterations happen sequentially on that one thread
    //
    // This prevents:
    // - CPU spikes
    // - Server overload during high traffic
    //
    // Recommended value for backend APIs.
    // ----------------------------------------------------------
    parallelism: 1,
  });
};

// ============================================================
// comparePassword
// ------------------------------------------------------------
// Used during USER LOGIN.
// Verifies whether the entered password matches the stored hash.
// ============================================================
export const comparePassword = async (password, hashedPassword) => {
  // ----------------------------------------------------------
  // argon2.verify(storedHash, plainPassword)
  // ----------------------------------------------------------
  // Order matters:
  // - First argument: hashed password from database
  // - Second argument: user-entered plain password
  //
  // Internally, Argon2:
  // - Extracts salt from the stored hash
  // - Reads memoryCost, timeCost, parallelism
  // - Re-hashes the entered password using SAME parameters
  // - Compares the results securely
  //
  // Returns:
  // - true  → password is correct
  // - false → password is incorrect
  // ----------------------------------------------------------
  return await argon2.verify(hashedPassword, password);
};

