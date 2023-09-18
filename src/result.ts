import {AxiosError} from "axios";

export type Result<E, V> = {
    isErr: true
    error: E;
} | {
    isOk: true;
    value: V;
};

interface SaltedgeError {
    error_message: string;
    request: Record<string, unknown>;
}

interface PartnerPaymentError extends SaltedgeError {
    error_class: 'ExecutionTimeout'
        | 'InteractiveAdapterTimeout'
        | 'InvalidCredentials'
        | 'InvalidInteractiveCredentials'
        | 'PaymentFailed'
        | 'PaymentStatusUnknown'
        | 'PaymentValidationError'
        | 'ProviderError'
        | 'ActionNotSupported'
        | 'CertificateNotFound'
        | 'CustomFieldsFormatInvalid'
        | 'CustomFieldsSizeTooBig'
        | 'CustomerLocked'
        | 'CustomerNotFound'
        | 'DateFormatInvalid'
        | 'DateOutOfRange'
        | 'IdentifierInvalid'
        | 'InvalidPaymentAttributes'
        | 'PaymentAlreadyAuthorized'
        | 'PaymentAlreadyFinished'
        | 'PaymentAlreadyStarted'
        | 'PaymentAttributeNotSet'
        | 'PaymentInitiationTimeout'
        | 'PaymentNotFinished'
        | 'PaymentNotFound'
        | 'PaymentTemplateNotFound'
        | 'PaymentTemplateNotSupported'
        | 'ProviderDisabled'
        | 'ProviderInactive'
        | 'ProviderKeyNotFound'
        | 'ProviderNotFound'
        | 'ProviderUnavailable'
        | 'ReturnURLInvalid'
        | 'ReturnURLTooLong'
        | 'ValueOutOfRange'
        | 'WrongProviderMode'
        | 'WrongRequestFormat'
        | 'ActionNotAllowed'
        | 'ApiKeyNotFound'
        | 'AppIdNotProvided'
        | 'ClientDisabled'
        | 'ClientNotFound'
        | 'ClientPending'
        | 'ClientRestricted'
        | 'ConnectionFailed'
        | 'ConnectionLost'
        | 'ExpiresAtInvalid'
        | 'InternalServerError'
        | 'InvalidEncoding'
        | 'JsonParseError'
        | 'MissingExpiresAt'
        | 'MissingSignature'
        | 'PaymentLimitReached'
        | 'PaymentSettingsExceeded'
        | 'PublicKeyNotProvided'
        | 'RateLimitExceeded'
        | 'RequestExpired'
        | 'SecretNotProvided'
        | 'SignatureNotMatch'
        | 'TooManyRequests';
}

export interface ResponseData<D> {
    data: D;
    meta?: {
        next_id?: string | null;
        next_page?: string | null;
    };
}

export type EndpointResult<D> = Result<PartnerPaymentError | AxiosError, ResponseData<D>>
