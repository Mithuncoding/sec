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
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedText, key);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        if (!originalText) return "**DECRYPTION FAILED**";
        return originalText;
    } catch (e) {
        console.error("Decryption error:", e);
        return "**DECRYPTION FAILED**";
    }
};
