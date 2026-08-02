export interface Visit {
    _id: string;
    visaNo: string;
    passportNo: string;
    code: string;
    applicationNo: string;
    name: string;
    birthDate: string;
    validFrom: string;
    validUntil: string;
    image_url: string;
    typeOfVisa: string;
    durationOfStay: string;
    nationality: string;
    placeOfIssue: string;
    entryType: string;
    source_number: string;
    lastSearchedAt?: Date | string;
    searchCount?: number
}

export interface CreateVisitDto {
    visaNo: string;
    passportNo: string;
    code: string;
    applicationNo: string;
    name: string;
    birthDate: string;
    validFrom: string;
    validUntil: string;
    typeOfVisa: string;
    durationOfStay: string;
    nationality: string;
    placeOfIssue: string;
    entryType: string;
}

export interface VisitResponse {
    success: boolean;
    message?: string;
    data: Visit;
}

export interface VisitsListResponse {
    success: boolean;
    data: Visit[];
    pagination: { total: number; page: number; pages: number; limit: number };
}