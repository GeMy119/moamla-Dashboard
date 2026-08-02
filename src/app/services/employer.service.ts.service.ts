import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {
  CreateEmployerDto,
  UpdateEmployerDto,
  EmployersResponse,
  EmployerResponse,
  MarriagePermitDto,
  ticket,
} from '../models/employer.model.ts';

@Injectable({ providedIn: 'root' })
export class EmployerService {
  private apiUrl = `${environment.apiUrl}/employers`;

  constructor(private http: HttpClient) { }

  // ── جلب كل الكفلاء مع Pagination ──
  getAll(page: number = 1, limit: number = 10) {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    return this.http.get<EmployersResponse>(this.apiUrl, { params });
  }

  // ── جلب كفيل بالـ ID ──
  getById(id: string) {
    return this.http.get<EmployerResponse>(`${this.apiUrl}/${id}`);
  }

  // ── إنشاء كفيل جديد ──
  create(data: CreateEmployerDto) {
    return this.http.post<EmployerResponse>(this.apiUrl, data);
  }

  // ── تعديل كفيل ──
  update(id: string, data: UpdateEmployerDto) {
    return this.http.put<EmployerResponse>(`${this.apiUrl}/${id}`, data);
  }

  // ── حذف كفيل ──
  delete(id: string) {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.apiUrl}/${id}`
    );
  }

  // ── إضافة تصريح زواج ──
  addMarriagePermit(id: string, data: MarriagePermitDto) {
    return this.http.post<EmployerResponse>(
      `${this.apiUrl}/${id}/marriage-permit`,
      data
    );
  }

  // ── تحديث تصريح زواج ──
  updateMarriagePermit(id: string, data: Partial<MarriagePermitDto>) {
    return this.http.put<EmployerResponse>(
      `${this.apiUrl}/${id}/marriage-permit`,
      data
    );
  }
  // ── جلب تصريح الزواج (أدمن) ──
  getMarriagePermit(employerId: string) {
    return this.http.get<EmployerResponse>(
      `${this.apiUrl}/marriage-permit`,
      { params: { id: employerId } }
    );
  }
  // ── جلب مراجعة تذاكر التأشيرات (أدمن) ──
  getTicket(employerId: string) {
    return this.http.get<EmployerResponse>(
      `${this.apiUrl}/ticket-visa-review`,
      { params: { id: employerId } }
    );
  }


  addTicket(employerId: string, data: ticket) {
    return this.http.post<EmployerResponse>(
      `${this.apiUrl}/${employerId}/ticket-visa-review`,
      { ticket_visa_review: [data] }
    );
  }

  // ── تحديث عنصر واحد من مراجعة التأشيرات ──
  updateTicket(employerId: string, reviewId: string, data: Partial<ticket>) {
    return this.http.put<EmployerResponse>(
      `${this.apiUrl}/${employerId}/ticket-visa-review/${reviewId}`,
      data
    );
  }

  // ── حذف عنصر واحد من مراجعة التأشيرات ──
  deleteTicket(employerId: string, reviewId: string) {
    return this.http.delete<EmployerResponse>(
      `${this.apiUrl}/${employerId}/ticket-visa-review/${reviewId}`
    );
  }
}