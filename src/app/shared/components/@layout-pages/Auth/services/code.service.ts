import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CodeService {
  UserData: any = {};

  constructor() { }

  setUserData(data: any) {
    this.UserData = data;
  }

  getUserData() {
    return this.UserData;
  }
}
