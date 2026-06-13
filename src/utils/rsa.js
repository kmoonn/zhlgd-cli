import forge from 'node-forge';

/**
 * RSA PKCS1 v1.5 加密（与 Python Crypto.Cipher.PKCS1_v1_5 对齐）
 * @param {string} plaintext - 明文
 * @param {string} publicKeyB64 - Base64 编码的 RSA 公钥（不含头尾）
 * @returns {string} Base64 编码的密文
 */
export function rsaEncrypt(plaintext, publicKeyB64) {
    const pubKeyPem = [
        '-----BEGIN PUBLIC KEY-----',
        publicKeyB64,
        '-----END PUBLIC KEY-----',
    ].join('\n');

    const publicKey = forge.pki.publicKeyFromPem(pubKeyPem);

    const encrypted = publicKey.encrypt(plaintext, 'RSAES-PKCS1-V1_5');
    return forge.util.encode64(encrypted);
}
