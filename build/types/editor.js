"use strict";
// Типы данных для редактора Редактус
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_CODES = exports.EditorAPIError = void 0;
// Ошибки API
class EditorAPIError extends Error {
    constructor(code, message, statusCode = 500, details) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'EditorAPIError';
    }
}
exports.EditorAPIError = EditorAPIError;
exports.ERROR_CODES = {
    PAGE_NOT_FOUND: 'PAGE_NOT_FOUND',
    COMPONENT_NOT_FOUND: 'COMPONENT_NOT_FOUND',
    INVALID_REQUEST: 'INVALID_REQUEST',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    SLUG_ALREADY_EXISTS: 'SLUG_ALREADY_EXISTS',
    INVALID_COMPONENT_TYPE: 'INVALID_COMPONENT_TYPE',
};
