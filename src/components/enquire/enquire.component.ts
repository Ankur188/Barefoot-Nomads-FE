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
          Validators.pattern('^[0-9]{10}$'),
        ],
      ],
      date: ['', [Validators.required]],
      message: [''],
      budget: [''],
    });
    // Update budget validators based on initial selection
    this.updateBudgetValidators();
  }

  submitEnquireForm() {
    // Mark all fields as touched to show validation errors
    this.enquireForm.markAllAsTouched();
    
    if (this.enquireForm.valid) {
      var postData = this.enquireForm.getRawValue();
      postData['type'] =
        this.isTailorMadeSelected === 'true' ? 'tailor-made' : 'pre-made';
      
      // Convert date to timestamp (in seconds)
      if (postData['date']) {
        postData['date'] = Math.floor(new Date(postData['date']).getTime() / 1000);
      }
      
      // Add createdAt timestamp (current date in seconds)
      postData['createdAt'] = Math.floor(Date.now() / 1000);
      
      this.staticService.postEnquiry(postData).subscribe((data) => {
        this.enquireForm.reset();
      });
    }
  }

  formChanged() {
    // Reset the entire form (clears values and validation states)
    this.enquireForm.reset();
    this.updateBudgetValidators();
  }

  updateBudgetValidators() {
    const budgetControl = this.enquireForm.get('budget');
    if (this.isTailorMadeSelected === 'true') {
      budgetControl?.setValidators([Validators.required]);
    } else {
      budgetControl?.clearValidators();
    }
    budgetControl?.updateValueAndValidity();
  }
}
