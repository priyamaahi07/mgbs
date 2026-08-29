import { Component, HostListener, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonService } from './services/common-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, CommonModule, TooltipModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('ui');


  isCollapsed: boolean = true;     // desktop collapse
  isMobile: boolean = false;
  isMobileOpen: boolean = false;

  navigateUrl: string = '';
  constructor(private _router: Router, private _commonService: CommonService) {
    if (this.isLogin) {
      this.navigateUrl = 'dashboard';
      // this._router.navigate(['/dashboard']);
    } else {
      this._router.navigate(['/login']);
    }
  }


  public get sideBaarMenus(): any {
    return [
      {
        label: 'Dashboard',
        navigateUrl: 'dashboard',
        icon: 'bi bi-speedometer2'
      },
      {
        label: 'Billing',
        navigateUrl: 'billing',
        icon: 'bi bi-speedometer2'
      },
      {
        label: 'Stocks',
        navigateUrl: 'stocks',
        icon: 'bi bi-speedometer2'
      },
      {
        label: 'Products',
        navigateUrl: 'products',
        icon: 'bi bi-speedometer2'
      },
    ]
  }


  public get isLogin(): boolean {
    const token: any = this._commonService.getLoginStatus() || '';
    return (token !== '' && token !== null && token !== undefined);
  }


  ngOnInit(): void {
    this.checkScreen();
  }

  @HostListener('window:resize')
  checkScreen() {
    this.isMobile = window.innerWidth <= 768;

    if (!this.isMobile) {
      this.isMobileOpen = false; // reset mobile state
    }
  }

  navigateRoute(route: string) {
    this.navigateUrl = route;
    this._router.navigate([`${route}`]);
  }

  toggleSidebar() {
    if (this.isMobile) {
      this.isMobileOpen = !this.isMobileOpen;
    } else {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  closeMobile() {
    this.isMobileOpen = false;
  }
}
