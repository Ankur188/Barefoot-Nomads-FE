import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { StaticService } from 'src/services/static.service';

@Component({
  selector: 'app-enquire',
  templateUrl: './enquire.component.html',
  styleUrls: ['./enquire.component.scss'],
})
export class EnquireComponent implements OnInit {
  enquireForm: FormGroup;
  isTailorMadeSelected: string = 'false';

  constructor(private staticService: StaticService) {
    this.enquireForm = new FormGroup({
      name: new FormControl(''),
      location: new FormControl(''),
      travellers: new FormControl(''),
      days: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      message: new FormControl(''),
      budget: new FormControl(''),
    });
  }

  ngOnInit(): void {}

  submitEnquireForm() {
    var postData = this.enquireForm.getRawValue();
    postData['type'] =
      this.isTailorMadeSelected === 'true' ? 'tailor-made' : 'pre-made';
    this.staticService.postEnquiry(postData).subscribe((data) => {
      this.enquireForm.reset();
    });
  }
}
