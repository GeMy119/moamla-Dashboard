export interface NationalityRequest {
    _id: string;
    name: string;
    application_number: string;
    issue_date: string;
    serial_number: string;
    status: 'تم الرفض' | 'تمت الموافقة';
    job: string;
    image_URL: string;
    source_number: string;
    identity_number: string;
}

export interface CreateNationalityRequestDto {
    name: string;
    application_number: string;
    issue_date: string;
    serial_number: string;
    status: 'تم الرفض' | 'تمت الموافقة';
    job: string;
    identity_number: string;
}

export interface NationalityRequestResponse {
    success: boolean;
    message?: string;
    data: NationalityRequest;
}

export interface NationalityRequestsListResponse {
    success: boolean;
    data: NationalityRequest[];
    pagination: { total: number; page: number; pages: number; limit: number };
}