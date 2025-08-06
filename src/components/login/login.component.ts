import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  signUpform: FormGroup;
  loginForm: FormGroup;
  isSignUp: boolean = false;
  password: string = '';
  returnUrl: string = '/';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.signUpform = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      password: new FormControl(''),
    });

    this.loginForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
    });
  }

  ngOnInit(): void {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  submitSignUpform() {
    console.log(this.signUpform.value);
    let postData = this.signUpform.getRawValue();
    postData['role'] = 'user';
    postData['createdAt'] = new Date();
    this.authService.signUpUser(postData).subscribe((data) => {
      this.signUpform.reset();
      this.password = null;
      this.isSignUp = false;
    });
  }

  submitLoginForm() {
    let postData = this.loginForm.getRawValue();
    this.authService.loginUser(postData).subscribe((data) => {
      if(data) {
        localStorage.setItem('isUserLoggedIn', 'true');
        localStorage.setItem('userName', data.details.name);
        localStorage.setItem('email', data.details.email);
        localStorage.setItem('role', data.details.role);
        this.authService.isUserLoggedIn = true;
        this.authService.userName = data.details.name;
        sessionStorage.setItem('bn_access', data.tokens.accessToken);
        sessionStorage.setItem('bn_refresh', data.tokens.refreshToken);
        this.router.navigateByUrl(this.returnUrl);
      }
    });
  }
}
