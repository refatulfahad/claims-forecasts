import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  protected resourceUrl = 'http://127.0.0.1:8000/api/api/forecast/predict_claim_amount/';

  constructor(
    protected http: HttpClient
  ) { }

  getAllClaimAmount(): Observable<any> {
    return this.http.get(`${this.resourceUrl}`, { observe: 'response' });
  }

  getPredictedClaimAmount(): Observable<any> {
    return this.http.get(`${this.resourceUrl}`, { observe: 'response' });
  }
}
