export enum LOGIN_ERRORS {
    INCORRECT_CREDERNTIALS = 'incorrect_credentials',
    EMAIL_NOT_VERIFIED = 'email_not_verified',
    TOO_MANY_REQUESTS = 'too_many_requests',
    TOKEN_EXPIRED = 'token_expired',
    SOMETHING_WENT_WRONG = 'something_went_wrong',
}

export enum TOKEN_TYPE {
    RESET_PASSWORD = 'reset_password',
    EMAIL_VERIFICATION = 'email_verification',
}

export const PASSWORD_MIN_LENGTH = 6
