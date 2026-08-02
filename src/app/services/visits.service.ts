import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CreateVisitDto, VisitResponse, VisitsListResponse } from '../models/visits.model.ts';

@Injectable({ providedIn: 'root' })
export class VisitService {
  private apiUrl = `${environment.apiUrl}/visits`;

  constructor(private http: HttpClient) { }

  getAll(params: {
    page?: number;
    limit?: number;
    nationality?: string;
    typeOfVisa?: string;
    purpose?: string;
  } = {}) {
    return this.http.get<VisitsListResponse>(this.apiUrl, { params: params as any });
  }

  // بما إن مفيش GET /:id، بنستخدم /search?id= (الأدمن)
  getById(id: string) {
    return this.http.get<VisitResponse>(`${this.apiUrl}/search`, { params: { id } });
  }

  create(data: CreateVisitDto, image: File) {
    const formData = this.buildFormData(data, image);
    return this.http.post<VisitResponse>(this.apiUrl, formData);
  }

  update(id: string, data: Partial<CreateVisitDto>, image?: File | null) {
    const formData = this.buildFormData(data, image);
    return this.http.put<VisitResponse>(`${this.apiUrl}/${id}`, formData);
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
      formData.append('image', image); // اسم الحقل لازم يطابق uploadAndprocessFile("visits", "image")
    }
    return formData;
  }
}