export interface FamilyVisaWorkerRef {
    _id: string;
    name: string;
    identity_number: string;
    iqama_number?: string;
    nationality?: string;
}

export interface FamilyVisa {
    _id: string;
    worker_id: string | FamilyVisaWorkerRef;
    visitor_name: string;
    relation: string;
    nationality: string;
    purpose: 'familyVisit' | 'familyRecruitment';
    duration_days: number;
    validity_days?: number;
    arrival_from?: string;
    status?: string;
    releaseDate: string;
    source_number?: string
    age: number

}

export interface CreateFamilyVisaDto {
    worker_id: string;
    visitor_name: string;
    relation: string;
    nationality: string;
    purpose: 'familyVisit' | 'familyRecruitment';
    duration_days: number;
    validity_days?: number;
    arrival_from?: string;
    status?: string;
    releaseDate: string;
    age: number
}

export interface FamilyVisaResponse {
    success: boolean;
    message?: string;
    data: FamilyVisa;
}

export interface FamilyVisasListResponse {
    success: boolean;
    data: FamilyVisa[];
    pagination: { total: number; page: number; pages: number; limit: number };
}