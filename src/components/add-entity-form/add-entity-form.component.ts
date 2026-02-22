import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AdminService } from 'src/services/admin.service';

export interface EntityFormConfig {
  entityType: 'trips' | 'batches' | 'users' | 'coupons' | 'leads';
  mode?: 'add' | 'edit';
  data?: any;
}

@Component({
  selector: 'app-add-entity-form',
  templateUrl: './add-entity-form.component.html',
  styleUrls: ['./add-entity-form.component.scss']
})
export class AddEntityFormComponent implements OnInit {
  @Input() entityType: 'trips' | 'batches' | 'users' | 'coupons' | 'leads' = 'trips';
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() data?: any;
  @Output() formSubmit = new EventEmitter<{ action: string, data: any }>();
  @ViewChild('itineraryInput') itineraryInput!: ElementRef<HTMLInputElement>;
  
  entityForm!: FormGroup;
  uploadedImages: File[] = [];
  itineraryFile: File | null = null;
  numberOfDays = 1;
  maxDays = 30;
  selectedDayIndex = 0; // Currently selected day (0-indexed)
  
  // Pagination for day buttons
  maxVisibleDays = 6;
  currentPageStart = 0;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    if (this.mode === 'edit' && this.data) {
      this.patchFormData(this.data);
    }
  }

  initializeForm(): void {
    switch (this.entityType) {
      case 'trips':
        this.entityForm = this.fb.group({
          name: ['', Validators.required],
          description: ['', Validators.required],
          itinerary: [''],
          numberOfDays: [1, [Validators.required, Validators.min(1)]],
          days: this.fb.array([this.createDayFormGroup()]), // FormArray for day-specific data
          images: this.fb.array([])
        });
        break;

      case 'batches':
        this.entityForm = this.fb.group({
          batchName: ['', Validators.required],
          assignedTrip: ['', Validators.required],
          startDate: ['', Validators.required],
          endDate: ['', Validators.required],
          standardPrice: ['', [Validators.required, Validators.min(0)]],
          singleRoom: ['', [Validators.required, Validators.min(0)]],
          doubleRoom: ['', [Validators.required, Validators.min(0)]],
          tripleRoom: ['', [Validators.required, Validators.min(0)]],
          tax: ['', [Validators.required, Validators.min(0)]],
          travelers: [''],
          tripProgress: ['not-started'],
          count: [0, Validators.min(0)],
          availability: ['available', Validators.required]
        });
        break;

      case 'users':
        this.entityForm = this.fb.group({
          name: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          phoneNumber: ['', Validators.required],
          role: ['user', Validators.required],
          associatedTrips: ['']
        });
        break;

      case 'coupons':
        this.entityForm = this.fb.group({
          couponCode: ['', Validators.required],
          deduction: ['', [Validators.required, Validators.min(0)]],
          startDate: ['', Validators.required],
          endDate: ['', Validators.required]
        });
        break;

      case 'leads':
        this.entityForm = this.fb.group({
          name: ['', Validators.required],
          location: ['', Validators.required],
          tripDate: ['', Validators.required],
          people: ['', [Validators.required, Validators.min(1)]],
          days: ['', [Validators.required, Validators.min(1)]],
          approxBudget: ['', [Validators.required, Validators.min(0)]],
          email: ['', [Validators.required, Validators.email]],
          phoneNumber: ['', Validators.required],
          message: ['']
        });
        break;
    }
  }

  patchFormData(data: any): void {
    this.entityForm.patchValue(data);
  }

  get formTitle(): string {
    const action = this.mode === 'add' ? 'Add' : 'Edit';
    const entityName = this.entityType.charAt(0).toUpperCase() + this.entityType.slice(1, -1);
    return `${action} ${entityName}`;
  }

  // Image handling for trips
  onImagesSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        if (this.uploadedImages.length < 8) {
          this.uploadedImages.push(files[i]);
          this.imagesArray.push(this.fb.control(files[i].name));
        }
      }
    }
  }

  removeImage(index: number): void {
    this.uploadedImages.splice(index, 1);
    this.imagesArray.removeAt(index);
  }

  // Itinerary file handling
  onItinerarySelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.itineraryFile = file;
      this.entityForm.patchValue({ itinerary: file.name });
    }
  }

  removeItinerary(): void {
    this.itineraryFile = null;
    this.entityForm.patchValue({ itinerary: '' });
    // Clear the file input to allow re-selecting the same file
    if (this.itineraryInput) {
      this.itineraryInput.nativeElement.value = '';
    }
  }

  // Number of days handlers
  setNumberOfDays(days: number): void {
    this.numberOfDays = days;
    this.entityForm.patchValue({ numberOfDays: days });
  }

  incrementDays(): void {
    if (this.numberOfDays < this.maxDays) {
      this.numberOfDays++;
      this.entityForm.patchValue({ numberOfDays: this.numberOfDays });
      this.updateDaysArray();
    }
  }

  decrementDays(): void {
    if (this.numberOfDays > 1) {
      this.numberOfDays--;
      this.entityForm.patchValue({ numberOfDays: this.numberOfDays });
      this.updateDaysArray();
      // Keep selected day valid
      if (this.selectedDayIndex >= this.numberOfDays) {
        this.selectedDayIndex = this.numberOfDays - 1;
      }
      // Adjust pagination if needed
      if (this.currentPageStart >= this.numberOfDays) {
        this.currentPageStart = Math.max(0, this.numberOfDays - this.maxVisibleDays);
      }
    }
  }

  // FormArray helpers for days
  get daysArray(): FormArray {
    return this.entityForm.get('days') as FormArray;
  }

  // FormArray helper for images
  get imagesArray(): FormArray {
    return this.entityForm.get('images') as FormArray;
  }

  createDayFormGroup(): FormGroup {
    return this.fb.group({
      heading: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  updateDaysArray(): void {
    const currentLength = this.daysArray.length;
    
    if (this.numberOfDays > currentLength) {
      // Add new day forms
      for (let i = currentLength; i < this.numberOfDays; i++) {
        this.daysArray.push(this.createDayFormGroup());
      }
    } else if (this.numberOfDays < currentLength) {
      // Remove excess day forms
      for (let i = currentLength - 1; i >= this.numberOfDays; i--) {
        this.daysArray.removeAt(i);
      }
    }
  }

  selectDay(index: number): void {
    this.selectedDayIndex = index;
  }

  getDayNumbers(): number[] {
    return Array.from({ length: this.numberOfDays }, (_, i) => i + 1);
  }

  getVisibleDayNumbers(): number[] {
    const allDays = this.getDayNumbers();
    const end = Math.min(this.currentPageStart + this.maxVisibleDays, allDays.length);
    return allDays.slice(this.currentPageStart, end);
  }

  canSlidePrev(): boolean {
    return this.currentPageStart > 0;
  }

  canSlideNext(): boolean {
    return this.currentPageStart + this.maxVisibleDays < this.numberOfDays;
  }

  slidePrev(): void {
    if (this.canSlidePrev()) {
      this.currentPageStart--;
    }
  }

  slideNext(): void {
    if (this.canSlideNext()) {
      this.currentPageStart++;
    }
  }

  // Form submission
  onSubmit(): void {
    if (this.entityForm.invalid) {
      Object.keys(this.entityForm.controls).forEach(key => {
        this.entityForm.get(key)?.markAsTouched();
      });
      return;
    }

    console.log('Form Data:', this.entityForm.value);
    const formData = this.prepareFormData();
    this.formSubmit.emit({ action: 'save', data: formData });
  }

  prepareFormData(): FormData | any {
    if (this.entityType === 'trips') {
      const formData = new FormData();
      formData.append('name', this.entityForm.value.name);
      formData.append('description', this.entityForm.value.description);
      formData.append('numberOfDays', this.entityForm.value.numberOfDays.toString());

      // Transform days array to the required format
      const daysArray = this.entityForm.value.days;
      const daysObject: any = {};
      daysArray.forEach((day: any, index: number) => {
        daysObject[(index + 1).toString()] = {
          title: day.heading,
          content: day.description
        };
      });
      
      formData.append('daysData', JSON.stringify(daysObject));

      if (this.itineraryFile) {
        formData.append('itinerary', this.itineraryFile);
      }

      this.uploadedImages.forEach((image, index) => {
        formData.append(`images`, image);
      });

      return formData;
    } else {
      return this.entityForm.value;
    }
  }

  onCancel(): void {
    this.formSubmit.emit({ action: 'cancel', data: null });
  }

  // Helper method to get field error
  getFieldError(fieldName: string): string {
    const control = this.entityForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('email')) {
      return 'Invalid email address';
    }
    if (control?.hasError('min')) {
      return `Minimum value is ${control.errors?.['min'].min}`;
    }
    return '';
  }

  // Check if field should show error
  shouldShowError(fieldName: string): boolean {
    const control = this.entityForm.get(fieldName);
    return !!(control?.invalid && (control?.touched || control?.dirty));
  }

  // Check if form is valid including custom validations
  isFormValid(): boolean {
    if (this.entityType === 'trips') {
      // For trips, also check if itinerary file and at least one image is uploaded
      return this.entityForm.valid && 
             this.itineraryFile !== null && 
             this.uploadedImages.length > 0;
    }
    return this.entityForm.valid;
  }
}
