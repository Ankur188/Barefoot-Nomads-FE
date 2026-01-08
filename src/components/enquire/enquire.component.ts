import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { StaticService } from 'src/services/static.service';

@Component({
  selector: 'app-enquire',
  templateUrl: './enquire.component.html',
  styleUrls: ['./enquire.component.scss'],
})
export class EnquireComponent implements OnInit {
  enquireForm!: FormGroup;
  isTailorMadeSelected: string = 'false';
  // get email() { return this.enquireForm.get('email')!; }
  // get phone() { return this.enquireForm.get('phone')!; }
  // get days()  { return this.enquireForm.get('days')!; }
  // get travellers()  { return this.enquireForm.get('travellers')!; }

  constructor(private staticService: StaticService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.enquireForm = this.fb.group({
      name: ['', [Validators.required]],
      location: ['', [Validators.required]],
      travellers: ['', [Validators.required, Validators.min(1)]],
      days: ['', [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [
          Validators.required,
          Validators.min(1000000000),
          Validators.max(9999999999),
        ],
      ],
      message: ['', [Validators.required]],
      budget: ['', [Validators.required]],
    });
  }

  submitEnquireForm() {
    var postData = this.enquireForm.getRawValue();
    postData['type'] =
      this.isTailorMadeSelected === 'true' ? 'tailor-made' : 'pre-made';
    if (this.enquireForm.valid) {
      this.staticService.postEnquiry(postData).subscribe((data) => {
        this.enquireForm.reset();
      });
    } else {
      this.enquireForm.markAllAsTouched(); // highlight all invalid fields
    }
  }

  formChanged() {
    this.enquireForm.get('location')?.setValue('');
  }
}
