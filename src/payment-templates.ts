import {SaltedgePartnerClient, toQueryString} from "./saltedge-partner-client";

export class PaymentTemplates {
    private static readonly BASE_URL = '/partners/v1/payments/templates';

    constructor(private saltedgeClient: SaltedgePartnerClient) {
    }

    list(params: {
        from_id?: string;
        deprecated?: boolean;
    }) {
        let url = PaymentTemplates.BASE_URL;
        if (params) url += `?${toQueryString(params)}`;

        return this.saltedgeClient.get<PaymentTemplate[]>(url);
    }

    show(template_identifier: string) {
        return this.saltedgeClient.get<PaymentTemplate[]>(`${PaymentTemplates.BASE_URL}/${template_identifier}`);
    }
}

interface PaymentTemplate {
    /**
     * The id of the payment template
     */
    id: string;

    /**
     * Unique identifier of the payment template
     */
    identifier: string;

    /**
     * Additional information related to the template
     */
    description: string;

    /**
     * Whether the payment template is deprecated or not. Deprecated payment templates will be removed in the next API version.
     */
    deprecated: boolean;

    /**
     * Payment field objects
     */
    payment_fields: any[]; //TODO

    /**
     * Time and date when the payment template was added
     */
    created_at: string;

    /**
     *  The last time when any of the template’s attributes were changed
     */
    updated_at: string;
}

interface PaymentTemplateCommonAttributes {
    /**
     * An internal identifier used by the merchants and not accesible/visible to the end-user
     */
    end_to_end_id: string;

    /**
     * An external identifier which is visible to the end-user (e.g. tracking number, order number, bill number, etc)
     */
    reference?: string;

    /**
     * Time when the customer was last logged in (date-time)
     */
    customer_last_logged_at?: string;

    /**
     * IP address of the customer
     */
    customer_ip_address: string;

    /**
     * IP port of the customer
     */
    customer_ip_port?: string;

    /**
     * The operating system of the customer
     */
    customer_device_os?: string;

    /**
     * The user-agent of the customer
     */
    customer_user_agent?: string;

    /**
     * Defines the customer’s location
     */
    customer_latitude?: string;

    /**
     * Defines the customer’s location
     */
    customer_longitude?: string;

    /**
     * The full name of the debtor (payer)
     */
    debtor_name?: string;

    /**
     * The full address of the debtor
     */
    debtor_address?: string;

    /**
     * The street name of the debtor
     */
    debtor_street_name?: string;

    /**
     * The building number of the debtor
     */
    debtor_building_number?: string;

    /**
     * The post code of the debtor
     */
    debtor_post_code?: string;

    /**
     * The name of the town/city of the debtor
     */
    debtor_town?: string;

    /**
     * The name of the country/region of the debtor
     */
    debtor_region?: string;

    /**
     * The ISO code of the debtor’s country
     */
    debtor_country_code?: string;

    /**
     * The full name of the creditor (payee)
     */
    creditor_name: string;

    /**
     * The id of the creditor’s agent
     */
    creditor_agent?: string;

    /**
     * The name of the creditor’s agent
     */
    creditor_agent_name?: string;

    /**
     * The full address of the creditor
     */
    creditor_address?: string;

    /**
     * The street name of the creditor
     */
    creditor_street_name?: string;

    /**
     * The building number of the creditor
     */
    creditor_building_number?: string;

    /**
     * The post code of the creditor
     */
    creditor_post_code?: string;

    /**
     * The name of the town/city of the creditor
     */
    creditor_town?: string;

    /**
     * The name of the country/region of the creditor
     */
    creditor_region?: string;

    /**
     * The ISO code of the creditor’s country
     */
    creditor_country_code: string;

    /**
     * Payment amount in the specified currency
     */
    amount: string;

