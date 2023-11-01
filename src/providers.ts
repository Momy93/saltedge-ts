import {SaltedgePartnerClient, toQueryString} from "./saltedge-partner-client";

export class Providers {
    private static readonly BASE_URL = '/partners/v1/providers';

    constructor(private saltedgeClient: SaltedgePartnerClient) {
    }

    async list(params?: {
        from_id?: string;
        from_date?: string;
        country_code?: string;
        mode?: 'oauth' | 'web' | 'api' | 'file';
        include_fake_providers?: boolean;
        include_payments_fields?: boolean;
    }) {
        let url = Providers.BASE_URL;
        if (params) url += `?${toQueryString(params)}`;

        return this.saltedgeClient.get<Provider[]>(url);
    }

    async show(providerCode: string, params?: {
        include_payments_fields?: boolean
    }) {
        let url = `${Providers.BASE_URL}/${providerCode}`;
        if (!!params?.include_payments_fields) url += `?include_payments_fields=${params.include_payments_fields}`;
        return this.saltedgeClient.get<Provider>(url);
    }
}


/**
 * A provider is a Financial Institution which can execute payments. We recommend you update all the providers’ fields
 * at least daily.
 */
export interface Provider {
    /**
     *  Provider’s id
     */
    id: string;

    /**
     *  Provider’s code
     */
    code: string;

    /**
     *  Provider’s code
     */
    name: string;

    /**
     * Possible values are:
     *
     * - oauth: access through the bank’s dedicated API (regulated: true). The user is redirected to the bank’s page for
     *          authorization.
     * - api: access through a dedicated (regulated: true) or non-dedicated (regulated: false) bank’s API. Some required
     *        credentials fields might be present which the user should complete (IBAN, username, etc.). In case of a
     *        dedicated API, an interactive redirect might be present, but there are required credentials fields which
     *        the user should complete (IBAN, username, etc.). Using these credentials, we authorize the user on the
     *        bank’s side.
     */
    modes: 'oauth' | 'api';

    /**
     * The providers with the inactive status are returned on the providers list endpoint, but are not visible on the
     * Connect widget for the end-users.
     * The providers with disabled status are neither returned on the providers list endpoint, nor visible on the
     * Connect widget for the end-users.
     */
    status: 'active' | 'inactive' | 'disabled';

    /**
     * Whether the provider’s connections can be automatically fetched. However, its performance also depends on
     * optional_interactivity flag
     */
    automatic_fetch: boolean;

    /**
     * Whether the provider will notify the customer on log in attempt
     */
    customer_notified_on_sign_in: boolean;

    /**
     * Whether the provider requires interactive input
     */
    interactive: boolean;

    /**
     * Instructions on how to connect the bank, in English
     */
    instruction: string;

    /**
     * The URL of the main page of the provider
     */
    home_url: string;

    /**
     * Point of entrance to provider’s login web interface
     */
    login_url: string;

    /**
     * The URL for the provider logo, may have a placeholder for providers with missing logos
     */
    logo_url: string;

    /**
     * Code of the provider’s country
     */
    country_code: string;

    /**
     * Amount of time (in minutes) after which the provider’s connections are allowed to be refreshed
     */
    refresh_timeout: number;

    /**
     * Contains information on the account holder details that can be fetched from this provider
     */
    holder_info: ('names' | 'emails' | 'phone_numbers') [];

    /**
     * Maximum allowed consent duration. If it is null then there are no limits
     */
    max_consent_days: number | null;

    /**
     * Time and date when the provider was integrated
     */
    created_at: string;

    /**
     * The last time when any of provider’s attributes were changed
     */
    updated_at: string;

    /**
     * Time zone data of capital/major city in a region corresponding to a provider.
     */
    timezone: string;

    /**
     * Delay in seconds before InteractiveAdapterTimeout will happen
     */
    max_interactive_delay: number;

    /**
     * Provider which supports flipping of interactive and automatic_fetch flags after connect
     */
    optional_interactivity: boolean;

    /**
     * Whether the provider is integrated via a regulated channel under Open Banking/PSD2
     */
    regulated: boolean;

    /**
     * Max period in days that can be fetched form from the provider’s interface
     */
    max_fetch_interval: number;

    /**
     * Array of strings with supported fetch_scopes
     */
    supported_fetch_scopes: ('accounts' | 'accounts_without_balance' | 'holder_info' | 'transactions')[];

    /**
     * Array of possible account extra fields to be fetched
     */
    supported_account_extra_fields: Array<keyof AccountExtra>;

    /**
     * Array of possible transaction extra fields to be fetched
     */
    supported_transaction_extra_fields: Array<keyof TransactionExtra>;

    /**
     * Array of possible account natures to be fetched. Non-payment natures: bonus, credit, insurance, investment
     */
    supported_account_natures: 'account' | 'bonus' | 'card' | 'checking' | 'credit' | 'credit_card' | 'debit_card'
        | 'ewallet' | 'insurance' | 'investment' | 'loan' | 'mortgage' | 'savings';

