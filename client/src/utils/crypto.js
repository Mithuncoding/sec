// Simple simulation of AES Encryption for the demo
// In a real app, use 'crypto-js' or Web Crypto API

export const encryptMessage = (text, key = 'secret-key') => {
    // Simulate encryption by base64 encoding and reversing (just for visual effect)
    // Real AES would be: CryptoJS.AES.encrypt(text, key).toString();
    const b64 = btoa(text);
    return b64.split('').reverse().join('');
};

export const decryptMessage = (encryptedText, key = 'secret-key') => {
    try {
        const reversed = encryptedText.split('').reverse().join('');
        return atob(reversed);
    } catch (e) {
        return "**DECRYPTION FAILED**";
    }
};
