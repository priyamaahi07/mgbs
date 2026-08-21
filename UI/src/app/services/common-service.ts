import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class CommonService {

  private apiUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) { }

  getRequest(url: string): Observable<any> {
    return this.http.get(this.apiUrl + url);
  }

  postRequest(url: string, postBody: any): Observable<any> {
    return this.http.post(this.apiUrl + url, postBody);
  }

  getLoginStatus() {
    const loginStatus: string | null = localStorage.getItem('token');
    if (loginStatus === null) {
      return false;
    }
    return true;
  }
}
