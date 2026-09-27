
const sanitizeResponse = (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = function(data) {
        const sanitized = sanitizeData(data);
        return originalJson(sanitized);
    };

    next();
};


const sensitiveFields = [
    'password',
    'passwordResetCode',
    'passwordResetExpires',
    'verificationCode',
    'verificationCodeExpires',
    'passwordChangedAt',
    'resetverified',
    '__v'
];


const mongooseInternalFields = [
    '$__',
    '$isNew',
    '_doc'
];


const cleanObject = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;

    // Use toObject() if available, otherwise serialize to plain JSON object first to convert ObjectIds to strings properly
    let cleaned;
    if (typeof obj.toObject === 'function') {
        cleaned = obj.toObject({ getters: true });
    } else {
        cleaned = JSON.parse(JSON.stringify(obj));
    }

    // Convert _id to string if it's an object/buffer
    if (cleaned._id && typeof cleaned._id === 'object') {
        cleaned._id = cleaned._id.toString();
    }

    // Remove sensitive fields
    sensitiveFields.forEach(field => {
        delete cleaned[field];
    });

    // Remove Mongoose internal fields
    mongooseInternalFields.forEach(field => {
        delete cleaned[field];
    });

    // Recursively clean nested objects/arrays
    Object.keys(cleaned).forEach(key => {
        if (cleaned[key] && typeof cleaned[key] === 'object') {
            if (Array.isArray(cleaned[key])) {
                cleaned[key] = cleaned[key].map(item => cleanObject(item));
            } else if (cleaned[key] instanceof Date) {
                cleaned[key] = cleaned[key];
            } else {
                cleaned[key] = cleanObject(cleaned[key]);
            }
        }
    });

    return cleaned;
};

/**
 * Recursively sanitize data structure
 */
const sanitizeData = (data) => {
    if (!data) return data;

    // Handle the response wrapper structure
    if (data.success !== undefined) {
        const sanitized = { ...data };

        // Clean the data field if it exists
        if (sanitized.data) {
            if (Array.isArray(sanitized.data)) {
                sanitized.data = sanitized.data.map(item => cleanObject(item));
            } else {
                sanitized.data = cleanObject(sanitized.data);
            }
        }

        // Clean any user field if it exists
        if (sanitized.user) {
            sanitized.user = cleanObject(sanitized.user);
        }

        return sanitized;
    }

    // Handle arrays directly
    if (Array.isArray(data)) {
        return data.map(item => cleanObject(item));
    }

    // Handle single object
    return cleanObject(data);
};

/**
 * Alternative: Use as Mongoose schema method (add to user.js)
 * This approach is cleaner and more efficient
 */
const setupUserTransform = (userSchema) => {
    // Override toJSON to automatically clean when converting to JSON
    userSchema.set('toJSON', {
        transform: function(doc, ret, options) {
            // Remove sensitive fields
            delete ret.password;
            delete ret.passwordResetCode;
            delete ret.passwordResetExpires;
            delete ret.verificationCode;
            delete ret.verificationCodeExpires;
            delete ret.passwordChangedAt;
            delete ret.resetverified;
            delete ret.__v;
            delete ret._id;

            return ret;
        }
    });

    // Also override toObject for consistency
    userSchema.set('toObject', {
        transform: function(doc, ret, options) {
            delete ret.password;
            delete ret.passwordResetCode;
            delete ret.passwordResetExpires;
            delete ret.verificationCode;
            delete ret.verificationCodeExpires;
            delete ret.passwordChangedAt;
            delete ret.resetverified;
            delete ret.__v;
            delete ret._id;

            return ret;
        }
    });
};

module.exports = {
    sanitizeResponse,
    setupUserTransform
};