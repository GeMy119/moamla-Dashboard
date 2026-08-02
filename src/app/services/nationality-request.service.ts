import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {
  CreateNationalityRequestDto,
  NationalityRequestResponse,
  NationalityRequestsListResponse,
} from '../models/nationality-request.model.ts';

@Injectable({ providedIn: 'root' })
export class NationalityRequestService {
  private apiUrl = `${environment.apiUrl}/nationalities`;

  constructor(private http: HttpClient) { }

  getAll(params: { page?: number; limit?: number; status?: string; job?: string } = {}) {
    return this.http.get<NationalityRequestsListResponse>(this.apiUrl, { params: params as any });
  }

  // ✅ هنا عندنا GET /:id فعلي (على عكس Visit)، فمش محتاجين نلف على /search
  getById(id: string) {
    return this.http.get<NationalityRequestResponse>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateNationalityRequestDto, image: File) {
    const formData = this.buildFormData(data, image);
    return this.http.post<NationalityRequestResponse>(this.apiUrl, formData);
  }

  update(id: string, data: Partial<CreateNationalityRequestDto>, image?: File | null) {
    const formData = this.buildFormData(data, image);
    return this.http.put<NationalityRequestResponse>(`${this.apiUrl}/${id}`, formData);
  }

  delete(id: string) {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }

  private buildFormData(data: any, image?: File | null): FormData {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });
    if (image) {
      formData.append('image', image);
    }
    return formData;
  }
}