    /**
     * Possible values are: personal, business
     */
    supported_account_types: ('personal' | 'business') [];

    /**
     * List of codes identifying supported branches of a specific provider. It may include BLZ(Germany), ABI+CAB(Italy),
     * Branch Codes(France) etc.
     */
    identification_codes: string[];

    /**
     * List of BIC codes identifying supported branches of a specific provider.
     */
    bic_codes: string[];

    /**
     * Possible values are: true, false
     */
    supported_iframe_embedding: boolean;

    /**
     * Identifiers of the payment templates that are supported by this provider
     */
    payment_templates: string[];

    /**
     * If these fields are passed, they will be used by the provider. Otherwise, the payment will we processed even
     * without them
     */
    supported_payment_fields: Record<string, unknown>[];

    /**
     * Mandatory payment attributes. If any of these fields are not passed, the payment will not be initiated
     * successfully.
     */
    required_payment_fields: Record<string, unknown>;

    /**
     * A flag which indicates whether the bank supports explicit handling of payment rejection due to insufficient
     * funds.
     * For example, it can be a header in the request (TPP-Rejection-NoFunds-Preferred) which set to true will
     * automatically reject the payment in case of insufficient funds. Note that many banks handle this behaviour by
     * default, but some of them offer the possibility to choose the outcome of insufficient funds.
     */
    no_funds_rejection_supported: boolean;
}

interface TransactionExtra {
    /**
     * The balance of the account at the moment of the attempt when the transaction was imported
     */
    account_balance_snapshot?: number;

    /**
     * Number of the account the transaction belongs to
     */
    account_number?: string;

    /**
     * Additional information (recommended to use in concatenation with original description, if present)
     */
    additional?: string;

    /**
     * Original transaction amount in asset units
     */
    asset_amount?: number;

    /**
     * Asset common used abbreviation (Ex.: BTC - Bitcoin, XAU - Gold etc.)
     */
    asset_code?: string;

    /**
     * Value from 0 to 1, the probability that the current category is the correct one
     */
    categorization_confidence?: number;

    /**
     * Payee’s transaction check number
     */
    check_number?: string;

    /**
     * Account balance after the transaction has been made
     */
    closing_balance?: number;

    /**
     * Payment reference for cashless domestic payments (transfers)
     */
    constant_code?: string;

    /**
     * Whether the transaction amount was converted using exchange rates or not
     */
    convert?: boolean;

    /**
     * The category (present in categories list) that was categorized by the rules created by the customer
     */
    customer_category_code?: string;

    /**
     * The category (not present in categories list) that was categorized by the rules created by the customer
     */
    customer_category_name?: string;

    /**
     * The exchange rate that was applied to the converted transaction
     */
    exchange_rate?: number;

    /**
     * Transaction’s identifier on the bank’s end (do not confuse it with Salt Edge transaction id)
     */
    id?: string;

    /**
     * A unique identifier set by the merchant. Usually used for reconciliation.
     */
    end_to_end_id?: string;

    /**
     * Information about the transaction
     */
    information?: string;

    /**
     * The transaction’s Merchant Category Code
     */
    mcc?: string;

    /**
     * Merchant identifier
     */
    merchant_id?: string;

    /**
     * Account balance before the transaction has been made
     */
    opening_balance?: number;

    /**
     * Amount of the total installment transactions group
     */
    installment_debt_amount?: number;

    /**
     * Native amount of the transaction in transaction’s currency (comes with original_currency_code)
     */
    original_amount?: number;

    /**
     * The original category of the transaction
     */
    original_category?: string;

    /**
     * Native currency of the transaction (comes with original_amount)
     */
    original_currency_code?: string;

    /**
     * The original subcategory of the transaction
     */
    original_subcategory?: string;

    /**
     * To whom money is paid
     */
    payee?: string;

    /**
     * Additional payee information
     */
    payee_information?: string;

    /**
     * Who paid the money
     */
    payer?: string;

    /**
     * Additional payer information
     */
    payer_information?: string;

    /**
     * Is set to true if current transaction duplicates amount, made_on and currency_code of any transaction parsed in
     * previous attempt
     */
    possible_duplicate?: boolean;

    /**
     * Indicates that transaction is marked as posted (or booked) by the bank, but has the pending status assigned by
     * Salt Edge due to custom_pendings_period logic.
     */
    posted_by_aspsp?: boolean;

    /**
     * Date when the transaction appears in statement
     */
    posting_date?: string;

    /**
     * Time in HH:MM:SS format, representing time when the transaction appears in statement
     */
    posting_time?: string;

    /**
     * Bank record number
     */
    record_number?: string;

    /**
     * Additional identification information for cashless domestic payments (transfers)
     */
    specific_code?: string;

