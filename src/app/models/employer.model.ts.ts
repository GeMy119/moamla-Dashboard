export interface MarriagePermit {
    status: 'accepted' | 'cancled';
    issue_date: string;
    sending_date: string;
    wife_nationality: string;
    arrival_port: string;
    type: string;
    ProfessionCategory: string;
    file_number: string;
    name: string;
    lastSearchedAt: string
}

export interface Employer {
    _id: string;
    name: string;
    identity_number: string;
    source_number: string;
    address: string;
    file_number: string;
    company_name: string;
    reference_number: string;
    marriage_permit?: MarriagePermit;
    createdAt: string;
    updatedAt: string;
    ticket_visa_review?: ticket[];
}

export interface CreateEmployerDto {
    name: string;
    identity_number: string;
    address: string;
    file_number: string;
    company_name: string;
    reference_number: string;
}

export interface UpdateEmployerDto extends Partial<CreateEmployerDto> { }

export interface MarriagePermitDto {
    status: 'accepted' | 'cancled';
    issue_date: string;
    sending_date: string;
    wife_nationality: string;
    arrival_port: string;
    file_number: string;
    ProfessionCategory: string,
    name: string
}

export interface PaginationMeta {
    total: number;
    page: number;
    pages: number;
    limit: number;
}

export interface EmployersResponse {
    success: boolean;
    data: Employer[];
    pagination: PaginationMeta;
}

export interface EmployerResponse {
    success: boolean;
    data: Employer;
}
export interface ticket {
    _id?: string;
    nationality?: string;
    profession?: string;
    arrival_port?: string;
    count?: number;
}