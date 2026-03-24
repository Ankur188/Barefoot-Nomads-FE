import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
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
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required]),
    }, { validators: this.passwordMatchValidator });

    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  // Custom validator to check if password and confirmPassword match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  submitSignUpform() {
    // Mark all fields as touched to show validation errors
    Object.keys(this.signUpform.controls).forEach(key => {
      this.signUpform.get(key)?.markAsTouched();
    });

    // Validate form before submission
    if (this.signUpform.invalid) {
      console.log('Form is invalid', this.signUpform.errors);
      return;
    }

    console.log(this.signUpform.value);
    let postData = this.signUpform.getRawValue();
    // Remove confirmPassword from post data
    delete postData.confirmPassword;
    postData['role'] = 'user';
    postData['createdAt'] = Math.floor(new Date().getTime() / 1000);
    this.authService.signUpUser(postData).subscribe((data) => {
      if (data) {
        localStorage.setItem('isUserLoggedIn', 'true');
        localStorage.setItem('userName', data.details.name);
        localStorage.setItem('email', data.details.email);
        localStorage.setItem('role', data.details.role);
        localStorage.setItem('id', data.details.id);
        this.authService.isUserLoggedIn = true;
        this.authService.userName = data.details.name;
        sessionStorage.setItem('bn_access', data.tokens.accessToken);
        sessionStorage.setItem('bn_refresh', data.tokens.refreshToken);
        this.router.navigateByUrl(this.returnUrl);
        this.signUpform.reset();
        this.password = null;
        this.isSignUp = false;
      }
    });
  }

  submitLoginForm() {
    // Mark all fields as touched to show validation errors
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });

    // Validate form before submission
    if (this.loginForm.invalid) {
      console.log('Login form is invalid');
      return;
    }

    let postData = this.loginForm.getRawValue();
    this.authService.loginUser(postData).subscribe((data) => {
      if (data) {
        localStorage.setItem('isUserLoggedIn', 'true');
        localStorage.setItem('userName', data.details.name);
        localStorage.setItem('email', data.details.email);
        localStorage.setItem('userRole', data.details.role);
        localStorage.setItem('id', data.details.id);
        this.authService.isUserLoggedIn = true;
        this.authService.userName = data.details.name;
        this.authService.userRole = data.details.role;
        sessionStorage.setItem('bn_access', data.tokens.accessToken);
        sessionStorage.setItem('bn_refresh', data.tokens.refreshToken);
        this.router.navigateByUrl(this.returnUrl);
      }
    });
  }
}
