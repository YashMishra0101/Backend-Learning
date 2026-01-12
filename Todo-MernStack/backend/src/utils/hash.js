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
- Security comes from time delay, not RAM usage (Memory-based protection = Argon2 feature, not bcrypt, Argon2 uses time + memory CPU + RAM), bcrypt only uses CPU time bcrypt based on time delay.
- During registration, cost factor is 2^12 = 4096 rounds same happens during login password verification.
-A bcrypt cost factor of 12 means the hashing algorithm performs 2¹² (4096) rounds of internal computation, making brute-force attacks exponentially more expensive and intentionally introducing a small delay during password verification. While this delay is barely noticeable for legitimate users who log in occasionally, it becomes extremely costly for attackers who attempt to test millions of password combinations.

5️⃣ Why bcrypt is slow on purpose
- Login attempts by real users are few (acceptable delay ~100–300ms)
- Attackers try millions of passwords
- Slow hashing makes brute-force attacks impractical

*/

// import bcrypt from "bcrypt";

// const COST_FACTOR = 12;

// export const hashPassword = (password) => {
//   // Generates salt automatically and hashes password using cost factor
//   return bcrypt.hash(password, COST_FACTOR);
// };

// export const comparePassword = async (password, hashedPassword) => {
//   // Extracts salt + cost factor from stored hash and compares securely
//   return bcrypt.compare(password, hashedPassword);
// };

/*
import argon2 from "argon2";

export const hashPassword = async (password) => {
  return await argon2.hash(password, {


    Industry standard → always use argon2id (Argon2d → fast, GPU-resistant, but unsafe against side-channel attacks, Agon2i → safe against side-channels, weaker vs GPUs, that's why argon2id combines both is safest and strongest)
    (A CPU is optimized for complex, sequential tasks and decision-making, whereas a GPU is optimized for executing the same simple operation across thousands of cores in parallel. Because brute-force attacks involve trying millions of password combinations using the same repeated computations, GPUs are far more efficient for this purpose than CPUs, which is why attackers commonly rely on GPUs for large-scale password-cracking attempts.)
    A side-channel attack is: Stealing secret information by observing how a system behaves, not by breaking the algorithm itself.
    Examples: Measuring execution time, Watching memory access patternsObserving CPU or cache behavior
    - If correct passwords take slightly longer to process, an attacker can guess information from timing differences, Argon2id protects against side-channel attacks by using data-independent memory access.


    type: argon2.argon2id,

    
    2 ** 16 = 65536 -> 65536 KB = 64 MB
    Argon2 must allocate 64 MB of RAM per hashing operation, when a user registers and  logs in.
    Attackers use GPUs because: GPUs are very fast and GPUs have limited memory per core, So Argon2 requires 64 MB per attempt:1 attempt → needs 64 MB so 1 million attempts → needs 64 TB of RAM ❌ So attackers cannot: run millions of guesses in parallel.
    For normal users Login attempt → uses 64 MB but normal user doesn’t notice.
    

    memoryCost: 2 ** 16,
    
 
    timeCost in Argon2 means how many times the password-hashing work is repeated. If timeCost is 3, Argon2 does the same work three times, one after another. Doing the work multiple times makes password hashing slower on purpose, which is good for security because attackers have to spend more time for every password they try. For normal users, this small delay is not noticeable, but for hackers trying thousands or millions of passwords, it becomes very slow and difficult.
    

    timeCost: 3,
    
    
    parallelism: 1 means Argon2 uses a single CPU thread to hash the password, ensuring controlled CPU usage and stable server performance.
    If you set the memory cost to 2**16, that means each hashing run uses 64 megabytes of memory. If you set the time cost to three, the hashing is performed three times. And if you set parallelism to two, then during each of those hashing runs, it uses two threads to do the work in parallel. So in short, three iterations of hashing, each using 64 MB of memory, and each iteration using two threads.  usage and stable server performance.
     
    parallelism: 2,
  });
};

Extracts the salt and parameters from the stored hash then Re-hashes the provided password with those same parameters then Compares the two hashes.

export const comparePassword = async (password, hashedPassword) => {
  return await argon2.verify(hashedPassword, password);
};

*/

import argon2 from "argon2";

export const hashPassword = async (password) => {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 2,
  });
};

export const comparePassword = async (password, hashedPassword) => {
  return await argon2.verify(hashedPassword, password);
};
