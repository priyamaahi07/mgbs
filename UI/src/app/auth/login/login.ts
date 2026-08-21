import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { CommonService } from '../../services/common-service';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-login',
  imports: [ButtonModule, DividerModule, InputTextModule, ReactiveFormsModule, DialogModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {

  visible: boolean = true;
  loginForm!: FormGroup;

  constructor(private _formBuilder: FormBuilder, private _router: Router, private _commonService: CommonService) {
    this.loginForm = this._formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
  }

  login() {
    console.log('Login!')

    if (!this.loginForm.valid) {
      this.loginForm.markAllAsDirty();
      return;
    }

    console.log('Valid form')

    this._commonService.postRequest('login', {
      username: this.loginForm.controls['username'].value,
      password: this.loginForm.controls['password'].value,
    }).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.status === true) {

          this._commonService.setLoginStatus();

          const isLogin: boolean = this._commonService.getLoginStatus();
          if (isLogin) {
            this._router.navigate(['dashboard'])
          } else {

          }
        }
      },
      error: (error: any) => { },
    })
  }
}
