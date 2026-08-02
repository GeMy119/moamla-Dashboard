import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {
  CreateFamilyVisaDto,
  FamilyVisaResponse,
  FamilyVisasListResponse,
} from '../models/family-visa.model.ts';

@Injectable({ providedIn: 'root' })
export class FamilyVisaService {
  private apiUrl = `${environment.apiUrl}/families`;

  constructor(private http: HttpClient) { }

  getAll(params: {
    page?: number;
    limit?: number;
    worker_id?: string;
    nationality?: string;
    status?: string;
  } = {}) {
    return this.http.get<FamilyVisasListResponse>(this.apiUrl, { params: params as any });
  }

  getById(id: string) {
    return this.http.get<FamilyVisaResponse>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateFamilyVisaDto) {
    return this.http.post<FamilyVisaResponse>(this.apiUrl, data);
  }

  update(id: string, data: Partial<CreateFamilyVisaDto>) {
    return this.http.put<FamilyVisaResponse>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }
}