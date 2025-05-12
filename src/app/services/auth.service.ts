import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/';
  constructor(private http: HttpClient) {}
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, user);
  }

  getAccess(): Observable<any> {
  const accessPayload = {
    apiKey: 'FINSOVA-BBPS-KEY',
    userName: 'Finsova',
    password: 'Finsova@2025'
  };
  return this.http.post(`${this.apiUrl}auth/getAccess`, accessPayload);
}
 login(credentials: any): Observable<any> {
  const token = sessionStorage.getItem('accessToken') || '';
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.post(`${this.apiUrl}users/login`, credentials, { headers });
}



  changePassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, data);
  }

  logout(): void {
    localStorage.removeItem('token'); // Remove token on logout
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Check if user is logged in
  }
}
