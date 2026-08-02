import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {
  Worker,
  CreateWorkerDto,
  WorkerResponse,
  WorkersListResponse,
  Alert,
  ProfessionChange,
  MoamlaType,
} from '../models/worker.model.ts';

@Injectable({ providedIn: 'root' })
export class WorkerService {
  private apiUrl = `${environment.apiUrl}/workers`; // عدّل حسب الـ base url عندك

  constructor(private http: HttpClient) { }

  getAll(params: {
    page?: number;
    limit?: number;
    employer_id?: string;
    nationality?: string;
    profession?: string;
    iqama_status?: string;
  } = {}) {
    return this.http.get<WorkersListResponse>(this.apiUrl, { params: params as any });
  }

  getById(id: string) {
    return this.http.get<WorkerResponse>(`${this.apiUrl}/${id}`);
  }

  getByEmployer(employerId: string) {
    return this.http.get<{ success: boolean; count: number; employer: any; data: Worker[] }>(
      `${this.apiUrl}/employerAdmin/${employerId}`
    );
  }

  create(data: CreateWorkerDto) {
    return this.http.post<WorkerResponse>(this.apiUrl, data);
  }

  update(id: string, data: Partial<CreateWorkerDto>) {
    return this.http.put<WorkerResponse>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }

  // ── البلاغات ──
  addAlert(id: string, data: Alert) {
    return this.http.post<{ success: boolean; message: string; data: Alert }>(
      `${this.apiUrl}/${id}/alerts`,
      data
    );
  }

  updateAlert(id: string, data: Partial<Alert>) {
    return this.http.put<{ success: boolean; message: string; data: Alert }>(
      `${this.apiUrl}/${id}/alerts`,
      data
    );
  }

  deleteAlert(id: string) {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}/alerts`);
  }

  // ── تغيير المهنة ──
  addProfessionChange(id: string, data: { status?: string; change_date: string; new_profession?: string }) {
    return this.http.post<{ success: boolean; message: string; data: any }>(
      `${this.apiUrl}/${id}/profession-changes`,
      data
    );
  }

  // ── تحديث تغيير المهنة ──
  updateProfessionChange(id: string, data: { status?: string; change_date?: string; new_profession?: string }) {
    return this.http.put<{ success: boolean; message: string; data: any }>(
      `${this.apiUrl}/${id}/profession-changes`,
      data
    );
  }

  // ── حذف تغيير المهنة ──
  deleteProfessionChange(id: string) {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.apiUrl}/${id}/profession-changes`
    );
  }
  // ── إضافة نوع معاملة ──
  addMoamlaType(id: string, data: MoamlaType) {
    return this.http.post<{ success: boolean; message: string; data: any }>(
      `${this.apiUrl}/${id}/moamla-type`, [data]
    );
  }

  // ── تحديث نوع المعاملة ──
  updateMoamlaType(id: string, moamlaId: string, data: MoamlaType) {
    return this.http.put<{ success: boolean; message: string; data: any }>(
      `${this.apiUrl}/${id}/moamla-type/${moamlaId}`,
      [data]
    );
  }

  // ── حذف نوع المعاملة ──
  deleteMoamlaType(id: string, moamlaId: string) {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.apiUrl}/${id}/moamla-type/${moamlaId}`
    );
  }
}