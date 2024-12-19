/**
 * Generate a random secret key
 * @param {number} length - Length of the secret key (default: 10)
 * @returns {string} Generated secret key
 */
function generateSecretKey(length = 10) {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const punctuation = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
    const characters = letters + digits + punctuation;
    
    return Array.from(
        { length }, 
        () => characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');
}

/**
 * Generate a random secret key of variable length between 4 and 20 characters
 * @returns {string} Generated secret key
 */
function generateVariableLengthSecret() {
    const randomLength = Math.floor(Math.random() * (20 - 4 + 1)) + 4;
    return generateSecretKey(randomLength);
}

/**
 * Generates a simple 6-character secret key using only uppercase letters
 * @returns {string} Generated secret key
 */
function generateSimpleSecret() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return Array.from(
        { length: 6 }, 
        () => characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');
}

// Export the functions to be used in other files
export {
    generateSecretKey,
    generateVariableLengthSecret,
    generateSimpleSecret
};