    /**
     * User defined information in the bank or e-wallet interface, assigned to a transaction record (not category)
     */
    tags?: string[];

    /**
     * Time when the transaction was made
     */
    time?: string;

    /**
     * Name of the linked account
     */
    transfer_account_name?: string;

    /**
     * Transaction type
     */
    type?: string;

    /**
     * Price per unit (used with units, available for investment accounts nature only)
     */
    unit_price?: number;

    /**
     * Amount of units owned (used with unit_price, available for investment accounts nature only)
     */
    units?: number;

    /**
     * Identifies the tax subject to the tax office, used for domestic payments (transfers)
     */
    variable_code?: string;
}

interface AccountExtra {
    /**
     * Changeable name of the account
     */
    account_name?: string;

    /**
     * Internal bank account number
     */
    account_number?: string;

    /**
     * Array of crypto codes and their amounts assigned to investment account
     */
    assets?: Record<string, unknown>[]

    /**
     * Available amount in the account’s currency
     */
    available_amount?: number;

    /**
     * Examples: interimAvailable, closingBooked, interimBooked, authorised, expected, BOOKED, CLAV, CLBD, XPCD, OTHR,
     * etc.
     * Note: The value is specific to the financial institution and can vary depending on the API standard, the bank’s
     * implementation, the account’s type, country/region peculiarities, etc. This field holds an informative meaning.
     * Usually, it is used to verify the balance consistency between customers of the same bank or between banks within
     * the same country.
     */
    balance_type?: 'interimAvailable' | 'closingBooked' | 'interimBooked' | 'authorised' | 'expected' | 'BOOKED' | 'CLAV' | 'CLBD' | 'XPCD' | 'OTHR';

    /**
     * The amount currently blocked in the account’s currency
     */
    blocked_amount?: number;

    /**
     * Type of the card account. Possible values are: american_express, china_unionpay, diners_club, jcb, maestro,
     * master_card, uatp, visa and mir
     */
    card_type?: 'american_express' | 'china_unionpay' | 'diners_club' | 'jcb' | 'maestro' | 'master_card' | 'uatp' | 'visa' | 'mir'

    /**
     *  List of masked card numbers
     */
    cards?: string[];

    /**
     *  Account client owner
     */
    client_name?: string;

    /**
     * Account balance at the end of the accounting period
     */
    closing_balance?: number;

    /**
     * Credit limit in the account’s currency
     */
    credit_limit?: number;

    /**
     * Date of provider statement generation (applicable to banks)
     */
    current_date?: string;

    /**
     * Time of provider statement generation (applicable to banks)
     */
    current_time?: string;

    /**
     * Card expiry date
     */
    expiry_date?: string;

    /**
     * Account IBAN number
     */
    iban?: string;

    /**
     * Basic Bank Account Number
     */
    bban?: string;

    /**
     * Interest rate of the account as percentage value
     */
    interest_rate?: number;

    /**
     * Type of account interest used with interest_rate
     */

    interest_type?: string;

    /**
     * Minimum and maximum value of the interest rate e.g. {'min_value': 1.84, 'max_value': 1.99 }
     */
    floating_interest_rate?: {
        min_value: number;
        max_value: number;
    };

    /**
     * The number of remaining payments to pay off the loan
     */
    remaining_payments?: number;

    /**
     * The amount of the penalty
     */
    penalty_amount?: number;

    /**
     * Next payment amount for loans or credits
     */
    next_payment_amount?: number;


    /**
     * Next payment date for loans or credits
     */
    next_payment_date?: string;

    /**
     * Card open date
     */
    open_date?: string;

    /**
     * Account balance that is brought forward from the end of one accounting period to the beginning of a new
     * accounting period
     */
    opening_balance?: number;

    /**
     * Account transactions were not imported or imported partially because of some internal error on the bank’s side
     */
    partial?: boolean;

    /**
     * The original account balance response returned by the bank. It is added only for regulated: true providers.
     * It is returned only if the separate balances parameter is present in the bank’s original response.
     */
    raw_balance?: string;

    /**
     * Routing number(US)/BSB code(Australia)/sort code(UK)
     */
    sort_code?: string;

    /**
     * Date when the current statement becomes previous one
     */
    statement_cut_date?: string;

    /**
     * Shows whether the account is active, inactive or unauthorized
     */
    status?: 'active' | 'inactive' | 'unauthorized';


    /**
     * Account SWIFT code
     */
    swift?: string;

    /**
     * Total payment amount for loans or credits
     */
    total_payment_amount?: number;

    /**
     * Number of transactions, separated by posted and pending. e.g. {'posted': 12, 'pending': 0}
     */
    transactions_count?: { posted: number; pending: number; };

    /**
     * Account payment method
     */
    payment_type?: string;

    /**
     * Accumulated CashBack / Cash Benefit
     */
    cashback_amount?: number;
}
