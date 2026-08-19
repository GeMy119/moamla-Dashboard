export interface EmployerRef {
    _id: string;
    name: string;
    identity_number: string;
    source_number: string;
    address?: string;
}

export interface Alert {
    type?: 'الغاء بلاغ' | 'بلاغ تغيب';
    status?: 'rejected' | 'accepted';
    filed_date?: string;
    resolved_date?: string;
    source_number?: string
}

export interface ProfessionChange {
    old_profession?: string;
    status?: 'rejected' | 'accepted';
    change_date?: string;
    source_number?: string
}
export interface MoamlaType {
    _id?: string;
    name?: string;      // ← اختيارية (فيها ?)
    status?: 'rejected' | 'accepted';
    source_number?: string


}
export interface Worker {
    _id: string;
    employer_id: string | EmployerRef;
    name: string;
    identity_number: string;
    source_number: string;
    nationality: string;
    profession: string;
    address: string;
    account_number: string;
    iqama_number: string;
    iqama_expiry_date: string;
    iqama_status: string;
    iqama_issue_date: string;
    acceptedDate: string;
    alerts?: Alert;
    profession_changes?: ProfessionChange;
    moamla_type?: MoamlaType[]
}

export interface CreateWorkerDto {
    employer_id: string;
    name: string;
    identity_number: string;
    nationality: string;
    profession: string;
    address: string;
    account_number: string;
    iqama_number: string;
    iqama_expiry_date: string;
    iqama_status: string;
    iqama_issue_date: string;
    acceptedDate: string;
}

export interface WorkerResponse {
    success: boolean;
    message?: string;
    data: Worker;
}

export interface WorkersListResponse {
    success: boolean;
    data: Worker[];
    pagination: { total: number; page: number; pages: number; limit: number };
}