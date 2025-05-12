import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = 'http://localhost:5000/company';

  constructor(private http: HttpClient) {}

  createCompany(companyData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/companysave`, companyData);
  }

  updateCompany(companyData: any,companyId :number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updatecompany/${companyId}`,companyData);
  }

  getCompanyList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getcompany`);
  }

  getCompanyById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/updatecompany/${id}`);
  }

  deleteCompany(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deletecompany/${id}`);
  }
  saveCompanyDirectorMapping(companyDirectorData: any): Observable<any> {
     
    return this.http.post(`${this.apiUrl}/saveCompanyDirectorMapping`, companyDirectorData);
  }
  getCompanyDrectorList(companyId:number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${companyId}/directors`);
  }
  saveCompanyShareCapital(shareCapitalArray: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/companySaveCapital`, shareCapitalArray);
  }
  fetchCompanyShareCapital(companyId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getCompanyCapital/${companyId}`);
  }
  getLatestCapitalTypes(companyId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${companyId}/capital-types`);
  }
  fetchCompanyLogs(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fetchCompanyLog`);
  }
}