    /**
     * The unstructured description of the payment:
     * - Most ASPSPs have certain limitations in place when it comes to the formatting of the unstructured payment
     *   remittance information (description).
     * - Using alphanumeric characters along with ., ,, -, /, ?, (, ), +, ' and spaces as well as keeping the length of
     *   the description under 1000 characters should be a safe approach for most ASPSPs
     *   (RegExp /[A-Za-z0-9.-,()+'? ]{2,1000}/).
     * - ASPSPs may extend these constraints depending on their core banking system, payment schema and other relevant
     *   factors.
     */
    description: string

    /**
     * ISO 18245 purpose code
     */
    purpose_code?: string;

    /**
     *  The date when to execute the payment. Defaults to the current date.
     */
    date?: string;

    /**
     *  The precise time when to execute the payment. Defaults to the current time.
     */
    time?: string;
}

export type FasterPaymentAttributes = PaymentTemplateCommonAttributes & {
    /**
     * The currency of the payment. Defaults to GBP.
     */
    currency_code: string;

    /**
     * The debtor’s bank sort code
     */
    debtor_sort_code?: string;

    /**
     * The debtor’s bank account number
     */
    debtor_account_number?: string;

    /**
     * The creditor’s bank sort code
     */
    creditor_sort_code: string;

    /**
     * The creditor’s bank account number
     */
    creditor_account_number: string;
}

export type BACSAttributes = PaymentTemplateCommonAttributes & {
    /**
     * The currency of the payment. Defaults to GBP.
     */
    currency_code: string;

    /**
     * The debtor’s bank sort code
     */
    debtor_sort_code?: string;

    /**
     * The debtor’s bank account number
     */
    debtor_account_number?: string;

    /**
     * The creditor’s bank sort code
     */
    creditor_sort_code: string;

    /**
     * The creditor’s bank account number
     */
    creditor_account_number: string;
}

export type CHAPSAttributes = PaymentTemplateCommonAttributes & {
    /**
     * The currency of the payment. Defaults to GBP.
     */
    currency_code: string;

    /**
     * The debtor’s bank sort code
     */
    debtor_sort_code?: string;

    /**
     * The debtor’s bank account number
     */
    debtor_account_number?: string;

    /**
     * The creditor’s bank sort code
     */
    creditor_sort_code: string;

    /**
     * The creditor’s bank account number
     */
    creditor_account_number: string;
}

export type SEPAAttributes = PaymentTemplateCommonAttributes & {
    /**
     * The currency of the payment. Defaults to EUR.
     */
    currency_code: string;

    /**
     * The debtor’s IBAN
     */
    debtor_iban?: string;

    /**
     * The creditor’s IBAN
     */
    creditor_iban: string;

    /**
     * Possible values: CREDITOR, DEBTOR, SHARED. Defaults to SHARED.
     */
    charge_bearer: 'CREDITOR' | 'DEBTOR' | 'SHARED';
}

export type SEPAInstantAttributes = PaymentTemplateCommonAttributes & {
    /**
     * The currency of the payment. Defaults to EUR.
     */
    currency_code: string;

    /**
     * The debtor’s IBAN
     */
    debtor_iban?: string;

    /**
     * The creditor’s IBAN
     */
    creditor_iban: string;
}

export type DOMESTICAttributes = PaymentTemplateCommonAttributes & {
    /**
     * The currency of the payment.
     */
    currency_code: string;

    /**
     * The debtor’s IBAN
     */
    debtor_iban?: string;

    /**
     * The creditor’s IBAN
     */
    creditor_iban?: string;

    /**
     * The debtor’s BBAN
     */
    debtor_bban?: string;

    /**
     * The creditor’s BBAN
     */
    creditor_bban?: string;
}

