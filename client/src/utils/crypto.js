import CryptoJS from 'crypto-js';

// Real AES Encryption using crypto-js
export const encryptMessage = (text, key = 'secret-key') => {
    try {
        return CryptoJS.AES.encrypt(text, key).toString();
    } catch (e) {
        console.error("Encryption error:", e);
        return text;
    }
};

export const decryptMessage = (encryptedText, key = 'secret-key') => {
    if (!encryptedText || typeof encryptedText !== 'string') return "";
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedText, key);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        // If decryption results in empty string (often means wrong key or bad format), return original
        if (!originalText) return encryptedText; 
        return originalText;
    } catch (e) {
        console.warn("Decryption failed, returning raw text:", e);
        return encryptedText; // Fallback to showing the raw text instead of crashing
    }
};
