import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { AdminService } from 'src/services/admin.service';
import { debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';

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

  // Trip autocomplete for batches
  tripSearchControl = new FormControl('');
  filteredTrips: any[] = [];
  selectedTrip: any = null;

  // Trip autocomplete for users (associated trips)
  userTripSearchControl = new FormControl('');
  userFilteredTrips: any[] = [];
  selectedUserTrips: any[] = [];

  // Date validation
  minStartDate: string = '';
  minEndDate: string = '';

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService
  ) {
    // Set minimum start date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minStartDate = this.formatDateForInput(tomorrow);
    this.minEndDate = this.minStartDate;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setupTripAutocomplete();
    this.setupUserTripAutocomplete();
    this.setupDateValidation();
    if (this.mode === 'edit' && this.data) {
      this.patchFormData(this.data);
    }
  }

  setupTripAutocomplete(): void {
    this.tripSearchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(value => {
          if (typeof value === 'string' && value.length >= 3) {
            return this.adminService.searchTrips(value);
          }
          return of({ trips: [] });
        })
      )
      .subscribe(response => {
        this.filteredTrips = response.trips || [];
      });
  }

  setupUserTripAutocomplete(): void {
    this.userTripSearchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(value => {
          if (typeof value === 'string' && value.length >= 3) {
            return this.adminService.searchTrips(value);
          }
          return of({ trips: [] });
        })
      )
      .subscribe(response => {
        this.userFilteredTrips = response.trips || [];
      });
  }

  setupDateValidation(): void {
    if (this.entityType === 'batches' || this.entityType === 'coupons') {
      // Listen to start date changes to update end date minimum
      this.entityForm.get('startDate')?.valueChanges.subscribe(startDate => {
        if (startDate) {
          const startDateObj = new Date(startDate);
          startDateObj.setDate(startDateObj.getDate() + 1);
          this.minEndDate = this.formatDateForInput(startDateObj);
          
          // Validate end date if it exists
          const endDate = this.entityForm.get('endDate')?.value;
          if (endDate && new Date(endDate) <= new Date(startDate)) {
            this.entityForm.get('endDate')?.setErrors({ invalidEndDate: true });
          } else if (endDate) {
            // Clear the error if end date is now valid
            const endDateControl = this.entityForm.get('endDate');
            if (endDateControl?.hasError('invalidEndDate')) {
              endDateControl.setErrors(null);
            }
          }
        }
      });

      // Validate end date when it changes
      this.entityForm.get('endDate')?.valueChanges.subscribe(endDate => {
        const startDate = this.entityForm.get('startDate')?.value;
        if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
          this.entityForm.get('endDate')?.setErrors({ invalidEndDate: true });
        }
      });
    }
  }

  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  selectTrip(trip: any): void {
    this.selectedTrip = trip;
    this.entityForm.patchValue({ assignedTrip: trip.id });
    this.tripSearchControl.setValue('');
    this.filteredTrips = [];
  }

  removeSelectedTrip(): void {
    this.selectedTrip = null;
    this.entityForm.patchValue({ assignedTrip: '' });
  }

  selectUserTrip(trip: any): void {
    // Check if trip is already selected
    if (!this.selectedUserTrips.find(t => t.id === trip.id)) {
      this.selectedUserTrips.push(trip);
      this.updateAssociatedTripsFormValue();
    }
    this.userTripSearchControl.setValue('');
    this.userFilteredTrips = [];
  }

  removeUserTrip(trip: any): void {
    this.selectedUserTrips = this.selectedUserTrips.filter(t => t.id !== trip.id);
    this.updateAssociatedTripsFormValue();
  }

  updateAssociatedTripsFormValue(): void {
    const tripIds = this.selectedUserTrips.map(t => t.id.toString());
    this.entityForm.patchValue({ associatedTrips: tripIds });
  }

  initializeForm(): void {
    switch (this.entityType) {
      case 'trips':
        this.entityForm = this.fb.group({
          name: ['', Validators.required],
          description: ['', Validators.required],
          itinerary: [''],
          numberOfDays: [1, [Validators.required, Validators.min(1)]],
          days: ['', [Validators.required, Validators.min(1)]],
          nights: ['', [Validators.required, Validators.min(1)]],
          destinations: ['', Validators.required],
          physicalRating: ['', Validators.required],
          daysForms: this.fb.array([this.createDayFormGroup()]), // FormArray for day-specific data
          images: this.fb.array([])
        });
        break;

      case 'batches':
        const batchName = this.mode === 'add' ? this.generateBatchName() : '';
        this.entityForm = this.fb.group({
          batchName: [batchName, Validators.required],
          assignedTrip: ['', Validators.required],
          startDate: ['', Validators.required],
          endDate: ['', Validators.required],
          standardPrice: ['', [Validators.required, Validators.min(0)]],
          singleRoom: ['', Validators.min(0)],
          doubleRoom: ['', Validators.min(0)],
          tripleRoom: ['', [Validators.required, Validators.min(0)]],
          tax: ['', [Validators.required, Validators.min(0)]],
          travelers: [''],
          tripProgress: ['not-started'],
          count: [0, Validators.min(0)],
          maxAdventurers: ['', [Validators.required, Validators.min(1)]]
        });
        // Disable batch name field to prevent user editing
        this.entityForm.get('batchName')?.disable();
        break;

      case 'users':
        this.entityForm = this.fb.group({
          name: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
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
          phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
          message: ['']
        });
        break;
    }
  }

  patchFormData(data: any): void {
    if (this.entityType === 'trips' && data) {
      // Handle trip-specific data
      this.entityForm.patchValue({
        name: data.destination_name,
        description: data.description,
        days: data.days,
        nights: data.nights,
        destinations: data.desitnations, // Note: API uses 'desitnations' (typo in DB)
        physicalRating: data.physical_rating?.toString()
      });

      // Parse and populate itinerary days if available
      if (data.itinerary) {
        try {
          const itineraryData = typeof data.itinerary === 'string' 
            ? JSON.parse(data.itinerary) 
            : data.itinerary;
          
          if (typeof itineraryData === 'object' && !Array.isArray(itineraryData)) {
            const dayNumbers = Object.keys(itineraryData).map(k => parseInt(k)).filter(n => !isNaN(n));
            if (dayNumbers.length > 0) {
              const maxDay = Math.max(...dayNumbers);
              this.numberOfDays = maxDay;
              this.entityForm.patchValue({ numberOfDays: maxDay });
              
              // Clear existing days array
              while (this.daysArray.length > 0) {
                this.daysArray.removeAt(0);
              }
              
              // Add new days
              for (let i = 1; i <= maxDay; i++) {
                const dayData = itineraryData[i.toString()];
                this.daysArray.push(this.fb.group({
                  heading: [dayData?.title || '', Validators.required],
                  description: [dayData?.content || '', Validators.required]
                }));
              }
            }
          }
        } catch (e) {
          console.error('Error parsing itinerary data:', e);
        }
      }
    } else if (this.entityType === 'batches' && data) {
      // Handle batch-specific data
      // Convert timestamps to date strings for input fields
      const startDate = data.from_date ? this.formatDateForInput(new Date(data.from_date * 1000)) : '';
      const endDate = data.to_date ? this.formatDateForInput(new Date(data.to_date * 1000)) : '';
      
      this.entityForm.patchValue({
        batchName: data.batch_name || '',
        assignedTrip: data.trip_id || '',
        startDate: startDate,
        endDate: endDate,
        standardPrice: data.price || 0,
        singleRoom: data.single_room || 0,
        doubleRoom: data.double_room || 0,
        tripleRoom: data.triple_room || 0,
        tax: data.tax || 0,
        maxAdventurers: data.max_adventurers || 0
      });

      // Set selected trip if trip data is available
      if (data.trip_id && data.destination_name) {
        this.selectedTrip = {
          id: data.trip_id,
          destination_name: data.destination_name
        };
      }
    } else {
      // For other entity types, use simple patch
      this.entityForm.patchValue(data);
    }
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
    return this.entityForm.get('daysForms') as FormArray;
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
      formData.append('days', this.entityForm.value.days.toString());
      formData.append('nights', this.entityForm.value.nights.toString());
      formData.append('destinations', this.entityForm.value.destinations);
      formData.append('physicalRating', this.entityForm.value.physicalRating.toString());

      // Transform days array to the required format
      const daysArray = this.entityForm.value.daysForms;
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
    } else if (this.entityType === 'batches') {
      // Use getRawValue() to include disabled fields (like batchName)
      const formData = this.entityForm.getRawValue();
      
      // Convert dates to timestamps
      if (formData.startDate) {
        formData.startDate = new Date(formData.startDate).getTime() / 1000;
      }
      if (formData.endDate) {
        formData.endDate = new Date(formData.endDate).getTime() / 1000;
      }
      
      // Add createdAt timestamp only for new batches (add mode)
      if (this.mode === 'add') {
        formData.createdAt = Math.floor(new Date().getTime() / 1000);
      }
      
      // Add batch ID if in edit mode
      if (this.mode === 'edit' && this.data && this.data.id) {
        formData.id = this.data.id;
      }
      
      // Add status as true (active by default)
      formData.status = true;
      
      return formData;
    } else if (this.entityType === 'coupons') {
      // Use getRawValue() to include disabled fields
      const formData = this.entityForm.getRawValue();
      
      // Convert dates to timestamps
      if (formData.startDate) {
        formData.startDate = new Date(formData.startDate).getTime() / 1000;
      }
      if (formData.endDate) {
        formData.endDate = new Date(formData.endDate).getTime() / 1000;
      }
      
      return formData;
    } else if (this.entityType === 'leads') {
      // Use getRawValue() to include disabled fields
      const formData = this.entityForm.getRawValue();
      
      // Convert trip date to timestamp
      if (formData.tripDate) {
        formData.tripDate = new Date(formData.tripDate).getTime() / 1000;
      }
      
      return formData;
    } else {
      // Use getRawValue() to include disabled fields
      return this.entityForm.getRawValue();
    }
  }

  // Generate unique batch name with 6-digit random ID
  generateBatchName(): string {
    const randomId = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit number
    return `BATCH${randomId}`;
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
    if (control?.hasError('invalidEndDate')) {
      return 'End date must be after start date';
    }
    if (control?.hasError('pattern') && fieldName === 'phoneNumber') {
      return 'Phone number must be exactly 10 digits';
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
