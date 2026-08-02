import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface LoginResponse {
  success: boolean;
  token: string;
  data: {
    _id: string;
    userName: string;
    role: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  login(userName: string, password: string) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
      userName,
      password,
    });
  }
}
