import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SqlService {
  private apiUrl = 'http://localhost:8000/api/data';

  constructor(private http: HttpClient) { }

  query(data: string): Observable<any> {
    const payload = { query: data };
    return this.http.post<any>(this.apiUrl, payload);
  }
}
