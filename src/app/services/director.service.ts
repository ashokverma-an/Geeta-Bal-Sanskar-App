
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class DirectorService {
  private apiUrl = 'http://localhost:5000/director'; // Base URL for the API

  constructor(private http: HttpClient) {}

  // Create a new director
  createDirector(director: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/directors`, director);
  }

  // Get all directors
  getAllDirectors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/directors`);
  }
  // Get all directors
  getAllDirectorsBasedonCompany(company_Id:number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/directorsByComapany/${company_Id}`);
  }
  // Get a director by ID
  getDirectorById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/directors/${id}`);
  }

  // Update a director by ID
  updateDirector(id: string, director: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/directors/${id}`, director);
  }

  // Delete a director by ID
  deleteDirector(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/directors/${id}`);
  }
  fetchDirectorLogs(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fetchDirectorLog`);
  }

  saveDirectorHistory(director: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/history`, director);
  }
  getDirectorHistoryById(directorId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/gethistory/${directorId}`);
  }
  getDirectorHistoryByHistoryId(directorId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/gethistorybasedOnID/${directorId}`);
  }
 
  editDirectorHistoryById(directorId: number,director: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/history/${directorId}`,director);
  }
  deleteDirectorHistoryById(historyId: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/history/${historyId}`);
  }
}
