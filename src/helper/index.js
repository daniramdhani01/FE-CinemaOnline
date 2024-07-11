import CryptoJS from "crypto-js"
const salt = "Bismillah!"

export const _doEncryptObj = (obj) => {
    const dataEncrypt = CryptoJS.AES.encrypt(JSON.stringify(obj), salt).toString();
    return dataEncrypt;
};

export const _doDecryptObj = (data) => {
    if (data != null) {
        const decryptedData = CryptoJS.AES.decrypt(data, salt).toString(CryptoJS.enc.Utf8);
        return decryptedData;
    } else {
        return false;
    }
};

export const setLocalStorage = (name, value)=>{
    const secret = _doEncryptObj(value);
    localStorage.setItem(name, secret);
}

export const getLocalStorage = (name, key = "")=>{
    if (localStorage.getItem(name) !== undefined) {
        const bytes = _doDecryptObj(localStorage.getItem(name));
        const decryptedData = JSON.parse(bytes);
        if (key !== "") {
            return decryptedData[key];
        } else {
            return decryptedData;
        }
        }
    return null;
}