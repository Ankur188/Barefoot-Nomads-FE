import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridReadyEvent, GridApi, IDateFilterParams } from 'ag-grid-community';
import { CheckboxCellRendererComponent } from './checkbox-cell-renderer.component';
import { HeaderCheckboxRendererComponent } from './header-checkbox-renderer.component';
import { StatusToggleRendererComponent } from './status-toggle-renderer.component';
import { CustomHeaderRendererComponent } from './custom-header-renderer.component';
import { AvailabilityDropdownRendererComponent } from './availability-dropdown-renderer.component';
import { RoleDropdownRendererComponent } from './role-dropdown-renderer.component';
import { StaticService } from 'src/services/static.service';
import { AdminService } from 'src/services/admin.service';

interface Trip {
  name: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive';
}

interface Batch {
  batchName: string;
  assignedTrip: string;
  startDate: string;
  endDate: string;
  standardPrice: number;
  singleRoom: number;
  doubleRoom: number;
  tripleRoom: number;
  tax: string;
  travelers: string;
  tripProgress: string;
  count: number;
  availability: string;
  status: 'active' | 'inactive';
}

interface User {
  id?: string;
  name: string;
  email: string;
  associatedTrips: string;
  phoneNumber: string;
  role: string;
  hasTrips?: boolean;
}

interface Banner {
  id?: string;
  bannerName: string;
  description: string;
  status: 'active' | 'inactive';
}

interface Coupon {
  couponCode: string;
  deduction: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive';
}

interface Lead {
  name: string;
  location: string;
  tripDate: string;
  people: number;
  days: number;
  approxBudget: number;
  email: string;
  phoneNumber: string;
  message: string;
  createdAt?: number; // Unix timestamp in seconds
}

