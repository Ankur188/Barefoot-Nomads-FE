import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  selectedTab = 0;
  isEditMode = false;
  profileForm!: FormGroup;
  originalFormValues: any = {};

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadUserData();
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      gender: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: [''],
      emergencyContact: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: [{ value: '', disabled: true }] // Email is always disabled
    });
  }

  loadUserData(): void {
    // Load user profile from backend
    this.userService.getUserProfile().subscribe({
      next: (response) => {
        const userData = response.user || response;
        const formData = {
          fullName: userData.name || this.authService.userName || '',
          gender: userData.gender || '',
          mobileNumber: userData.phone_number || userData.phoneNumber || '',
          address: userData.address || '',
          emergencyContact: userData.emergency_contact || userData.emergencyContact || '',
          email: userData.email || ''
        };
        this.profileForm.patchValue(formData);
        this.originalFormValues = { ...formData };
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        // Fallback to default values
        const formData = {
          fullName: this.authService.userName || '',
          gender: '',
          mobileNumber: '',
          address: '',
          emergencyContact: '',
          email: ''
        };
        this.profileForm.patchValue(formData);
        this.originalFormValues = { ...formData };
      }
    });
  }

  onTabChange(index: number): void {
    this.selectedTab = index;
  }

  enableEdit(): void {
    this.isEditMode = true;
  }

  cancelEdit(): void {
    this.isEditMode = false;
    // Reset form to original values
    this.profileForm.patchValue(this.originalFormValues);
    // Clear validation errors
    this.profileForm.markAsUntouched();
    this.profileForm.markAsPristine();
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      const profileData = {
        name: this.profileForm.get('fullName')?.value,
        gender: this.profileForm.get('gender')?.value,
        phoneNumber: this.profileForm.get('mobileNumber')?.value,
        address: this.profileForm.get('address')?.value,
        emergencyContact: this.profileForm.get('emergencyContact')?.value,
        email: this.profileForm.get('email')?.value
      };

      this.userService.updateUserProfile(profileData).subscribe({
        next: (response) => {
          console.log('Profile updated successfully:', response);
          this.isEditMode = false;
          
          // Update auth service with new name
          if (profileData.name) {
            this.authService.userName = profileData.name;
            localStorage.setItem('userName', profileData.name);
          }
          
          // Update original values after successful save
          this.originalFormValues = { ...this.profileForm.getRawValue() };
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          // You can add error handling here (e.g., show error popup)
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.profileForm.controls).forEach(key => {
        this.profileForm.get(key)?.markAsTouched();
      });
    }
  }
}

