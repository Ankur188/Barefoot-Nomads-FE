import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-get-quotation',
  templateUrl: './get-quotation.component.html',
  styleUrls: ['./get-quotation.component.scss'],
})
export class GetQuotationComponent implements OnInit {
  enquireForm: FormGroup;
  isTailorMadeSelected: boolean = true;

  constructor() {
    this.enquireForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      message: new FormControl(''),
    });
  }

  ngOnInit(): void {}

  submitEnquireForm() {}
}
