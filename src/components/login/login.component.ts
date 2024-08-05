
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

constructor(private formBuilder : FormBuilder, private staticService: StaticService){
  this.signUpform = new FormGroup({
    name : new FormControl(''),
    email : new FormControl(''),
    phone : new FormControl(''),
    password : new FormControl('')
})



}



  submitSignUpform(){
    console.log(this.signUpform.value)
    let postData = this.signUpform.getRawValue();
    postData['role'] = 'user';
    this.staticService.signUpUser(postData).subscribe(data => {
      this.signUpform.reset();
    });
  }

}
