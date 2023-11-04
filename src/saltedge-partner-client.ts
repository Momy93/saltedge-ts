import {createHash, createSign} from 'crypto';
import axios, {AxiosHeaders, AxiosInstance, HttpStatusCode, InternalAxiosRequestConfig, isAxiosError} from "axios";
import {Providers} from "./providers";
import {EndpointResult, ResponseData} from "./result";
import {CryptographyClient} from "@azure/keyvault-keys";
import {PaymentTemplates} from "./payment-templates";

export class SaltedgePartnerClient {
    private readonly httpClient: AxiosInstance;
    readonly providers: Providers;
    readonly paymentTemplates: PaymentTemplates;

    constructor(private appId: string, private secret: string, private signer?: Signer) {
        this.httpClient = axios.create({
            baseURL: 'https://www.saltedge.com/api',
            headers: {
                'App-id': this.appId,
                'Secret': this.secret,
            }
        });
        this.httpClient.interceptors.request.use(this.signRequest.bind(this), function (error) {
            return Promise.reject(error);
        });

        this.providers = new Providers(this);
        this.paymentTemplates = new PaymentTemplates(this);
    }

    async signRequest(req: InternalAxiosRequestConfig) {
        if (this.signer) {
            const signature = await this.createSignatureHeaders(
                `${req.baseURL}${req.url}`,
                req.method!.toUpperCase(),
                req.data
            );
            if (!req.headers) {
                req.headers = new AxiosHeaders();
            }
            req.headers.set('Expires-At', signature.expiresAt);
            req.headers.set('Signature', signature.value);
        }
        return req;
    }

    async createSignatureHeaders(
        url: string,
        requestMethod: string,
        postBody?: Record<string, unknown>
    ): Promise<{ expiresAt: string, value: string }> {
        if (!this.signer) throw new Error('Signer is required');
        const expiresAt = Math.round((new Date(new Date().getTime() + 70000).getTime()) / 1000);
        const data = `${expiresAt}|${requestMethod}|${url}|${postBody ? `${JSON.stringify(postBody)}` : ''}`;

        return {
            expiresAt: expiresAt.toString(),
            value: await this.signer.sign(data),
        };
    }

    async get<T>(url: string): Promise<EndpointResult<T>> {
        try {
            const response = await this.httpClient.get<ResponseData<T>>(url);
            return {
                isOk: true,
                value: response.data,
            };
        } catch (error) {
            return this.parseError(error)
        }
    }

    async post<T>(url: string, body: unknown): Promise<EndpointResult<T>> {
        try {
            const response = await this.httpClient.post<ResponseData<T>>(url, body);
            return {
                isOk: true,
                value: response.data
            }
        } catch (error) {
            return this.parseError(error)
        }
    }

    async delete<T>(url: string): Promise<EndpointResult<T>> {
        try {
            const response = await this.httpClient.delete<ResponseData<T>>(url);
            return {
                isOk: true,
                value: response.data
            }
        } catch (error) {
            return this.parseError(error)
        }
    }

    parseError<T>(error): EndpointResult<T> {
        let specificError = error;
        if (isAxiosError(error)) {
            switch (error.response?.status) {
                case HttpStatusCode.BadRequest:
                case HttpStatusCode.NotFound:
                case HttpStatusCode.NotAcceptable:
                case HttpStatusCode.Conflict:
                    specificError = error.response?.data.error;
            }
        }
        return {
            isErr: true,
            error: specificError,
        }
    }
}

export interface Signer {
    sign(data: string): Promise<string> | string;
}

export class AKVSigner implements Signer {
    constructor(private cryptographyClient: CryptographyClient) {
    }

    async sign(data: string): Promise<string> {
        const hash = createHash('sha256');
        const digest = hash.update(data).digest();

        const signResult = await this.cryptographyClient.sign('RS256', digest);
        return Buffer.from(signResult.result).toString('base64');
    }
}

export class NodeSigner implements Signer {
    constructor(private privateKey: string | Buffer, private passphrase?: string) {
    }

    sign(data: string): Promise<string> | string {
        const sign = createSign('sha256');
        sign.update(data);
        return sign.sign({
            key: this.privateKey,
            passphrase: this.passphrase,
        }, "base64");
    }
}

export function toQueryString(params: object) {
    const urlParams = new URLSearchParams();
    for (const key of Object.keys(params)) urlParams.set(key, `${params[key]}`);
    return `${urlParams}`;
}
