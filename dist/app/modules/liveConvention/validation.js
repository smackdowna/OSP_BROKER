"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = exports.isRequiredAllOrNone = exports.isBetween = exports.inNumberArray = void 0;
const isValidationError = (value) => typeof (value === null || value === void 0 ? void 0 : value.property) !== 'undefined' && typeof (value === null || value === void 0 ? void 0 : value.reason) !== 'undefined';
/* CURRIED VALIDATORS */
const inNumberArray = (allowedNumbers) => (property, value) => {
    if (typeof value === 'undefined')
        return undefined;
    if (typeof value !== 'number' || isNaN(value)) {
        return {
            property,
            reason: `Value ${value} not allowed, must be of type number`
        };
    }
    if (!allowedNumbers.includes(value)) {
        return {
            property,
            reason: `Value is not valid. Got ${value}, expected ${allowedNumbers}`
        };
    }
    return undefined;
};
exports.inNumberArray = inNumberArray;
const isBetween = (min, max) => (property, value) => {
    if (typeof value === 'undefined')
        return undefined;
    if (typeof value !== 'number' || isNaN(value)) {
        return {
            property,
            reason: `Value ${value} not allowed, must be of type number`
        };
    }
    if (value < min || value > max) {
        return {
            property,
            reason: `Value must in between ${min} and ${max}`
        };
    }
    return undefined;
};
exports.isBetween = isBetween;
const isRequiredAllOrNone = (requiredKeys) => (body) => {
    const presentKeys = Object.keys(body).filter((x) => typeof body[x] !== 'undefined');
    const isValid = requiredKeys.every((x) => presentKeys.includes(x)) ||
        requiredKeys.every((x) => !presentKeys.includes(x));
    if (!isValid) {
        return {
            property: '$schema',
            reason: `If one of the following properties is present, all or none must be present: ${requiredKeys.join(', ')}`
        };
    }
    return undefined;
};
exports.isRequiredAllOrNone = isRequiredAllOrNone;
/* VALIDATION RUNNER */
const validateRequest = (body, propertyValidator, schemaValidator) => {
    const schemaValidations = schemaValidator.map((validator) => validator === null || validator === void 0 ? void 0 : validator(body));
    const propValidations = Object.keys(propertyValidator).flatMap((property) => {
        const value = body === null || body === void 0 ? void 0 : body[property];
        const func = propertyValidator[property];
        if (!func)
            return [];
        const validations = Array.isArray(func)
            ? func.map((f) => f(property, value))
            : func(property, value);
        return Array.isArray(validations) ? validations : [validations];
    });
    return schemaValidations.concat(propValidations).filter(isValidationError);
};
exports.validateRequest = validateRequest;
