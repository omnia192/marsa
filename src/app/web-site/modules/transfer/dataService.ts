import { HttpClient,HttpHeaders } from '@angular/common/http';
// import { Http, HttpHeaders, Response } from '@angular/http';
import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root',
})
export class DataService {
  private responseData: any;

  setResponseData(data: any) {
    this.responseData = data;
  }

  getResponseData() {
    return this.responseData;
  }
}
