import { Component, HostListener, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { CommonService } from './services/common-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, CommonModule, RouterLinkWithHref],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('ui');


  isCollapsed: boolean = true;     // desktop collapse
  isMobile: boolean = false;
  isMobileOpen: boolean = false;

  menu: string = '';
  isLogin: boolean = false;
  constructor(private _router: Router, private _commonService: CommonService) {
    this.isLogin = this._commonService.getLoginStatus();
    if (this.isLogin) {
      this.menu = 'dashboard';
      // this._router.navigate(['/dashboard']);
    } else {
      this._router.navigate(['/login']);
    }
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
    this.menu = route;
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
