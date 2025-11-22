import CryptoJS from "crypto-js"

// Dynamic salt generation with fallback to environment variable
const getEncryptionSalt = () => {
    // Try to get from environment first, fallback to dynamic generation
    if (process.env.REACT_APP_ENCRYPTION_KEY) {
        return process.env.REACT_APP_ENCRYPTION_KEY;
    }

    // Generate device-specific salt if not in environment
    const deviceSaltKey = "CINEMA_APP_SALT";
    let existingSalt = localStorage.getItem(deviceSaltKey);

    if (!existingSalt) {
        existingSalt = CryptoJS.lib.WordArray.random(256/8).toString();
        localStorage.setItem(deviceSaltKey, existingSalt);
    }

    return existingSalt;
};

export const _doEncryptObj = (obj) => {
    const dataEncrypt = CryptoJS.AES.encrypt(JSON.stringify(obj), getEncryptionSalt()).toString();
    return dataEncrypt;
};

export const _doDecryptObj = (data) => {
    if (data != null) {
        const decryptedData = CryptoJS.AES.decrypt(data, getEncryptionSalt()).toString(CryptoJS.enc.Utf8);
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

// Security utilities
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;

    // Remove script tags and potentially dangerous content
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
};

export const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Rate limiting for login attempts
let loginAttempts = 0;
let lastFailedAttempt = 0;

export const checkRateLimit = () => {
    const now = Date.now();
    const cooldownPeriod = 30000; // 30 seconds

    // Reset attempts if cooldown period has passed
    if (now - lastFailedAttempt > cooldownPeriod) {
        loginAttempts = 0;
    }

    if (loginAttempts >= 5) {
        const remainingTime = Math.ceil((cooldownPeriod - (now - lastFailedAttempt)) / 1000);
        return {
            allowed: false,
            message: `Too many failed attempts. Please try again in ${remainingTime} seconds.`
        };
    }

    return { allowed: true };
};

export const recordFailedLogin = () => {
    loginAttempts++;
    lastFailedAttempt = Date.now();
};

export const recordSuccessfulLogin = () => {
    loginAttempts = 0;
    lastFailedAttempt = 0;
};