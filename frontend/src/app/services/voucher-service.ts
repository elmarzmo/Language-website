import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { VoucherValidationResponse } from '../model/voucher.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VoucherService {

  private apiUrl = environment.apiUrl;

  
  
  constructor( private http: HttpClient ){}



  validateVoucher(code: string): Observable<VoucherValidationResponse>{
    return this.http.post<VoucherValidationResponse>(`${this.apiUrl}/voucher/validate`, {code});
}

  
}
