import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = 'profile';
  constructor(private _httpService: HttpService,private http: HttpClient) {}

  getProfiles(page: number): Observable<any> {
    return this._httpService.get<any>(environment.marsa,`${this.baseUrl}?page=${page}`);
  }
}