export type SWIFTAttributes = PaymentTemplateCommonAttributes & {
    /**
     * The currency of the payment. Defaults to USD.
     */
    currency_code: string;

    /**
     * The creditor’s account number
     */
    creditor_account_number: string;

    /**
     * The creditor’s bank SWIFT code
     */
    creditor_bank_swift_code: string;

    /**
     * The creditor’s bank name
     */
    creditor_bank_name: string;

    /**
     * The creditor’s bank street name
     */
    creditor_bank_street_name: string;


    /**
     * The creditor’s bank building number
     */
    creditor_bank_building_number: string;

    /**
     * The creditor’s bank post code
     */
    creditor_bank_post_code: string;

    /**
     * The creditor’s bank town/city
     */
    creditor_bank_town: string;

    /**
     *The creditor’s bank ISO country code
     */
    creditor_bank_country_code: string;

    /**
     * Possible values: NORMAL, URGENT, SYSTEM. Defaults to NORMAL.
     */
    priority: string;

    /**
     * The correspondent’s account number
     */
    correspondent_account_number?: string;

    /**
     * The correspondent’s bank name
     */
    correspondent_bank_name?: string;

    /**
     * The correspondent’s bank full address
     */
    correspondent_bank_address?: string;

    /**
     * The creditor’s bank country/region
     */
    creditor_bank_region?: string;

    /**
     * The correspondent’s bank SWIFT code
     */
    correspondent_bank_swift_code?: string;

    /**
     * The creditor’s bank full address
     */
    creditor_bank_address?: string;

    /**
     * The debtor’s account number
     */
    debtor_account_number?: string;

    /**
     * Possible values: CREDITOR, DEBTOR, SHARED. Defaults to CREDITOR.
     */
    charge_bearer?: 'CREDITOR' | 'DEBTOR' | 'SHARED';
}

export type Target2Attributes = PaymentTemplateCommonAttributes & {
    /**
     * The currency of the payment. Defaults to EUR.
     */
    currency_code: string;

    /**
     * The debtor’s IBAN
     */
    debtor_iban?: string;

    /**
     * The creditor’s IBAN
     */
    creditor_iban: string;
}

export type HSVPAttributes = PaymentTemplateCommonAttributes & {
    /**
     * The currency of the payment. Defaults to EUR.
     */
    currency_code: string;

    /**
     * The debtor’s IBAN
     */
    debtor_iban?: string;

    /**
     * The creditor’s IBAN
     */
    creditor_iban: string;
}

export type ELIXIRAttributes = PaymentTemplateCommonAttributes & {
    /**
     * The currency of the payment. Defaults to PLN.
     */
    currency_code: string;

    /**
     * The debtor’s account number
     */
    debtor_account_number?: string;

    /**
     * The creditor’s account number
     */
    creditor_account_number: string;

    /**
     * Possible values: STANDARD, EXPRESS. Defaults to STANDARD.
     */
    mode: 'STANDARD' | 'EXPRESS';
}

export type BlueCashAttributes = PaymentTemplateCommonAttributes & {
    /**
     * The currency of the payment. Defaults to PLN.
     */
    currency_code: string;

    /**
     * The debtor’s bank account number
     */
    debtor_account_number?: string;

    /**
     *  The creditor’s bank account number
     */
    creditor_account_number: string;
}

export type SorbnetAttributes = PaymentTemplateCommonAttributes & {
    /**
     * The currency of the payment. Defaults to PLN.
     */
    currency_code: string;

    /**
     * The debtor’s bank account number
     */
    debtor_account_number?: string;

    /**
     *  The creditor’s bank account number
     */
    creditor_account_number: string;
}

export type Sorbnet2Attributes = PaymentTemplateCommonAttributes & {
    /**
     * The currency of the payment. Defaults to PLN.
     */
    currency_code: string;

    /**
     * The debtor’s bank account number
     */
    debtor_account_number?: string;

    /**
     *  The creditor’s bank account number
     */
    creditor_account_number: string;
}

export type VisaAttributes = PaymentTemplateCommonAttributes & {
    /**
     * The currency of the payment. Defaults to USD.
     */
    currency_code: string;

    /**
     * The debtor’s PAN
     */
    debtor_PAN?: string;

    /**
     * The creditor’s PAN
     */
    creditor_pan: string;
}

export type MastercardAttributes = PaymentTemplateCommonAttributes & {
    /**
     * The currency of the payment. Defaults to USD.
     */
    currency_code: string;

    /**
     * The debtor’s PAN
     */
    debtor_PAN?: string;

    /**
     * The creditor’s PAN
     */
    creditor_pan: string;
}
