import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';
import { BookingService } from 'src/services/booking.service';
import { ColDef, GridReadyEvent, GridApi } from 'ag-grid-community';

interface BookingRow {
  name: string;
  startDate: string;
  endDate: string;
  amountPaid: number;
  roomOccupancy: string;
  status: string;
  itinerary: string;
  bookingId: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  selectedTab = 0;
  isEditMode = false;
  profileForm!: FormGroup;
  originalFormValues: any = {};
  
  // Bookings Grid
  private bookingsGridApi!: GridApi;
  bookingsRowData: BookingRow[] = [];
  bookingsCurrentPage = 1;
  bookingsPageSize = 20;
  bookingsTotalCount = 0;
  bookingsTotalPages = 0;
  Math = Math;

  // Column Definitions for Bookings
  bookingsColumnDefs: ColDef[] = [
    {
      headerName: 'Name',
      field: 'name',
      flex: 2,
      sortable: true,
      resizable: true
    },
    {
      headerName: 'Start Date',
      field: 'startDate',
      flex: 1.5,
      sortable: true,
      resizable: true
    },
    {
      headerName: 'End Date',
      field: 'endDate',
      flex: 1.5,
      sortable: true,
      resizable: true
    },
    {
      headerName: 'Amount Paid',
      field: 'amountPaid',
      flex: 1,
      sortable: true,
      resizable: true
    },
    {
      headerName: 'Room Occupancy',
      field: 'roomOccupancy',
      flex: 1.5,
      sortable: true,
      resizable: true
    },
    {
      headerName: 'Status',
      field: 'status',
      flex: 1,
      sortable: true,
      resizable: true,
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
      cellRenderer: (params: any) => {
        const status = params.value;
        let className = '';
        let displayText = status;
        
        if (status === 'Completed') {
          className = 'status-completed';
        } else if (status === 'Cancelled') {
          className = 'status-cancelled';
        } else if (status === 'Upcoming') {
          className = 'status-upcoming';
        }
        
        return `<span class="status-badge ${className}">${displayText}</span>`;
      }
    },
    {
      headerName: 'Itinerary',
      field: 'itinerary',
      width: 100,
      sortable: false,
      resizable: false,
      cellRenderer: (params: any) => {
        return `<button class="action-btn itinerary-btn" data-action="itinerary" style="border: none; background: none; cursor: pointer; padding: 4px;">
          <mat-icon style="color: #1976d2;">edit</mat-icon>
        </button>`;
      }
    },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 120,
      sortable: false,
      resizable: false,
      cellRenderer: (params: any) => {
        return `<div style="display: flex; gap: 12px; align-items: center; justify-content: center;">
          <button class="action-btn download-btn" data-action="download" style="border: none; background: none; cursor: pointer; padding: 4px;">
            <mat-icon style="color: #1976d2;">description</mat-icon>
          </button>
          <button class="action-btn cancel-btn" data-action="cancel" style="border: none; background: none; cursor: pointer; padding: 4px;">
            <mat-icon style="color: #f44336;">cancel</mat-icon>
          </button>
        </div>`;
      }
    }
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: false,
    resizable: true
  };

  gridOptions = {
    suppressRowClickSelection: true,
    rowSelection: 'multiple',
    animateRows: true,
    enableCellTextSelection: true,
    ensureDomOrder: true,
    domLayout: 'normal'
  };

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private userService: UserService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadUserData();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
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
    
    // Load bookings when switching to MY TRIPS tab (index 1)
    if (index === 1) {
      this.loadBookingsData();
    }
  }

  private loadBookingsData() {
    const userId = localStorage.getItem('id');
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    this.bookingService.getUserBookings(userId).subscribe({
      next: (response) => {
        if (response && response.bookings && Array.isArray(response.bookings)) {
          this.bookingsTotalCount = response.bookings.length;
          this.bookingsTotalPages = Math.ceil(this.bookingsTotalCount / this.bookingsPageSize);
          
          // Apply client-side pagination
          const startIndex = (this.bookingsCurrentPage - 1) * this.bookingsPageSize;
          const endIndex = startIndex + this.bookingsPageSize;
          const paginatedBookings = response.bookings.slice(startIndex, endIndex);
          
          this.bookingsRowData = paginatedBookings.map((booking: any) => {
            // Calculate status based on dates
            let status = 'Upcoming';
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            
            if (booking.batch && booking.batch.from_date) {
              const startDate = new Date(booking.batch.from_date * 1000);
              startDate.setHours(0, 0, 0, 0);
              const endDate = new Date(booking.batch.to_date * 1000);
              endDate.setHours(0, 0, 0, 0);
              
              if (currentDate > endDate) {
                status = 'Completed';
              } else if (currentDate >= startDate && currentDate <= endDate) {
                status = 'Upcoming';
              }
            }
            
            return {
              bookingId: booking.id,
              name: booking.batch?.trip?.destination_name || 'N/A',
              startDate: this.formatDate(booking.batch?.from_date * 1000),
              endDate: this.formatDate(booking.batch?.to_date * 1000),
              amountPaid: booking.payment || 0,
              roomOccupancy: this.capitalizeFirst(booking.room_type) || 'N/A',
              status: status,
              itinerary: ''
            };
          });
          
          // Refresh the grid if it's already initialized
          if (this.bookingsGridApi) {
            this.bookingsGridApi.setRowData(this.bookingsRowData);
          }
        }
      },
      error: (error) => {
        console.error('Error fetching bookings:', error);
      }
    });
  }

  private formatDate(dateValue: any): string {
    if (!dateValue) return '';
    
    const date = new Date(dateValue);
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  private capitalizeFirst(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  onBookingsGridReady(params: GridReadyEvent) {
    this.bookingsGridApi = params.api;
    params.api.sizeColumnsToFit();
  }

  onBookingCellClicked(event: any) {
    if (event.event.target.closest('.action-btn')) {
      const action = event.event.target.closest('.action-btn').dataset.action;
      const bookingId = event.data.bookingId;
      
      if (action === 'itinerary') {
        console.log('View itinerary for booking:', bookingId);
        // Handle itinerary view
      } else if (action === 'download') {
        console.log('Download invoice for booking:', bookingId);
        // Handle invoice download
      } else if (action === 'cancel') {
        console.log('Cancel booking:', bookingId);
        // Handle booking cancellation
      }
    }
  }

  goToBookingsPage(page: number) {
    if (page >= 1 && page <= this.bookingsTotalPages) {
      this.bookingsCurrentPage = page;
      this.loadBookingsData();
    }
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