interface Booking {
  id?: string;
  userName: string;
  batchName: string;
  name: string;
  phoneNumber: string;
  guardianNumber: string;
  email: string;
  payment: number;
  travellers: number;
  roomType: string;
  invoice: string;
}

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  selectedTab = 0;
  private gridApi!: GridApi;
  private batchesGridApi!: GridApi;
  private usersGridApi!: GridApi;
  private bannersGridApi!: GridApi;
  private couponsGridApi!: GridApi;
  private leadsGridApi!: GridApi;
  private bookingsGridApi!: GridApi;
  selectedRowCount = 0;
  
  // Grid contexts for cell renderers
  tripsGridContext: any;
  batchesGridContext: any;
  couponsGridContext: any;
  
  // Form visibility flags
  showTripsForm = false;
  showBatchesForm = false;
  showUsersForm = false;
  showCouponsForm = false;
  showLeadsForm = false;
  showBookingsForm = false;
  currentEntityType: 'trips' | 'batches' | 'users' | 'coupons' | 'leads' | 'bookings' = 'trips';
  
  // Edit mode tracking
  tripsFormMode: 'add' | 'edit' = 'add';
  editTripData: any = null;
  batchesFormMode: 'add' | 'edit' = 'add';
  editBatchData: any = null;
  couponsFormMode: 'add' | 'edit' = 'add';
  editCouponData: any = null;
  bookingsFormMode: 'add' | 'edit' = 'add';
  editBookingData: any = null;
  tripsCurrentPage = 1;
  tripsPageSize = 20;
  tripsTotalCount = 0;
  tripsTotalPages = 0;
  batchesSelectedRowCount = 0;
  batchesCurrentPage = 1;
  batchesPageSize = 20;
  batchesTotalCount = 0;
  batchesTotalPages = 0;
  usersSelectedRowCount = 0;
  usersCurrentPage = 1;
  usersPageSize = 20;
  usersTotalCount = 0;
  usersTotalPages = 0;
  couponsSelectedRowCount = 0;
  couponsCurrentPage = 1;
  couponsPageSize = 20;
  couponsTotalCount = 0;
  couponsTotalPages = 0;
  bannersCurrentPage = 1;
  bannersPageSize = 5;
  bannersTotalCount = 0;
  bannersTotalPages = 0;
  allBannersData: any[] = [];
  leadsSelectedRowCount = 0;
  leadsCurrentPage = 1;
  leadsPageSize = 20;
  leadsTotalCount = 0;
  leadsTotalPages = 0;
  bookingsSelectedRowCount = 0;
  bookingsCurrentPage = 1;
  bookingsPageSize = 20;
  bookingsTotalCount = 0;
  bookingsTotalPages = 0;

  // File input for banner image upload
  @ViewChild('bannerImageInput') bannerImageInput!: ElementRef<HTMLInputElement>;
  selectedBannerId: string | null = null;

  // Column Definitions for Trips
  columnDefs: ColDef[] = [
    {
      headerName: '',
      field: 'checkbox',
      width: 50,
      sortable: false,
      filter: false,
      resizable: false,
      suppressMenu: true,
      pinned: 'left',
      cellRenderer: CheckboxCellRendererComponent,
      headerComponent: HeaderCheckboxRendererComponent,
      suppressSizeToFit: true
    },
    {
      headerName: 'Name',
      field: 'name',
      flex: 1,
      minWidth: 200,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        filterOptions: [
          'contains',
          'notContains',
          'equals',
          'notEqual',
          'startsWith',
          'endsWith'
        ],
        defaultOption: 'contains',
        suppressAndOrCondition: true,
        maxNumConditions: 1
      }
    },
    {
      headerName: 'Start Date',
      field: 'startDate',
      width: 250,
      suppressSizeToFit: true,
      filter: 'agDateColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
          const dateAsString = cellValue;
          if (dateAsString == null) return -1;
          const dateParts = dateAsString.split(' ');
          const monthMap: { [key: string]: number } = {
            'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
            'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
          };
          const month = monthMap[dateParts[0]];
          const day = Number(dateParts[1].replace(',', ''));
          const year = Number(dateParts[2]);
          const cellDate = new Date(year, month, day);
          if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
            return 0;
          }
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          }
          if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
          return 0;
        }
      } as IDateFilterParams
    },
    {
      headerName: 'End Date',
      field: 'endDate',
      width: 250,
      suppressSizeToFit: true,
      filter: 'agDateColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
          const dateAsString = cellValue;
          if (dateAsString == null) return -1;
          const dateParts = dateAsString.split(' ');
          const monthMap: { [key: string]: number } = {
            'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
            'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
          };
          const month = monthMap[dateParts[0]];
          const day = Number(dateParts[1].replace(',', ''));
          const year = Number(dateParts[2]);
          const cellDate = new Date(year, month, day);
          if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
            return 0;
          }
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          }
          if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
          return 0;
        }
      } as IDateFilterParams
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 100,
      filter: 'agSetColumnFilter',
      sortable: true,
      resizable: true,
      suppressSizeToFit: true,
      cellRenderer: StatusToggleRendererComponent,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        values: ['active', 'inactive']
      }
    },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 100,
      suppressSizeToFit: true,
      sortable: false,
      filter: false,
      resizable: false,
      cellRenderer: (params: any) => {
        return `<div style="display: flex; gap: 8px; align-items: center;">
          <button class="action-btn edit-btn" data-action="edit" style="border: none; background: none; cursor: pointer; padding: 4px;">
            <img src="assets/ri_edit-fill.png" alt="Edit" width="18" height="18" />
          </button>
        </div>`;
      }
    }
  ];

  // Row Data
  rowData: Trip[] = [];

  // Batches Column Definitions
  batchesColumnDefs: ColDef[] = [
    {
      headerName: '',
      field: 'checkbox',
      width: 50,
      sortable: false,
      filter: false,
      resizable: false,
      suppressMenu: true,
      pinned: 'left',
      cellRenderer: CheckboxCellRendererComponent,
      headerComponent: HeaderCheckboxRendererComponent,
      suppressSizeToFit: true
    },
    {
      headerName: 'Batch Name',
      field: 'batchName',
      width: 180,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        filterOptions: ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith'],
        defaultOption: 'contains',
        suppressAndOrCondition: true,
        maxNumConditions: 1
      }
    },
    {
      headerName: 'Assigned Trip',
      field: 'assignedTrip',
      width: 220,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        filterOptions: ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith'],
        defaultOption: 'contains',
        suppressAndOrCondition: true,
        maxNumConditions: 1
      }
    },
    {
      headerName: 'Start Date',
      field: 'startDate',
      width: 150,
      filter: 'agDateColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'End Date',
      field: 'endDate',
      width: 150,
      filter: 'agDateColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Standard Price',
      field: 'standardPrice',
      width: 180,
      filter: 'agNumberColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Single Room',
      field: 'singleRoom',
      width: 170,
      filter: 'agNumberColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Double Room',
      field: 'doubleRoom',
      width: 170,
      filter: 'agNumberColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Triple Room',
      field: 'tripleRoom',
      width: 170,
      filter: 'agNumberColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Tax%',
      field: 'tax',
      width: 130,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Travelers',
      field: 'travelers',
      width: 200,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      cellRenderer: (params: any) => {
        return `<a href="#" style="color: #1154A2; text-decoration: none;">${params.value}</a>`;
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Trip Progress',
      field: 'tripProgress',
      width: 180,
      filter: 'agSetColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        values: ['Completed', 'Upcoming']
      }
    },
    {
      headerName: 'Count',
      field: 'count',
      width: 130,
      filter: 'agNumberColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Availability',
      field: 'availability',
      width: 180,
      filter: 'agSetColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      cellRenderer: AvailabilityDropdownRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        values: ['Available', 'Filling Fast', 'Sold Out']
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 140,
      filter: 'agSetColumnFilter',
      sortable: true,
      resizable: true,
      suppressSizeToFit: true,
      cellRenderer: StatusToggleRendererComponent,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        values: ['active', 'inactive']
      }
    },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 140,
      suppressSizeToFit: true,
      sortable: false,
      filter: false,
      resizable: false,
      cellRenderer: (params: any) => {
        const tripProgress = params.data.tripProgress;
        const hasUsers = params.data.hasUsers;
        const hideButtons = tripProgress === 'In Progress' || tripProgress === 'Completed';
        
        if (hideButtons) {
          return '<div style="display: flex; gap: 8px; align-items: center;"></div>';
        }
        
        const deleteButton = hasUsers ? '' : `
          <button class="action-btn delete-btn" data-action="delete" style="border: none; background: none; cursor: pointer; padding: 4px;">
            <img src="assets/ant-design_delete-filled.svg" alt="Delete" width="18" height="18" />
          </button>`;
        
        return `<div style="display: flex; gap: 8px; align-items: center;">
          <button class="action-btn edit-btn" data-action="edit" style="border: none; background: none; cursor: pointer; padding: 4px;">
            <img src="assets/ri_edit-fill.png" alt="Edit" width="18" height="18" />
          </button>${deleteButton}
        </div>`;
      }
    }
  ];

  // Row Data for Batches
  batchesRowData: Batch[] = [];

  // Users Column Definitions
  usersColumnDefs: ColDef[] = [
    {
      headerName: '',
      field: 'checkbox',
      width: 50,
      sortable: false,
      filter: false,
      resizable: false,
      suppressMenu: true,
      pinned: 'left',
      cellRenderer: CheckboxCellRendererComponent,
      headerComponent: HeaderCheckboxRendererComponent,
      suppressSizeToFit: true
    },
    {
      headerName: 'Name',
      field: 'name',
      width: 380,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        filterOptions: ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith'],
        defaultOption: 'contains',
        suppressAndOrCondition: true,
        maxNumConditions: 1
      }
    },
    {
      headerName: 'Email',
      field: 'email',
      width: 450,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        filterOptions: ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith'],
        defaultOption: 'contains',
        suppressAndOrCondition: true,
        maxNumConditions: 1
      }
    },
    {
      headerName: 'Associated Trips',
      field: 'associatedTrips',
      width: 300,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      cellRenderer: (params: any) => {
        if (params.value === '—' || params.value === '-' || !params.value) {
          return `<span style="color: #222222;">—</span>`;
        }
        return `<a href="#" style="color: #1154A2; text-decoration: none;">${params.value}</a>`;
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        filterOptions: ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith'],
        defaultOption: 'contains',
        suppressAndOrCondition: true,
        maxNumConditions: 1
      }
    },
    {
      headerName: 'Phone Number',
      field: 'phoneNumber',
      width: 250,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        filterOptions: ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith'],
        defaultOption: 'contains',
        suppressAndOrCondition: true,
        maxNumConditions: 1
      }
    },
    {
      headerName: 'Role',
      field: 'role',
      width: 220,
      filter: 'agSetColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      cellRenderer: RoleDropdownRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        values: ['Admin', 'User']
      }
    },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 170,
      suppressSizeToFit: true,
      sortable: false,
      filter: false,
      resizable: false,
      cellRenderer: (params: any) => {
        // Only show delete button if user has no associated trips
        if (params.data.hasTrips) {
          return `<div style="display: flex; gap: 8px; align-items: center; justify-content: center;">
            <span style="color: #999;">—</span>
          </div>`;
        }
        return `<div style="display: flex; gap: 8px; align-items: center; justify-content: center;">
          <button class="action-btn delete-btn" data-action="delete" style="border: none; background: none; cursor: pointer; padding: 4px;">
            <img src="assets/ant-design_delete-filled.svg" alt="Delete" width="18" height="18" />
          </button>
        </div>`;
      }
    }
  ];

  // Row Data for Users
  usersRowData: User[] = [];

  // Banners Column Definitions
  bannersColumnDefs: ColDef[] = [
    {
      headerName: '#Banners',
      field: 'bannerName',
      width: 380,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        filterOptions: ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith'],
        defaultOption: 'contains',
        suppressAndOrCondition: true,
        maxNumConditions: 1
      }
    },
    {
      headerName: 'Description',
      field: 'description',
      width: 1100,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        filterOptions: ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith'],
        defaultOption: 'contains',
        suppressAndOrCondition: true,
        maxNumConditions: 1
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 180,
      filter: 'agSetColumnFilter',
      sortable: true,
      resizable: true,
      suppressSizeToFit: true,
      cellRenderer: StatusToggleRendererComponent,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        values: ['active', 'inactive']
      }
    },
    {
      headerName: 'Upload',
      field: 'upload',
      width: 150,
      suppressSizeToFit: true,
      sortable: false,
      filter: false,
      resizable: false,
      cellRenderer: (params: any) => {
        return `<div style="display: flex; gap: 8px; align-items: center; justify-content: center;">
          <button class="action-btn upload-btn" data-action="upload" style="border: none; background: none; cursor: pointer; padding: 4px;">
            <mat-icon style="font-size: 18px; width: 18px; height: 18px; color: #1154A2; transform: rotate(45deg);">attach_file</mat-icon>
          </button>
        </div>`;
      }
    }
  ];

  // Row Data for Banners
  bannersRowData: Banner[] = [];

  // Column Definitions for Coupons
  couponsColumnDefs: ColDef[] = [
    {
      headerName: '',
      field: 'checkbox',
      width: 50,
      sortable: false,
      filter: false,
      resizable: false,
      suppressMenu: true,
      pinned: 'left',
      cellRenderer: CheckboxCellRendererComponent,
      headerComponent: HeaderCheckboxRendererComponent,
      suppressSizeToFit: true
    },
    {
      headerName: 'Coupon Code',
      field: 'couponCode',
      width: 400,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        filterOptions: ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith'],
        defaultOption: 'contains',
        suppressAndOrCondition: true,
        maxNumConditions: 1
      }
    },
    {
      headerName: 'Deduction %',
      field: 'deduction',
      width: 300,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        filterOptions: ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith'],
        defaultOption: 'contains',
        suppressAndOrCondition: true,
        maxNumConditions: 1
      }
    },
    {
      headerName: 'Start Date',
      field: 'startDate',
      width: 370,
      filter: 'agDateColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
          const cellDate = new Date(cellValue);
          if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
            return 0;
          }
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          }
          if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
          return 0;
        }
      } as IDateFilterParams
    },
    {
      headerName: 'End Date',
      field: 'endDate',
      width: 370,
      filter: 'agDateColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
          const cellDate = new Date(cellValue);
          if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
            return 0;
          }
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          }
          if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
          return 0;
        }
      } as IDateFilterParams
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 180,
      filter: 'agSetColumnFilter',
      sortable: true,
      resizable: true,
      suppressSizeToFit: true,
      cellRenderer: StatusToggleRendererComponent,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        values: ['active', 'inactive']
      }
    },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 150,
      suppressSizeToFit: true,
      sortable: false,
      filter: false,
      resizable: false,
      cellRenderer: (params: any) => {
        return `<div style="display: flex; gap: 8px; align-items: center; justify-content: center;">
          <button class="action-btn edit-btn" data-action="edit" style="border: none; background: none; cursor: pointer; padding: 4px;">
            <img src="assets/ri_edit-fill.png" alt="Edit" width="18" height="18" />
          </button>
          <button class="action-btn delete-btn" data-action="delete" style="border: none; background: none; cursor: pointer; padding: 4px;">
            <img src="assets/ant-design_delete-filled.svg" alt="Delete" width="18" height="18" />
          </button>
        </div>`;
      }
    }
  ];

  // Row Data for Coupons
  couponsRowData: Coupon[] = [];

  // Leads Column Definitions
  leadsColumnDefs: ColDef[] = [
    {
      headerName: '',
      field: 'checkbox',
      width: 54,
      sortable: false,
      filter: false,
      resizable: false,
      suppressMenu: true,
      pinned: 'left',
      cellRenderer: CheckboxCellRendererComponent,
      headerComponent: HeaderCheckboxRendererComponent,
      suppressSizeToFit: true
    },
    {
      headerName: 'Name',
      field: 'name',
      width: 300,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        filterOptions: ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith'],
        defaultOption: 'contains',
        suppressAndOrCondition: true,
        maxNumConditions: 1
      }
    },
    {
      headerName: 'Location',
      field: 'location',
      width: 400,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        filterOptions: ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith'],
        defaultOption: 'contains',
        suppressAndOrCondition: true,
        maxNumConditions: 1
      }
    },
    {
      headerName: 'Trip Date',
      field: 'tripDate',
      width: 200,
      filter: 'agDateColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
          const dateAsString = cellValue;
          if (dateAsString == null) return -1;
          const dateParts = dateAsString.split(' ');
          const monthMap: { [key: string]: number } = {
            'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
            'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
          };
          const month = monthMap[dateParts[0]];
          const day = Number(dateParts[1].replace(',', ''));
          const year = Number(dateParts[2]);
          const cellDate = new Date(year, month, day);
          if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
            return 0;
          }
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          }
          if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
          return 0;
        }
      } as IDateFilterParams
    },
    {
      headerName: '#People',
      field: 'people',
      width: 180,
      filter: 'agNumberColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      cellStyle: { textAlign: 'center', justifyContent: 'center' },
      cellClass: 'center-aligned-cell',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: '#Days',
      field: 'days',
      width: 160,
      filter: 'agNumberColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      cellStyle: { textAlign: 'center', justifyContent: 'center' },
      cellClass: 'center-aligned-cell',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Approx. Budget',
      field: 'approxBudget',
      width: 250,
      filter: 'agNumberColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      valueFormatter: (params: any) => {
        return '₹' + params.value;
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Email',
      field: 'email',
      width: 400,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        filterOptions: ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith'],
        defaultOption: 'contains',
        suppressAndOrCondition: true,
        maxNumConditions: 1
      }
    },
    {
      headerName: 'Phone Number',
      field: 'phoneNumber',
      width: 300,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        filterOptions: ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith'],
        defaultOption: 'contains',
        suppressAndOrCondition: true,
        maxNumConditions: 1
      }
    },
    {
      headerName: 'Created At',
      field: 'createdAt',
      width: 250,
      filter: 'agDateColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      valueFormatter: (params: any) => {
        if (!params.value) return '';
        const date = new Date(params.value * 1000); // Convert seconds to milliseconds
        return date.toLocaleString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        comparator: (filterLocalDateAtMidnight: Date, cellValue: number) => {
          if (cellValue == null) return -1;
          const cellDate = new Date(cellValue * 1000);
          const cellDateAtMidnight = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate());
          if (filterLocalDateAtMidnight.getTime() === cellDateAtMidnight.getTime()) {
            return 0;
          }
          if (cellDateAtMidnight < filterLocalDateAtMidnight) {
            return -1;
          }
          if (cellDateAtMidnight > filterLocalDateAtMidnight) {
            return 1;
          }
          return 0;
        }
      } as IDateFilterParams
    },
    {
      headerName: 'Message',
      field: 'message',
      width: 600,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        filterOptions: ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith'],
        defaultOption: 'contains',
        suppressAndOrCondition: true,
        maxNumConditions: 1
      }
    },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 100,
      suppressSizeToFit: true,
      sortable: false,
      filter: false,
      resizable: false,
      cellRenderer: (params: any) => {
        return `<div style="display: flex; gap: 8px; align-items: center;">
          <button class="action-btn edit-btn" data-action="edit" style="border: none; background: none; cursor: pointer; padding: 4px;">
            <img src="assets/ri_edit-fill.png" alt="Edit" width="18" height="18" />
          </button>
          <button class="action-btn delete-btn" data-action="delete" style="border: none; background: none; cursor: pointer; padding: 4px;">
            <img src="assets/ant-design_delete-filled.svg" alt="Delete" width="18" height="18" />
          </button>
        </div>`;
      }
    }
  ];

  // Row Data for Leads
  leadsRowData: Lead[] = [
    { name: 'Darrell Steward', location: 'Little Hangleton', tripDate: 'May 12, 2019', people: 15, days: 4, approxBudget: 4000, email: 'michelle.rivera@example.com', phoneNumber: '91-8862466329', message: 'Aliquam porta nisl dolor, molestie...' },
    { name: 'Jerome Bell', location: 'Florean Fortes...', tripDate: 'December 19, 2013', people: 15, days: 3, approxBudget: 3000, email: 'jessica.hanson@example.com', phoneNumber: '91-8837372732', message: 'Donec sed erat ut magna suscipit...' },
    { name: 'Dianne Russell', location: 'Godric\'s Hollow', tripDate: 'February 29, 2012', people: 12, days: 6, approxBudget: 5045, email: 'tanya.hill@example.com', phoneNumber: '91-9838313132', message: 'Donec sed erat ut magna suscipit...' },
    { name: 'Darlene Robertson', location: 'Olivanders', tripDate: 'October 30, 2017', people: 24, days: 4, approxBudget: 9261, email: 'bill.sanders@example.com', phoneNumber: '91-8837372732', message: 'Vestibulum eu quam nec neque p...' },
    { name: 'Albert Flores', location: 'House of Gaunt', tripDate: 'February 28, 2018', people: 23, days: 2, approxBudget: 1784, email: 'tim.jennings@example.com', phoneNumber: '91-8862466329', message: 'Vestibulum eu quam nec neque p...' },
    { name: 'Leslie Alexander', location: 'House of Gaunt', tripDate: 'May 31, 2015', people: 21, days: 2, approxBudget: 5560, email: 'nathan.roberts@example.com', phoneNumber: '91-9838313132', message: 'Vestibulum eu quam nec neque p...' },
    { name: 'Kathryn Murphy', location: 'Florean Fortes...', tripDate: 'May 9, 2014', people: 24, days: 1, approxBudget: 1148, email: 'georgia.young@example.com', phoneNumber: '91-8837372732', message: 'Aliquam palutac vestibulum sem ...' },
    { name: 'Floyd Miles', location: 'Olivanders', tripDate: 'March 6, 2018', people: 21, days: 5, approxBudget: 5946, email: 'jackson.graham@example.com', phoneNumber: '91-9838313132', message: 'Aliquam palutac vestibulum sem ...' },
    { name: 'Devon Lane', location: 'Florean Fortes...', tripDate: 'March 23, 2013', people: 12, days: 7, approxBudget: 6025, email: 'sara.cruz@example.com', phoneNumber: '91-9935648723', message: 'In a Iorpret puros. Integer ligure c...' },
    { name: 'Ronald Richards', location: 'Olivanders', tripDate: 'September 9, 2013', people: 15, days: 7, approxBudget: 9359, email: 'felicia.reid@example.com', phoneNumber: '91-8862466329', message: 'felicia.reid@example.com' },
    { name: 'Darrell Steward', location: 'Little Hangleton', tripDate: 'May 12, 2019', people: 15, days: 4, approxBudget: 4000, email: 'michelle.rivera@example.com', phoneNumber: '91-8862466329', message: 'Aliquam porta nisl dolor, molestie...' },
    { name: 'Jerome Bell', location: 'Florean Fortes...', tripDate: 'December 19, 2013', people: 15, days: 3, approxBudget: 3000, email: 'jessica.hanson@example.com', phoneNumber: '91-8837372732', message: 'Donec sed erat ut magna suscipit...' },
    { name: 'Dianne Russell', location: 'Godric\'s Hollow', tripDate: 'February 29, 2012', people: 12, days: 6, approxBudget: 5045, email: 'tanya.hill@example.com', phoneNumber: '91-9838313132', message: 'Donec sed erat ut magna suscipit...' },
    { name: 'Darlene Robertson', location: 'Olivanders', tripDate: 'October 30, 2017', people: 24, days: 4, approxBudget: 9261, email: 'bill.sanders@example.com', phoneNumber: '91-8837372732', message: 'Vestibulum eu quam nec neque p...' },
    { name: 'Albert Flores', location: 'House of Gaunt', tripDate: 'February 28, 2018', people: 23, days: 2, approxBudget: 1784, email: 'tim.jennings@example.com', phoneNumber: '91-8862466329', message: 'Vestibulum eu quam nec neque p...' },
    { name: 'Leslie Alexander', location: 'House of Gaunt', tripDate: 'May 31, 2015', people: 21, days: 2, approxBudget: 5560, email: 'nathan.roberts@example.com', phoneNumber: '91-9838313132', message: 'Vestibulum eu quam nec neque p...' },
    { name: 'Kathryn Murphy', location: 'Florean Fortes...', tripDate: 'May 9, 2014', people: 24, days: 1, approxBudget: 1148, email: 'georgia.young@example.com', phoneNumber: '91-8837372732', message: 'Aliquam palutac vestibulum sem ...' },
    { name: 'Floyd Miles', location: 'Olivanders', tripDate: 'March 6, 2018', people: 21, days: 5, approxBudget: 5946, email: 'jackson.graham@example.com', phoneNumber: '91-9838313132', message: 'Aliquam palutac vestibulum sem ...' },
    { name: 'Devon Lane', location: 'Florean Fortes...', tripDate: 'March 23, 2013', people: 12, days: 7, approxBudget: 6025, email: 'sara.cruz@example.com', phoneNumber: '91-9935648723', message: 'In a Iorpret puros. Integer ligure c...' },
    { name: 'Ronald Richards', location: 'Olivanders', tripDate: 'September 9, 2013', people: 15, days: 7, approxBudget: 9359, email: 'felicia.reid@example.com', phoneNumber: '91-8862466329', message: 'felicia.reid@example.com' },
  ];

  // Bookings Column Definitions
  bookingsColumnDefs: ColDef[] = [
    {
      headerName: '',
      field: 'checkbox',
      width: 50,
      sortable: false,
      filter: false,
      resizable: false,
      suppressMenu: true,
      pinned: 'left',
      cellRenderer: CheckboxCellRendererComponent,
      headerComponent: HeaderCheckboxRendererComponent,
      suppressSizeToFit: true
    },
    {
      headerName: 'User',
      field: 'userName',
      width: 240,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        filterOptions: ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith'],
        defaultOption: 'contains',
        suppressAndOrCondition: true,
        maxNumConditions: 1
      }
    },
    {
      headerName: 'Batch',
      field: 'batchName',
      width: 200,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        filterOptions: ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith'],
        defaultOption: 'contains',
        suppressAndOrCondition: true,
        maxNumConditions: 1
      }
    },
    {
      headerName: 'Name',
      field: 'name',
      width: 240,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        filterOptions: ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith'],
        defaultOption: 'contains',
        suppressAndOrCondition: true,
        maxNumConditions: 1
      }
    },
    {
      headerName: 'Phone Number',
      field: 'phoneNumber',
      width: 240,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        filterOptions: ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith'],
        defaultOption: 'contains',
        suppressAndOrCondition: true,
        maxNumConditions: 1
      }
    },
    {
      headerName: 'Guardian Number',
      field: 'guardianNumber',
      width: 300,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        filterOptions: ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith'],
        defaultOption: 'contains',
        suppressAndOrCondition: true,
        maxNumConditions: 1
      }
    },
    {
      headerName: 'Email',
      field: 'email',
      width: 400,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        filterOptions: ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith'],
        defaultOption: 'contains',
        suppressAndOrCondition: true,
        maxNumConditions: 1
      }
    },
    {
      headerName: 'Payment',
      field: 'payment',
      width: 200,
      filter: 'agNumberColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      cellStyle: { textAlign: 'center' },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        filterOptions: ['equals', 'notEqual', 'lessThan', 'lessThanOrEqual', 'greaterThan', 'greaterThanOrEqual'],
        defaultOption: 'equals',
        suppressAndOrCondition: true,
        maxNumConditions: 1
      }
    },
    {
      headerName: 'Travellers',
      field: 'travellers',
      width: 200,
      filter: 'agNumberColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      cellStyle: { textAlign: 'center' },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        filterOptions: ['equals', 'notEqual', 'lessThan', 'lessThanOrEqual', 'greaterThan', 'greaterThanOrEqual'],
        defaultOption: 'equals',
        suppressAndOrCondition: true,
        maxNumConditions: 1
      }
    },
    {
      headerName: 'Room Type',
      field: 'roomType',
      width: 230,
      filter: 'agSetColumnFilter',
      sortable: true,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        values: ['Single', 'Double', 'Triple']
      }
    },
    {
      headerName: 'Invoice',
      field: 'invoice',
      width: 150,
      sortable: false,
      filter: false,
      resizable: true,
      headerComponent: CustomHeaderRendererComponent,
      cellStyle: { textAlign: 'center' },
      cellRenderer: (params: any) => {
        if (params.data && params.data.id) {
          return `<button class="action-btn download-invoice-btn" data-action="download-invoice" data-booking-id="${params.data.id}" 
                    style="border: none; background: none; cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.979 19.804 4.587 19.412C4.195 19.02 3.99933 18.5493 4 18V15H6V18H18V15H20V18C20 18.55 19.804 19.021 19.412 19.413C19.02 19.805 18.5493 20.0007 18 20H6Z" fill="#666"/>
                    </svg>
                  </button>`;
        }
        return '';
      }
    },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 150,
      suppressSizeToFit: true,
      sortable: false,
      filter: false,
      resizable: false,
      cellRenderer: (params: any) => {
        return `<div style="display: flex; gap: 8px; align-items: center; justify-content: center;">
          <button class="action-btn edit-btn" data-action="edit" style="border: none; background: none; cursor: pointer; padding: 4px;">
            <img src="assets/ri_edit-fill.png" alt="Edit" width="18" height="18" />
          </button>
          <button class="action-btn delete-btn" data-action="delete" style="border: none; background: none; cursor: pointer; padding: 4px;">
            <img src="assets/ant-design_delete-filled.svg" alt="Delete" width="18" height="18" />
          </button>
        </div>`;
      }
    }
  ];

  // Row Data for Bookings
  bookingsRowData: Booking[] = [];

  // Default column definitions
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: false
  };

  // Grid options
  gridOptions = {
    pagination: true,
    paginationPageSize: 20,
    suppressRowClickSelection: true,
    rowSelection: 'multiple' as const,
    animateRows: true,
    enableCellTextSelection: true,
    ensureDomOrder: true,
    suppressCellFocus: true
  };

  constructor(
    private staticService: StaticService,
    private adminService: AdminService,
    private router: Router
  ) {
    // Initialize grid contexts
    this.tripsGridContext = {
      componentParent: this,
      updateStatus: this.updateTripStatus
    };
    this.batchesGridContext = {
      componentParent: this,
      updateStatus: this.updateBatchStatus
    };
    this.couponsGridContext = {
      componentParent: this,
      updateStatus: this.updateCouponStatus
    };
  }

  ngOnInit(): void {
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Fetch trips data from API with pagination
    this.loadTripsData();
  }

  private loadTripsData(page: number = 1) {
    this.adminService.getTrips(page, this.tripsPageSize).subscribe({
      next: (response) => {
        if (response && response.trips && Array.isArray(response.trips)) {
          this.tripsCurrentPage = response.page || page;
          this.tripsTotalCount = response.total || 0;
          this.tripsTotalPages = response.totalPages || 0;
          
          this.rowData = response.trips.map((trip: any) => ({
            id: trip.id,
            name: trip.destination_name || '',
            startDate: this.formatDate(trip.from_month),
            endDate: this.formatDate(trip.to_month),
            status: trip.status ? 'active' : 'inactive'
          }));
          
          // Refresh the grid if it's already initialized
          if (this.gridApi) {
            this.gridApi.setRowData(this.rowData);
          }
        }
      },
      error: (error) => {
        console.error('Error fetching trips:', error);
      }
    });
  }

  // Helper method to format date from API response
  private formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(Number(dateString) * 1000);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  ngOnDestroy(): void {
    // Restore body scroll when leaving admin page
    document.body.style.overflow = 'auto';
  }

  onTabChange(index: number) {
    this.selectedTab = index;
    
    // Close all forms when tab changes
    this.showTripsForm = false;
    this.showBatchesForm = false;
    this.showUsersForm = false;
    this.showCouponsForm = false;
    this.showLeadsForm = false;
    this.showBookingsForm = false;
    
    // Fetch batches data when switching to batches tab (index 1)
    if (index === 1) {
      this.loadBatchesData();
    }
    // Fetch users data when switching to users tab (index 2)
    else if (index === 2) {
      this.loadUsersData();
    }
    // Fetch banners data when switching to banners tab (index 3)
    else if (index === 3) {
      this.loadBannersData();
    }
    // Fetch coupons data when switching to coupons tab (index 4)
    else if (index === 4) {
      this.loadCouponsData();
    }
    // Fetch leads data when switching to leads tab (index 5)
    else if (index === 5) {
      this.loadLeadsData();
    }
    // Fetch bookings data when switching to bookings tab (index 6)
    else if (index === 6) {
      this.loadBookingsData();
    }
  }

  private loadBatchesData(page: number = 1) {
    this.adminService.getBatches(page, this.batchesPageSize).subscribe({
      next: (response) => {
        if (response && response.batches && Array.isArray(response.batches)) {
          this.batchesCurrentPage = response.page || page;
          this.batchesTotalCount = response.total || 0;
          this.batchesTotalPages = response.totalPages || 0;
          
          this.batchesRowData = response.batches.map((batch: any) => {
            // Calculate tripProgress based on dates
            let tripProgress = '';
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); // Reset time for date-only comparison
            
            if (batch.from_date && batch.to_date) {
              const fromDate = new Date(batch.from_date * 1000);
              fromDate.setHours(0, 0, 0, 0);
              const toDate = new Date(batch.to_date * 1000);
              toDate.setHours(0, 0, 0, 0);

              if (currentDate < fromDate) {
                tripProgress = 'Upcoming';
              } else if (currentDate >= fromDate && currentDate <= toDate) {
                tripProgress = 'In Progress';
              } else if (currentDate > toDate) {
                tripProgress = 'Completed';
              }
            }
            
            return {
              id: batch.id || '',
              batchName: batch.batch_name || '',
              assignedTrip: batch.destination_name || batch.tripName || '',
              startDate: batch.from_date ? new Date(batch.from_date * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '',
              endDate: batch.to_date ? new Date(batch.to_date * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '',
              standardPrice: batch.price || 0,
              singleRoom: batch.single_room || 0,
              doubleRoom: batch.double_room || 0,
              tripleRoom: batch.triple_room || 0,
              tax: batch.tax + '%' || '0%',
              travelers: (batch.users.length > 0 ? batch.users[0] : '') + (batch.users.length > 1 ? ' + ' + batch.users.length : '') || '',
              tripProgress: tripProgress,
              count: batch.max_adventurers|| 0,
              availability: batch.users_count <= batch.max_adventurers/3 ? 'Available' : batch.users_count === batch.max_adventurers ? 'Sold Out' : 'Filling Fast',
              status: batch.status ? 'active' : 'inactive',
              hasUsers: batch.users && batch.users.length > 0
            };
          });
          
          // Refresh the batches grid if it's already initialized
          if (this.batchesGridApi) {
            this.batchesGridApi.setRowData(this.batchesRowData);
          }
        }
      },
      error: (error) => {
        console.error('Error fetching batches:', error);
      }
    });
  }

  updateTripStatus = (rowData: any, newStatus: string) => {
    // Convert string status to boolean for backend
    const statusBoolean = newStatus === 'active';
    this.adminService.updateTrip(rowData.id, { status: statusBoolean }).subscribe({
      next: (response) => {
      },
      error: (error) => {
        console.error('Error updating trip status:', error);
        // Revert the status change in the grid on error
        const node = this.gridApi.getRowNode(rowData.id);
        if (node) {
          const revertedStatus = newStatus === 'active' ? 'inactive' : 'active';
          node.setDataValue('status', revertedStatus);
        }
      }
    });
  }

  updateBatchStatus = (rowData: any, newStatus: string) => {
    // Convert string status to boolean for backend
    const statusBoolean = newStatus === 'active';
    this.adminService.updateBatch(rowData.id, { status: statusBoolean }).subscribe({
      next: (response) => {
      },
      error: (error) => {
        console.error('Error updating batch status:', error);
        // Revert the status change in the grid on error
        const node = this.batchesGridApi.getRowNode(rowData.id);
        if (node) {
          const revertedStatus = newStatus === 'active' ? 'inactive' : 'active';
          node.setDataValue('status', revertedStatus);
        }
      }
    });
  }

  updateCouponStatus = (rowData: any, newStatus: string) => {
    // Convert string status to boolean for backend
    const statusBoolean = newStatus === 'active';
    this.adminService.updateCoupon(rowData.id, { status: statusBoolean }).subscribe({
      next: (response) => {
        console.log('Coupon status updated successfully');
      },
      error: (error) => {
        console.error('Error updating coupon status:', error);
        // Revert the status change in the grid on error
        const node = this.couponsGridApi.getRowNode(rowData.id);
        if (node) {
          const revertedStatus = newStatus === 'active' ? 'inactive' : 'active';
          node.setDataValue('status', revertedStatus);
        }
      }
    });
  }

  private loadUsersData(page: number = 1) {
    this.adminService.getUsers(page, this.usersPageSize).subscribe({
      next: (response) => {
        if (response && response.users && Array.isArray(response.users)) {
          this.usersCurrentPage = response.page || page;
          this.usersTotalCount = response.total || 0;
          this.usersTotalPages = response.totalPages || 0;
          
          this.usersRowData = response.users.map((user: any) => {
            // Format associated trips
            let associatedTrips = '—';
            let hasTrips = false;
            if (user.trips && Array.isArray(user.trips) && user.trips.length > 0) {
              // Filter out null values
              const validTrips = user.trips.filter((trip: any) => trip !== null);
              if (validTrips.length > 0) {
                hasTrips = true;
                // Remove duplicates and get unique trip names
                const uniqueTrips = [...new Set(validTrips)] as string[];
                if (uniqueTrips.length === 1) {
                  associatedTrips = uniqueTrips[0];
                } else if (uniqueTrips.length > 1) {
                  associatedTrips = `${uniqueTrips[0]} +${String(uniqueTrips.length - 1).padStart(2, '0')}`;
                }
              }
            }
            
            return {
              id: user.id,
              name: user.name || '',
              email: user.email || '',
              associatedTrips: associatedTrips,
              phoneNumber: user.phone_number ? String(user.phone_number) : '',
              role: user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase() : 'User',
              hasTrips: hasTrips
            };
          });
          
          // Refresh the users grid if it's already initialized
          if (this.usersGridApi) {
            this.usersGridApi.setRowData(this.usersRowData);
          }
        }
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  private loadLeadsData(page: number = 1) {
    this.adminService.getLeads(page, this.leadsPageSize).subscribe({
      next: (response) => {
        if (response && Array.isArray(response)) {
          this.leadsCurrentPage = page;
          this.leadsTotalCount = response.length;
          this.leadsTotalPages = Math.ceil(response.length / this.leadsPageSize);
          
          this.leadsRowData = response.map((lead: any) => {
            // Format trip date
            let tripDate = '—';
            if (lead.date) {
              const date = new Date(lead.date * 1000); // Convert seconds to milliseconds
              tripDate = date.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              });
            }

            return {
              id: lead.id,
              name: lead.name || '',
              location: lead.location || '',
              tripDate: tripDate,
              people: lead.travellers || 0,
              days: lead.days || 0,
              approxBudget: lead.budget || 0,
              email: lead.email || '',
              phoneNumber: lead.phone ? String(lead.phone) : '',
              message: lead.message || '',
              createdAt: lead.created_at || 0
            };
          });
          
          // Refresh the leads grid if it's already initialized
          if (this.leadsGridApi) {
            this.leadsGridApi.setRowData(this.leadsRowData);
          }
        }
      },
      error: (error) => {
        console.error('Error fetching leads:', error);
      }
    });
  }

  private loadBannersData() {
    this.adminService.getBanners().subscribe({
      next: (response) => {
        if (response && response.banners && Array.isArray(response.banners)) {
          // Store all banners data
          this.allBannersData = response.banners.map((banner: any) => {
            return {
              id: banner.id,
              bannerName: this.toTitleCase(banner.banner_name || ''),
              description: banner.description || '',
              status: banner.status ? 'active' : 'inactive'
            };
          });
          
          // Calculate pagination
          this.bannersTotalCount = this.allBannersData.length;
          this.bannersTotalPages = Math.ceil(this.bannersTotalCount / this.bannersPageSize);
          
          // Get current page data
          this.updateBannersPageData();
        }
      },
      error: (error) => {
        console.error('Error fetching banners:', error);
      }
    });
  }

  private updateBannersPageData() {
    const startIndex = (this.bannersCurrentPage - 1) * this.bannersPageSize;
    const endIndex = startIndex + this.bannersPageSize;
    this.bannersRowData = this.allBannersData.slice(startIndex, endIndex);
    
    // Refresh the banners grid if it's already initialized
    if (this.bannersGridApi) {
      this.bannersGridApi.setRowData(this.bannersRowData);
    }
  }

  goToBannersPage(page: number) {
    if (page >= 1 && page <= this.bannersTotalPages) {
      this.bannersCurrentPage = page;
      this.updateBannersPageData();
    }
  }

  private toTitleCase(str: string): string {
    return str.replace(/_/g, ' ').toLowerCase().split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }

  private loadCouponsData(page: number = 1) {
    this.adminService.getCoupons(page, this.couponsPageSize).subscribe({
      next: (response) => {
        if (response && response.coupons && Array.isArray(response.coupons)) {
          this.couponsCurrentPage = response.page || page;
          this.couponsTotalCount = response.total || 0;
          this.couponsTotalPages = response.totalPages || 0;
          
          this.couponsRowData = response.coupons.map((coupon: any) => {
            return {
              id: coupon.id,
              couponCode: coupon.code || '',
              deduction: coupon.deduction ? `${coupon.deduction}%` : '',
              startDate: this.formatDate(coupon.start_date),
              endDate: this.formatDate(coupon.end_date),
              status: coupon.status ? 'active' : 'inactive'
            };
          });
          
          // Refresh the coupons grid if it's already initialized
          if (this.couponsGridApi) {
            this.couponsGridApi.setRowData(this.couponsRowData);
          }
        }
      },
      error: (error) => {
        console.error('Error fetching coupons:', error);
      }
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();
    this.adjustRowHeight();
  }

  onCellClicked(event: any) {
    if (event.event.target.closest('.action-btn')) {
      const action = event.event.target.closest('.action-btn').dataset.action;
      if (action === 'edit') {
        this.tripsFormMode = 'edit';
        this.handleEditTrip(event.data);
      } else if (action === 'delete') {
        // Handle delete action
      }
    }
  }

  onFirstDataRendered(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
    this.adjustRowHeight();
  }

  adjustRowHeight() {
    if (!this.gridApi) return;

    const gridElement = document.querySelector('.trips-grid') as HTMLElement;
    if (!gridElement) return;

    const displayedRowCount = this.gridApi.getDisplayedRowCount();
    if (displayedRowCount === 0) return;

    // Get the grid body height (excluding header and pagination)
    const gridHeight = gridElement.clientHeight;
    const headerHeight = 56; // Approximate header height
    const paginationHeight = 56; // Approximate pagination height
    const availableHeight = gridHeight - headerHeight - paginationHeight;

    // Calculate row height to fill available space
    const calculatedRowHeight = Math.floor(availableHeight / displayedRowCount);
    const minRowHeight = 40; // Minimum row height for readability
    const maxRowHeight = 80; // Maximum row height of 5rem (80px)
    const rowHeight = Math.min(Math.max(calculatedRowHeight, minRowHeight), maxRowHeight);

    // Set the row height
    this.gridApi.forEachNode((node) => {
      node.setRowHeight(rowHeight);
    });
    this.gridApi.onRowHeightChanged();
  }

  onSelectionChanged(event: any) {
    const selectedRows = event.api.getSelectedRows();
    this.selectedRowCount = selectedRows.length;
  }

  // Batches Grid Event Handlers
  onBatchesGridReady(params: GridReadyEvent) {
    this.batchesGridApi = params.api;
    this.adjustBatchesRowHeight();
  }

  goToBatchesPage(page: number) {
    if (page >= 1 && page <= this.batchesTotalPages) {
      this.loadBatchesData(page);
    }
  }

  goToTripsPage(page: number) {
    if (page >= 1 && page <= this.tripsTotalPages) {
      this.loadTripsData(page);
    }
  }

  goToCouponsPage(page: number) {
    if (page >= 1 && page <= this.couponsTotalPages) {
      this.loadCouponsData(page);
    }
  }

  goToUsersPage(page: number) {
    if (page >= 1 && page <= this.usersTotalPages) {
      this.loadUsersData(page);
    }
  }

  // Make Math available in template
  Math = Math;

  onBatchesCellClicked(event: any) {
    if (event.event.target.closest('.action-btn')) {
      const action = event.event.target.closest('.action-btn').dataset.action;
      if (action === 'edit') {
        // Get the batch ID from the row data
        const batchId = event.data.id || event.data.batchId;
        if (batchId) {
          this.adminService.getBatchById(batchId).subscribe({
            next: (response) => {
              if (response && response.success && response.batch) {
                this.currentEntityType = 'batches';
                this.editBatchData = response.batch;
                this.batchesFormMode = 'edit';
                this.showBatchesForm = true;
              }
            },
            error: (error) => {
              console.error('Error fetching batch details:', error);
            }
          });
        }
      } else if (action === 'delete') {
        const batchId = event.data.id || event.data.batchId;
        const batchName = event.data.batchName;
        
        if (batchId && confirm(`Are you sure you want to delete batch "${batchName}"?`)) {
          this.adminService.deleteBatch(batchId).subscribe({
            next: (response) => {
              if (response && response.success) {
                // Reload the batches data to reflect the deletion
                this.loadBatchesData(this.batchesCurrentPage);
              }
            },
            error: (error) => {
              console.error('Error deleting batch:', error);
              alert(error.error?.error || 'Failed to delete batch. Please try again.');
            }
          });
        }
      }
    }
  }

  onBatchesFirstDataRendered(params: GridReadyEvent) {
    this.adjustBatchesRowHeight();
  }

  adjustBatchesRowHeight() {
    if (!this.batchesGridApi) return;

    const gridElement = document.querySelector('.batches-grid') as HTMLElement;
    if (!gridElement) return;

    const displayedRowCount = this.batchesGridApi.getDisplayedRowCount();
    if (displayedRowCount === 0) return;

    // Get the grid body height (excluding header and pagination)
    const gridHeight = gridElement.clientHeight;
    const headerHeight = 48; // Reduced header height estimate
    const paginationHeight = 48; // Reduced pagination height estimate
    const availableHeight = gridHeight - headerHeight - paginationHeight;

    // Calculate row height to fill available space
    const calculatedRowHeight = Math.floor(availableHeight / displayedRowCount);
    const minRowHeight = 40; // Minimum row height for readability
    const maxRowHeight = 80; // Maximum row height of 5rem (80px)
    const rowHeight = Math.min(Math.max(calculatedRowHeight, minRowHeight), maxRowHeight);

    // Set the row height
    this.batchesGridApi.forEachNode((node) => {
      node.setRowHeight(rowHeight);
    });
    this.batchesGridApi.onRowHeightChanged();
  }

  onBatchesSelectionChanged(event: any) {
    const selectedRows = event.api.getSelectedRows();
    this.batchesSelectedRowCount = selectedRows.length;
  }

  // Users Grid Event Handlers
  onUsersGridReady(params: GridReadyEvent) {
    this.usersGridApi = params.api;
    params.api.sizeColumnsToFit();
    this.adjustUsersRowHeight();
  }

  onUsersCellClicked(event: any) {
    if (event.event.target.closest('.action-btn')) {
      const action = event.event.target.closest('.action-btn').dataset.action;
      if (action === 'delete') {
        console.log('Delete user clicked for:', event.data);
        const userId = event.data.id;
        const userName = event.data.name;
        
        if (userId && confirm(`Are you sure you want to delete user "${userName}"?`)) {
          this.adminService.deleteUser(userId).subscribe({
            next: (response) => {
              if (response && response.success) {
                console.log('User deleted successfully');
                // Reload the users data to reflect the deletion
                this.loadUsersData(this.usersCurrentPage);
              }
            },
            error: (error) => {
              console.error('Error deleting user:', error);
              alert(error.error?.error || 'Failed to delete user. Please try again.');
            }
          });
        }
      }
    }
  }

  onUsersFirstDataRendered(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
    this.adjustUsersRowHeight();
  }

  adjustUsersRowHeight() {
    if (!this.usersGridApi) return;

    const gridElement = document.querySelector('.users-grid') as HTMLElement;
    if (!gridElement) return;

    const displayedRowCount = this.usersGridApi.getDisplayedRowCount();
    if (displayedRowCount === 0) return;

    // Get the grid body height (excluding header and pagination)
    const gridHeight = gridElement.clientHeight;
    const headerHeight = 48; // Reduced header height estimate
    const paginationHeight = 48; // Reduced pagination height estimate
    const availableHeight = gridHeight - headerHeight - paginationHeight;

    // Calculate row height to fill available space
    const calculatedRowHeight = Math.floor(availableHeight / displayedRowCount);
    const minRowHeight = 40; // Minimum row height for readability
    const maxRowHeight = 80; // Maximum row height of 5rem (80px)
    const rowHeight = Math.min(Math.max(calculatedRowHeight, minRowHeight), maxRowHeight);

    // Set the row height
    this.usersGridApi.forEachNode((node) => {
      node.setRowHeight(rowHeight);
    });
    this.usersGridApi.onRowHeightChanged();
  }

  onUsersSelectionChanged(event: any) {
    const selectedRows = event.api.getSelectedRows();
    this.usersSelectedRowCount = selectedRows.length;
  }

  // Banners Grid Event Handlers
  onBannersGridReady(params: GridReadyEvent) {
    this.bannersGridApi = params.api;
    params.api.sizeColumnsToFit();
    this.adjustBannersRowHeight();
  }

  onBannersCellClicked(event: any) {
    if (event.event.target.closest('.action-btn')) {
      const action = event.event.target.closest('.action-btn').dataset.action;
      if (action === 'upload') {
        this.selectedBannerId = event.data.id;
        // Trigger file input click
        this.bannerImageInput.nativeElement.click();
      }
    }
  }

  onBannerImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file && this.selectedBannerId) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }

      // Upload the image
      const formData = new FormData();
      formData.append('image', file);

      this.adminService.uploadBannerImage(this.selectedBannerId, formData).subscribe({
        next: (response) => {
          alert('Image uploaded successfully!');
          // Reset file input
          this.bannerImageInput.nativeElement.value = '';
          this.selectedBannerId = null;
        },
        error: (error) => {
          console.error('Error uploading banner image:', error);
          alert('Failed to upload image. Please try again.');
          // Reset file input
          this.bannerImageInput.nativeElement.value = '';
          this.selectedBannerId = null;
        }
      });
    }
  }

  onBannersFirstDataRendered(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
    this.adjustBannersRowHeight();
  }

  adjustBannersRowHeight() {
    if (!this.bannersGridApi) return;

    const gridElement = document.querySelector('.banners-grid') as HTMLElement;
    if (!gridElement) return;

    const displayedRowCount = this.bannersGridApi.getDisplayedRowCount();
    if (displayedRowCount === 0) return;

    // Get the grid body height (excluding header and pagination)
    const gridHeight = gridElement.clientHeight;
    const headerHeight = 48;
    const paginationHeight = 48;
    const availableHeight = gridHeight - headerHeight - paginationHeight;

    // Calculate row height to fill available space
    const calculatedRowHeight = Math.floor(availableHeight / displayedRowCount);
    const minRowHeight = 40;
    const maxRowHeight = 80; // Maximum row height of 5rem (80px)
    const rowHeight = Math.min(Math.max(calculatedRowHeight, minRowHeight), maxRowHeight);

    // Set the row height
    this.bannersGridApi.forEachNode((node) => {
      node.setRowHeight(rowHeight);
    });
    this.bannersGridApi.onRowHeightChanged();
  }

  // Coupons Grid Event Handlers
  onCouponsGridReady(params: GridReadyEvent) {
    this.couponsGridApi = params.api;
    params.api.sizeColumnsToFit();
    this.adjustCouponsRowHeight();
  }

  onCouponsCellClicked(event: any) {
    if (event.event.target.closest('.action-btn')) {
      const action = event.event.target.closest('.action-btn').dataset.action;
      if (action === 'edit') {
        console.log('Edit coupon clicked for:', event.data);
        this.handleEditCoupon(event.data);
      } else if (action === 'delete') {
        console.log('Delete coupon clicked for:', event.data);
        const couponId = event.data.id;
        const couponCode = event.data.couponCode;
        
        if (couponId && confirm(`Are you sure you want to delete coupon "${couponCode}"?`)) {
          this.adminService.deleteCoupon(couponId).subscribe({
            next: (response) => {
              if (response && response.success) {
                console.log('Coupon deleted successfully');
                // Reload the coupons data to reflect the deletion
                this.loadCouponsData(this.couponsCurrentPage);
              }
            },
            error: (error) => {
              console.error('Error deleting coupon:', error);
              alert(error.error?.error || 'Failed to delete coupon. Please try again.');
            }
          });
        }
      }
    }
  }

  onCouponsSelectionChanged(event: any) {
    const selectedRows = event.api.getSelectedRows();
    this.couponsSelectedRowCount = selectedRows.length;
  }

  onCouponsFirstDataRendered(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
    this.adjustCouponsRowHeight();
  }

  adjustCouponsRowHeight() {
    if (!this.couponsGridApi) return;

    const gridElement = document.querySelector('.coupons-grid') as HTMLElement;
    if (!gridElement) return;

    const displayedRowCount = this.couponsGridApi.getDisplayedRowCount();
    if (displayedRowCount === 0) return;

    // Get the grid body height (excluding header and pagination)
    const gridHeight = gridElement.clientHeight;
    const headerHeight = 48;
    const paginationHeight = 48;
    const availableHeight = gridHeight - headerHeight - paginationHeight;

    // Calculate row height to fill available space
    const calculatedRowHeight = Math.floor(availableHeight / displayedRowCount);
    const minRowHeight = 40;
    const maxRowHeight = 80; // Maximum row height of 5rem (80px)
    const rowHeight = Math.min(Math.max(calculatedRowHeight, minRowHeight), maxRowHeight);

    // Set the row height
    this.couponsGridApi.forEachNode((node) => {
      node.setRowHeight(rowHeight);
    });
    this.couponsGridApi.onRowHeightChanged();
  }

  // Leads Grid Event Handlers
  onLeadsGridReady(params: GridReadyEvent) {
    this.leadsGridApi = params.api;
    params.api.sizeColumnsToFit();
    this.adjustLeadsRowHeight();
  }

  onLeadsCellClicked(event: any) {
    if (event.event.target.closest('.action-btn')) {
      const action = event.event.target.closest('.action-btn').dataset.action;
      if (action === 'edit') {
        // Handle edit action for leads (not implemented yet)
      } else if (action === 'delete') {
        // Handle delete action for leads
        const leadId = event.data.id;
        if (leadId && confirm('Are you sure you want to delete this lead?')) {
          this.adminService.deleteLead(leadId).subscribe({
            next: () => {
              console.log('Lead deleted successfully');
              this.loadLeadsData(this.leadsCurrentPage);
            },
            error: (error) => {
              console.error('Error deleting lead:', error);
              alert('Failed to delete lead');
            }
          });
        }
      }
    }
  }

  onLeadsSelectionChanged(event: any) {
    const selectedRows = event.api.getSelectedRows();
    this.leadsSelectedRowCount = selectedRows.length;
  }

  onLeadsFirstDataRendered(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
    this.adjustLeadsRowHeight();
  }

  adjustLeadsRowHeight() {
    if (!this.leadsGridApi) return;

    const gridElement = document.querySelector('.leads-grid') as HTMLElement;
    if (!gridElement) return;

    const displayedRowCount = this.leadsGridApi.getDisplayedRowCount();
    if (displayedRowCount === 0) return;

    // Get the grid body height (excluding header and pagination)
    const gridHeight = gridElement.clientHeight;
    const headerHeight = 48;
    const paginationHeight = 48;
    const availableHeight = gridHeight - headerHeight - paginationHeight;

    // Calculate row height to fill available space
    const calculatedRowHeight = Math.floor(availableHeight / displayedRowCount);
    const minRowHeight = 40;
    const maxRowHeight = 80; // Maximum row height of 5rem (80px)
    const rowHeight = Math.min(Math.max(calculatedRowHeight, minRowHeight), maxRowHeight);

    // Set the row height
    this.leadsGridApi.forEachNode((node) => {
      node.setRowHeight(rowHeight);
    });
    this.leadsGridApi.onRowHeightChanged();
  }

  // Toggle form visibility
  openAddEntityForm(entityType: 'trips' | 'batches' | 'users' | 'coupons' | 'leads' | 'bookings') {
    // For leads, navigate to enquire page
    if (entityType === 'leads') {
      this.router.navigate(['/enquire']);
      return;
    }
    
    this.tripsFormMode = 'add';
    this.currentEntityType = entityType;
    // Reset to add mode when opening form via add button
    if (entityType === 'trips') {
      this.tripsFormMode = 'add';
      this.editTripData = null;
    } else if (entityType === 'batches') {
      this.batchesFormMode = 'add';
      this.editBatchData = null;
    } else if (entityType === 'coupons') {
      this.couponsFormMode = 'add';
      this.editCouponData = null;
    } else if (entityType === 'bookings') {
      this.bookingsFormMode = 'add';
      this.editBookingData = null;
    }
    
    switch(entityType) {
      case 'trips':
        this.showTripsForm = true;
        break;
      case 'batches':
        this.showBatchesForm = true;
        break;
      case 'users':
        this.showUsersForm = true;
        break;
      case 'coupons':
        this.showCouponsForm = true;
        break;
      case 'bookings':
        this.showBookingsForm = true;
        break;
    }
  }

  // Close form and return to table view
  closeEntityForm(entityType: 'trips' | 'batches' | 'users' | 'coupons' | 'leads' | 'bookings') {
    switch(entityType) {
      case 'trips':
        this.showTripsForm = false;
        // Reset edit mode
        this.tripsFormMode = 'add';
        this.editTripData = null;
        break;
      case 'batches':
        this.showBatchesForm = false;
        // Reset edit mode
        this.batchesFormMode = 'add';
        this.editBatchData = null;
        break;
      case 'users':
        this.showUsersForm = false;
        break;
      case 'coupons':
        this.showCouponsForm = false;
        // Reset edit mode
        this.couponsFormMode = 'add';
        this.editCouponData = null;
        break;
      case 'leads':
        this.showLeadsForm = false;
        break;
      case 'bookings':
        this.showBookingsForm = false;
        // Reset edit mode
        this.bookingsFormMode = 'add';
        this.editBookingData = null;
        break;
    }
  }

  // Handle form submission
  onFormSubmit(event: { action: string, data: any }) {
    if (event.action === 'save') {
      this.handleEntitySave(this.currentEntityType, event.data);
    } else if (event.action === 'cancel') {
      this.closeEntityForm(this.currentEntityType);
    }
  }

  // Handle entity save based on type
  private handleEntitySave(entityType: string, data: any) {
    
    
    switch (entityType) {
      case 'trips':
        // Check if we're in edit or add mode
        const tripId = data.id;
        
        if (this.tripsFormMode === 'edit' && tripId) {
        console.log('mode', this.tripsFormMode, tripId);
          // Remove id from data before sending
          const { id, ...updateData } = data;
          this.adminService.updateTrip(tripId, updateData).subscribe({
            next: (response) => {
              // Reload trips data to show the updated trip
              this.loadTripsData(this.tripsCurrentPage);
              // Close form only on success
              this.closeEntityForm(entityType);
            },
            error: (error) => {
              console.error('Error updating trip:', error);
              // TODO: Show error message to user
              // Form stays open on error
            }
          });
        } else {
          // Call API to create trip (data is FormData)
          this.adminService.createTrip(data).subscribe({
            next: (response) => {
              // Reload trips data to show the new trip
              this.loadTripsData(1);
              // Close form only on success
              this.closeEntityForm(entityType);
            },
            error: (error) => {
              console.error('Error creating trip:', error);
              // TODO: Show error message to user
              // Form stays open on error
            }
          });
        }
        break;
      case 'batches':
        // Check if we're in edit or add mode
        if (this.batchesFormMode === 'edit' && data.id) {
          const batchId = data.id;
          // Remove id from data as it's passed as URL parameter
          const { id, ...updateData } = data;
          this.adminService.updateBatch(batchId, updateData).subscribe({
            next: (response) => {
              // Reload batches data to show the updated batch
              this.loadBatchesData(this.batchesCurrentPage);
              // Close form only on success
              this.closeEntityForm(entityType);
            },
            error: (error) => {
              console.error('Error updating batch:', error);
              // TODO: Show error message to user
              // Form stays open on error
            }
          });
        } else {
          this.adminService.createBatch(data).subscribe({
            next: (response) => {
              // Reload batches data to show the new batch
              this.loadBatchesData(1);
              // Close form only on success
              this.closeEntityForm(entityType);
            },
            error: (error) => {
              console.error('Error creating batch:', error);
              // TODO: Show error message to user
              // Form stays open on error
            }
          });
        }
        break;
      case 'users':
        // Call API to create user
        this.adminService.createUser(data).subscribe({
          next: (response) => {
            // Reload users data to show the new user
            this.loadUsersData(1);
            // Close form only on success
            this.closeEntityForm(entityType);
          },
          error: (error) => {
            console.error('Error creating user:', error);
            // TODO: Show error message to user
            // Form stays open on error
          }
        });
        break;
      case 'coupons':
        // Check if we're in edit or add mode
        if (this.couponsFormMode === 'edit' && data.id) {
          console.log('Updating coupon:', data);
          const couponId = data.id;
          // Remove id from data as it's passed as URL parameter
          const { id, ...updateData } = data;
          this.adminService.updateCoupon(couponId, updateData).subscribe({
            next: (response) => {
              console.log('Coupon updated successfully:', response);
              // Reload coupons data to show the updated coupon
              this.loadCouponsData(this.couponsCurrentPage);
              // Close form only on success
              this.closeEntityForm(entityType);
            },
            error: (error) => {
              console.error('Error updating coupon:', error);
              // TODO: Show error message to user
              // Form stays open on error
            }
          });
        } else {
          // Call API to create coupon
          console.log('Creating coupon:', data);
          this.adminService.createCoupon(data).subscribe({
            next: (response) => {
              console.log('Coupon created successfully:', response);
              // Reload coupons data to show the new coupon
              this.loadCouponsData(1);
              // Close form only on success
              this.closeEntityForm(entityType);
            },
            error: (error) => {
              console.error('Error creating coupon:', error);
              alert(error.error?.error || 'Failed to create coupon. Please try again.');
              // Form stays open on error
            }
          });
        }
        break;
      case 'leads':
        // Call API to create lead
        break;
      case 'bookings':
        // Check if we're in edit or add mode
        if (this.bookingsFormMode === 'edit') {
          // Extract booking ID from FormData
          let bookingId: string | null = null;
          if (data instanceof FormData) {
            bookingId = data.get('id') as string;
            // Remove id from FormData before sending
            data.delete('id');
          } else if (data.id) {
            bookingId = data.id;
            const { id, ...updateData } = data;
            data = updateData;
          }
          
          if (bookingId) {
            this.adminService.updateBooking(bookingId, data).subscribe({
              next: (response) => {
                console.log('Booking updated successfully');
                // Reload bookings data to show the updated booking
                this.loadBookingsData(this.bookingsCurrentPage);
                // Close form only on success
                this.closeEntityForm(entityType);
              },
              error: (error) => {
                console.error('Error updating booking:', error);
                alert(error.error?.error || 'Failed to update booking. Please try again.');
                // Form stays open on error
              }
            });
          }
        } else {
          // Call API to create booking
          this.adminService.createBooking(data).subscribe({
            next: (response) => {
              console.log('Booking created successfully');
              // Reload bookings data to show the new booking
              this.loadBookingsData(1);
              // Close form only on success
              this.closeEntityForm(entityType);
            },
            error: (error) => {
              console.error('Error creating booking:', error);
              alert(error.error?.error || 'Failed to create booking. Please try again.');
              // Form stays open on error
            }
          });
        }
        break;
    }
  }

  // Handle edit trip
  private handleEditTrip(tripData: any) {
    // Fetch full trip details by ID
    this.adminService.getTripById(tripData.id).subscribe({
      next: (response) => {
        this.currentEntityType = 'trips';
        this.editTripData = response.trip;
        this.tripsFormMode = 'edit';
        this.showTripsForm = true;
      },
      error: (error) => {
        console.error('Error fetching trip details:', error);
        const errorMessage = error.error?.error || 'Failed to fetch trip details. Please try again.';
        alert(errorMessage);
      }
    });
  }

  // Handle edit coupon
  private handleEditCoupon(couponData: any) {
    console.log('handleEditCoupon called with couponData:', couponData);
    // Fetch full coupon details by ID
    this.adminService.getCouponById(couponData.id).subscribe({
      next: (response) => {
        console.log('Coupon details fetched:', response);
        this.currentEntityType = 'coupons';
        this.editCouponData = response.coupon;
        this.couponsFormMode = 'edit';
        console.log('Set couponsFormMode to:', this.couponsFormMode);
        console.log('Set editCouponData to:', this.editCouponData);
        this.showCouponsForm = true;
      },
      error: (error) => {
        console.error('Error fetching coupon details:', error);
        const errorMessage = error.error?.error || 'Failed to fetch coupon details. Please try again.';
        alert(errorMessage);
      }
    });
  }

  // Handle edit booking
  private handleEditBooking(bookingData: any) {
    // Fetch full booking details by ID
    this.adminService.getBookingById(bookingData.id).subscribe({
      next: (response) => {
        this.currentEntityType = 'bookings';
        this.editBookingData = response.booking;
        this.bookingsFormMode = 'edit';
        this.showBookingsForm = true;
      },
      error: (error) => {
        console.error('Error fetching booking details:', error);
        const errorMessage = error.error?.error || 'Failed to fetch booking details. Please try again.';
        alert(errorMessage);
      }
    });
  }

  // Bookings Grid Event Handlers
  onBookingsGridReady(params: GridReadyEvent) {
    this.bookingsGridApi = params.api;
    params.api.sizeColumnsToFit();
    this.adjustBookingsRowHeight();
  }

  onBookingsCellClicked(event: any) {
    if (event.event.target.closest('.action-btn')) {
      const action = event.event.target.closest('.action-btn').dataset.action;
      if (action === 'edit') {
        console.log('Edit booking clicked for:', event.data);
        this.handleEditBooking(event.data);
      } else if (action === 'delete') {
        console.log('Delete booking clicked for:', event.data);
        const bookingId = event.data.id;
        const bookingName = event.data.name;
        
        if (bookingId && confirm(`Are you sure you want to delete booking for "${bookingName}"?`)) {
          this.adminService.deleteBooking(bookingId).subscribe({
            next: (response) => {
              if (response && response.success) {
                console.log('Booking deleted successfully');
                // Reload the bookings data to reflect the deletion
                this.loadBookingsData(this.bookingsCurrentPage);
              }
            },
            error: (error) => {
              console.error('Error deleting booking:', error);
              alert(error.error?.error || 'Failed to delete booking. Please try again.');
            }
          });
        }
      } else if (action === 'download-invoice') {
        const bookingId = event.event.target.closest('.action-btn').dataset.bookingId;
        if (bookingId) {
          this.downloadInvoice(bookingId);
        }
      }
    }
  }

  onBookingsSelectionChanged(event: any) {
    const selectedRows = event.api.getSelectedRows();
    this.bookingsSelectedRowCount = selectedRows.length;
  }

  onBookingsFirstDataRendered(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
    this.adjustBookingsRowHeight();
  }

  adjustBookingsRowHeight() {
    if (!this.bookingsGridApi) return;

    const gridElement = document.querySelector('.bookings-grid') as HTMLElement;
    if (!gridElement) return;

    const displayedRowCount = this.bookingsGridApi.getDisplayedRowCount();
    if (displayedRowCount === 0) return;

    // Get the grid body height (excluding header and pagination)
    const gridHeight = gridElement.clientHeight;
    const headerHeight = 48;
    const paginationHeight = 48;
    const availableHeight = gridHeight - headerHeight - paginationHeight;

    // Calculate row height to fill available space
    const calculatedRowHeight = Math.floor(availableHeight / displayedRowCount);
    const minRowHeight = 40;
    const maxRowHeight = 80;
    const rowHeight = Math.min(Math.max(calculatedRowHeight, minRowHeight), maxRowHeight);

    // Set the row height
    this.bookingsGridApi.forEachNode((node) => {
      node.setRowHeight(rowHeight);
    });
    this.bookingsGridApi.onRowHeightChanged();
  }

  private loadBookingsData(page: number = 1) {
    this.adminService.getBookings(page, this.bookingsPageSize).subscribe({
      next: (response) => {
        if (response && response.bookings && Array.isArray(response.bookings)) {
          this.bookingsCurrentPage = response.page || page;
          this.bookingsTotalCount = response.total || 0;
          this.bookingsTotalPages = response.totalPages || 0;
          
          this.bookingsRowData = response.bookings.map((booking: any) => {
            return {
              id: booking.id,
              userName: booking.user_name || '',
              batchName: booking.batch_name || '',
              name: booking.name || '',
              phoneNumber: booking.phone_number ? String(booking.phone_number) : '',
              guardianNumber: booking.guardian_number ? String(booking.guardian_number) : '',
              email: booking.email || '',
              payment: booking.payment || 0,
              travellers: booking.travellers || 0,
              roomType: booking.room_type || '',
              invoice: booking.invoice || ''
            };
          });
          
          // Refresh the bookings grid if it's already initialized
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

  goToBookingsPage(page: number) {
    if (page >= 1 && page <= this.bookingsTotalPages) {
      this.loadBookingsData(page);
    }
  }

  downloadInvoice(bookingId: string) {
    console.log('Downloading invoice for booking:', bookingId);
    this.adminService.getBookingInvoice(bookingId).subscribe({
      next: (response) => {
        if (response && response.success && response.downloadUrl) {
          // S3 signed URL with Content-Disposition header will automatically trigger download
          // Create a temporary anchor element to trigger download
          const link = document.createElement('a');
          link.href = response.downloadUrl;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      },
      error: (error) => {
        console.error('Error downloading invoice:', error);
        alert(error.error?.error || 'Failed to download invoice. Please try again.');
      }
    });
  }
}
