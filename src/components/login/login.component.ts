
import {Component} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StaticService } from 'src/services/static.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],

})
export class LoginComponent {

signUpform : FormGroup;
loginForm : FormGroup;
isSignUp:boolean = false;
password:string = '';

constructor(private formBuilder : FormBuilder, private staticService: StaticService){
  this.signUpform = new FormGroup({
    name : new FormControl(''),
    email : new FormControl(''),
    phone : new FormControl(''),
    password : new FormControl('')
})

this.loginForm = new FormGroup({
  email : new FormControl(''),
  password : new FormControl('')
})

}



  submitSignUpform(){
    console.log(this.signUpform.value)
    let postData = this.signUpform.getRawValue();
    postData['role'] = 'user';
    this.staticService.signUpUser(postData).subscribe(data => {
      this.signUpform.reset();
      this.password = null;
      this.isSignUp = false;
    });
  }

  submitLoginForm() {
    let postData = this.loginForm.getRawValue();
    this.staticService.loginUser(postData).subscribe(data => {
      localStorage.setItem('isUserLoggedIn', 'true');
      sessionStorage.setItem('bn_access', data.accessToken);
      sessionStorage.setItem('bn_refresh', data.refreshToken);
    })
  }

}
