// src/app/services/api.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { doubleEncryptAES, doubleDecryptAES } from '../utils/crypto.utils';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  sendEncryptedData(url: string, data: any) {
    const encryptedPayload = doubleEncryptAES(JSON.stringify(data));
    return this.http.post(url, { data: encryptedPayload });
  }

  handleEncryptedResponse(encryptedResponse: any): any {
    if (encryptedResponse?.data) {
      const decrypted = doubleDecryptAES(encryptedResponse.data);
      return JSON.parse(decrypted);
    }
    return encryptedResponse;
  }
}
