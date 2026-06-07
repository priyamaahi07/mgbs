import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { CommonService } from '../../services/common-service';

@Component({
  selector: 'app-login',
  imports: [ButtonModule, DividerModule, InputTextModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {

  loginForm!: FormGroup;

  constructor(private _formBuilder: FormBuilder, private _router: Router, private _commonService: CommonService) {
    this.loginForm = this._formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    })
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

    this._commonService.setLoginStatus();

    const isLogin: boolean = this._commonService.getLoginStatus();
    if (isLogin) {
      this._router.navigate(['dashboard'])
    } else {

    }
  }
}
