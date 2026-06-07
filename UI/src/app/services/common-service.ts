import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  setLoginStatus() {
    localStorage.setItem('isLogin', 'true');
  }

  getLoginStatus() {
    const loginStatus: string | null = localStorage.getItem('isLogin');
    if (loginStatus === null) {
      return false;
    }
    return true;
  }

  getDashboardCharts(category: any) {
    switch (category) {
      case 'sales':
        
        break;
    
      default:
        break;
    }
  }
}
