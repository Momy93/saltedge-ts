import {SaltedgePartnerClient} from "./saltedge-partner-client";

export class Leads {
    private static readonly BASE_URL = '/partners/v1/leads';

    constructor(private saltedgeClient: SaltedgePartnerClient) {
    }

    async create(data: CreateLeadBody) {
        return this.saltedgeClient.post<Lead>(Leads.BASE_URL, data)
    }

    async remove(customerId: string) {
        return this.saltedgeClient.delete<Lead>(`${Leads.BASE_URL}?customer_id=${customerId}`)
    }
}

export interface Lead {
    email: string;
    customer_id: string;
    identifier: string;
}

export interface CreateLeadBody {
    /**
     * Email address
     */
    email: string;

    /**
     * An optional field that can be used for additional information about the lead, e.g. IBAN, phone, reference_number,
     * etc. Returned in response only if it was present in payload.
     */
    identifier?: string;

    /**
     * Additional information about the lead
     */
    kyc?: {
        /**
         * The customer’s name and surname must be composed of valid ASCII characters only
         */
        full_name?: string;

        /**
         * The type of account that is to be connected. Possible values are own - account of a physical (natural)
         * person, legal - account of a legal (juridical) person and shared - account with two or more owners.
         */
        type_of_account?: string;

        /**
         * The lead’s citizenship country code as dated in ISO 3166-1 alpha-2
         */
        citizenship_code?: string;

        /**
         * The lead’s residence address
         */
        residence_address?: string;

        /**
         * The lead’s date of birth
         */
        date_of_birth?: string;

        /**
         * The lead’s place of birth
         */
        place_of_birth?: string;

        /**
         * The lead’s gender. Possible values are male, female and other
         */
        gender?: string;

        /**
         * The lead’s company legal name
         */
        legal_name?: string;

        /**
         * The lead’s company registered office country code as dated in ISO 3166-1 alpha-2
         */
        registered_office_code?: string;

        /**
         * The lead’s company registration office address
         */
        registered_office_address?: string;

        /**
         * The lead’s company registration number or VAT number without country code
         */
        registration_number?: string;
    }
}
