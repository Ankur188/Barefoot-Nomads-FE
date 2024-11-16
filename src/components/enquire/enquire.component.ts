import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-enquire',
  templateUrl: './enquire.component.html',
  styleUrls: ['./enquire.component.scss']
})
export class EnquireComponent implements OnInit {

  enquireForm: FormGroup;
  isTailorMadeSelected: boolean = true;

  constructor() {
    this.enquireForm = new FormGroup({
      name : new FormControl(''),
      email : new FormControl(''),
      phone : new FormControl(''),
      message : new FormControl('')
  })
   }

  ngOnInit(): void {
  }

  submitEnquireForm() {}

}
