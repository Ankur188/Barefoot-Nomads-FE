import { Component, OnInit, OnDestroy } from '@angular/core';
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
  name: string;
  email: string;
  associatedTrips: string;
  phoneNumber: string;
  role: string;
}

interface Banner {
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
  selectedRowCount = 0;
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
  couponsSelectedRowCount = 0;
  leadsSelectedRowCount = 0;

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
          <button class="action-btn delete-btn" data-action="delete" style="border: none; background: none; cursor: pointer; padding: 4px;">
            <img src="assets/ant-design_delete-filled.svg" alt="Delete" width="18" height="18" />
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
        return `<div style="display: flex; gap: 8px; align-items: center; justify-content: center;">
          <button class="action-btn delete-btn" data-action="delete" style="border: none; background: none; cursor: pointer; padding: 4px;">
            <img src="assets/ant-design_delete-filled.svg" alt="Delete" width="18" height="18" />
          </button>
        </div>`;
      }
    }
  ];

  // Row Data for Users
  usersRowData: User[] = [
    { name: 'Darrell Steward', email: 'michelle.rivera@example.com', associatedTrips: '—', phoneNumber: '91-8862466329', role: 'Admin' },
    { name: 'Jerome Bell', email: 'jessica.hanson@example.com', associatedTrips: 'Little Hangleton', phoneNumber: '91-8837372732', role: 'User' },
    { name: 'Dianne Russell', email: 'tanya.hill@example.com', associatedTrips: '—', phoneNumber: '91- 9838313132', role: 'User' },
    { name: 'Darlene Robertson', email: 'bill.sanders@example.com', associatedTrips: 'Forest of Dean +03', phoneNumber: '91-8837372732', role: 'User' },
    { name: 'Albert Flores', email: 'tim.jennings@example.com', associatedTrips: 'Forest of Dean', phoneNumber: '91-8862466329', role: 'User' },
    { name: 'Leslie Alexander', email: 'nathan.roberts@example.com', associatedTrips: 'Little Hangleton +02', phoneNumber: '91- 9838313132', role: 'User' },
    { name: 'Kathryn Murphy', email: 'georgia.young@example.com', associatedTrips: 'House of Gaunt +05', phoneNumber: '91-8862466329', role: 'User' },
    { name: 'Floyd Miles', email: 'jackson.graham@example.com', associatedTrips: '—', phoneNumber: '91- 9838313132', role: 'User' },
    { name: 'Devon Lane', email: 'sara.cruz@example.com', associatedTrips: 'Forest of Dean +01', phoneNumber: '91-9935648723', role: 'User' },
    { name: 'Ronald Richards', email: 'felicia.reid@example.com', associatedTrips: '—', phoneNumber: '91-8862466329', role: 'User' },
    { name: 'Darrell Steward', email: 'michelle.rivera@example.com', associatedTrips: '—', phoneNumber: '91-8862466329', role: 'Admin' },
    { name: 'Jerome Bell', email: 'jessica.hanson@example.com', associatedTrips: 'Little Hangleton', phoneNumber: '91-8837372732', role: 'User' },
    { name: 'Dianne Russell', email: 'tanya.hill@example.com', associatedTrips: '—', phoneNumber: '91- 9838313132', role: 'User' },
    { name: 'Darlene Robertson', email: 'bill.sanders@example.com', associatedTrips: 'Forest of Dean +03', phoneNumber: '91-8837372732', role: 'User' },
    { name: 'Albert Flores', email: 'tim.jennings@example.com', associatedTrips: 'Forest of Dean', phoneNumber: '91-8862466329', role: 'User' },
    { name: 'Leslie Alexander', email: 'nathan.roberts@example.com', associatedTrips: 'Little Hangleton +02', phoneNumber: '91- 9838313132', role: 'User' },
    { name: 'Kathryn Murphy', email: 'georgia.young@example.com', associatedTrips: 'House of Gaunt +05', phoneNumber: '91-8862466329', role: 'User' },
    { name: 'Floyd Miles', email: 'jackson.graham@example.com', associatedTrips: '—', phoneNumber: '91- 9838313132', role: 'User' },
    { name: 'Devon Lane', email: 'sara.cruz@example.com', associatedTrips: 'Forest of Dean +01', phoneNumber: '91-9935648723', role: 'User' },
    { name: 'Ronald Richards', email: 'felicia.reid@example.com', associatedTrips: '—', phoneNumber: '91-8862466329', role: 'User' },
  ];

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
  bannersRowData: Banner[] = [
    { bannerName: 'Home Page banner', description: 'Aliquam porta nisl dolor, molestiColumnseAliquam porta nisl dolor, molestiColumnse..e..', status: 'active' },
    { bannerName: 'Jerome Bell', description: 'Donec sed erat ut magna suscipitAliquam porta nisl dolor, molestiColumnse....', status: 'inactive' },
    { bannerName: 'Dianne Russell', description: 'Donec sed erat ut magna suscipiAliquam porta nisl dolor, molestiColumnse..t..', status: 'active' },
    { bannerName: 'Darlene Robertson', description: 'Vestibulum eu quam nec neque pAliquam porta nisl dolor, molestiColumnse....', status: 'active' },
    { bannerName: 'Albert Flores', description: 'Vestibulum eu quam nec neque p.Aliquam porta nisl dolor, molestiColumnse...', status: 'inactive' },
    { bannerName: 'Leslie Alexander', description: 'Vestibulum eu quam nec neque pAliquam porta nisl dolor, molestiColumnse....', status: 'active' },
    { bannerName: 'Home Page banner', description: 'Aliquam porta nisl dolor, molestiColumnseAliquam porta nisl dolor, molestiColumnse..e..', status: 'active' },
    { bannerName: 'Jerome Bell', description: 'Donec sed erat ut magna suscipitAliquam porta nisl dolor, molestiColumnse....', status: 'inactive' },
    { bannerName: 'Dianne Russell', description: 'Donec sed erat ut magna suscipiAliquam porta nisl dolor, molestiColumnse..t..', status: 'active' },
    { bannerName: 'Darlene Robertson', description: 'Vestibulum eu quam nec neque pAliquam porta nisl dolor, molestiColumnse....', status: 'active' },
    { bannerName: 'Albert Flores', description: 'Vestibulum eu quam nec neque p.Aliquam porta nisl dolor, molestiColumnse...', status: 'inactive' },
    { bannerName: 'Leslie Alexander', description: 'Vestibulum eu quam nec neque pAliquam porta nisl dolor, molestiColumnse....', status: 'active' },
    { bannerName: 'Home Page banner', description: 'Aliquam porta nisl dolor, molestiColumnseAliquam porta nisl dolor, molestiColumnse..e..', status: 'active' },
    { bannerName: 'Jerome Bell', description: 'Donec sed erat ut magna suscipitAliquam porta nisl dolor, molestiColumnse....', status: 'inactive' },
    { bannerName: 'Dianne Russell', description: 'Donec sed erat ut magna suscipiAliquam porta nisl dolor, molestiColumnse..t..', status: 'active' },
    { bannerName: 'Darlene Robertson', description: 'Vestibulum eu quam nec neque pAliquam porta nisl dolor, molestiColumnse....', status: 'active' },
    { bannerName: 'Albert Flores', description: 'Vestibulum eu quam nec neque p.Aliquam porta nisl dolor, molestiColumnse...', status: 'inactive' },
    { bannerName: 'Leslie Alexander', description: 'Vestibulum eu quam nec neque pAliquam porta nisl dolor, molestiColumnse....', status: 'active' },
    { bannerName: 'Home Page banner', description: 'Aliquam porta nisl dolor, molestiColumnseAliquam porta nisl dolor, molestiColumnse..e..', status: 'active' },
    { bannerName: 'Jerome Bell', description: 'Donec sed erat ut magna suscipitAliquam porta nisl dolor, molestiColumnse....', status: 'inactive' },
  ];

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
  couponsRowData: Coupon[] = [
    { couponCode: 'LOREM12', deduction: '12%', startDate: 'December 19, 2013', endDate: 'May 12, 2019', status: 'active' },
    { couponCode: 'JONAS12', deduction: '12%', startDate: 'December 19, 2013', endDate: 'December 19, 2013', status: 'inactive' },
    { couponCode: 'DIWALI10', deduction: '10%', startDate: 'February 29, 2012', endDate: 'February 29, 2012', status: 'active' },
    { couponCode: 'HOLI20', deduction: '20%', startDate: 'October 30, 2017', endDate: 'October 30, 2017', status: 'active' },
    { couponCode: 'EID05', deduction: '5%', startDate: 'February 28, 2018', endDate: 'February 28, 2018', status: 'inactive' },
    { couponCode: 'HANUKKAH02', deduction: '02%', startDate: 'May 31, 2015', endDate: 'May 31, 2015', status: 'active' },
    { couponCode: 'RAMNAVMI20', deduction: '20%', startDate: 'May 9, 2014', endDate: 'May 9, 2014', status: 'active' },
    { couponCode: 'XMAS05', deduction: '5%', startDate: 'March 6, 2018', endDate: 'March 6, 2018', status: 'active' },
    { couponCode: 'SHADI18', deduction: '18%', startDate: 'March 23, 2013', endDate: 'March 23, 2013', status: 'inactive' },
    { couponCode: 'SHADI12', deduction: '12%', startDate: 'September 9, 2013', endDate: 'September 9, 2013', status: 'active' },
    { couponCode: 'LOREM12', deduction: '12%', startDate: 'December 19, 2013', endDate: 'May 12, 2019', status: 'active' },
    { couponCode: 'JONAS12', deduction: '12%', startDate: 'December 19, 2013', endDate: 'December 19, 2013', status: 'inactive' },
    { couponCode: 'DIWALI10', deduction: '10%', startDate: 'February 29, 2012', endDate: 'February 29, 2012', status: 'active' },
    { couponCode: 'HOLI20', deduction: '20%', startDate: 'October 30, 2017', endDate: 'October 30, 2017', status: 'active' },
    { couponCode: 'EID05', deduction: '5%', startDate: 'February 28, 2018', endDate: 'February 28, 2018', status: 'inactive' },
    { couponCode: 'HANUKKAH02', deduction: '02%', startDate: 'May 31, 2015', endDate: 'May 31, 2015', status: 'active' },
    { couponCode: 'RAMNAVMI20', deduction: '20%', startDate: 'May 9, 2014', endDate: 'May 9, 2014', status: 'active' },
    { couponCode: 'XMAS05', deduction: '5%', startDate: 'March 6, 2018', endDate: 'March 6, 2018', status: 'active' },
    { couponCode: 'SHADI18', deduction: '18%', startDate: 'March 23, 2013', endDate: 'March 23, 2013', status: 'inactive' },
    { couponCode: 'SHADI12', deduction: '12%', startDate: 'September 9, 2013', endDate: 'September 9, 2013', status: 'active' },
  ];

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
    private adminService: AdminService
  ) { }

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
            name: trip.destination_name || '',
            startDate: this.formatDate(trip.from_month),
            endDate: this.formatDate(trip.to_month),
            status: trip.isActive ? 'active' : 'inactive'
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
    console.log('Tab changed to:', index);
    
    // Fetch batches data when switching to batches tab (index 1)
    if (index === 1) {
      this.loadBatchesData();
    }
    // Fetch users data when switching to users tab (index 2)
    else if (index === 2) {
      this.loadUsersData();
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
              const fromDate = new Date(batch.from_date);
              fromDate.setHours(0, 0, 0, 0);
              const toDate = new Date(batch.to_date);
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
              status: batch.isActive ? 'active' : 'inactive'
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

  private loadUsersData() {
    this.adminService.getUsers().subscribe({
      next: (response) => {
        if (response && response.users && Array.isArray(response.users)) {
          this.usersRowData = response.users.map((user: any) => {
            // Format associated trips
            let associatedTrips = '—';
            if (user.trips && Array.isArray(user.trips) && user.trips.length > 0) {
              // Remove duplicates and get unique trip names
              const uniqueTrips = [...new Set(user.trips)] as string[];
              if (uniqueTrips.length === 1) {
                associatedTrips = uniqueTrips[0];
              } else if (uniqueTrips.length > 1) {
                associatedTrips = `${uniqueTrips[0]} +${String(uniqueTrips.length - 1).padStart(2, '0')}`;
              }
            }
            
            return {
              name: user.name || '',
              email: user.email || '',
              associatedTrips: associatedTrips,
              phoneNumber: user.phone_number ? String(user.phone_number) : '',
              role: user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase() : 'User'
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

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();
    this.adjustRowHeight();
  }

  onCellClicked(event: any) {
    if (event.event.target.closest('.action-btn')) {
      const action = event.event.target.closest('.action-btn').dataset.action;
      if (action === 'edit') {
        console.log('Edit clicked for:', event.data);
        // Handle edit action
      } else if (action === 'delete') {
        console.log('Delete clicked for:', event.data);
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
    console.log('Selected rows count:', this.selectedRowCount);
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

  // Make Math available in template
  Math = Math;

  onBatchesCellClicked(event: any) {
    if (event.event.target.closest('.action-btn')) {
      const action = event.event.target.closest('.action-btn').dataset.action;
      if (action === 'edit') {
        console.log('Edit batch clicked for:', event.data);
        // Handle edit action
      } else if (action === 'delete') {
        console.log('Delete batch clicked for:', event.data);
        // Handle delete action
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
    console.log('Selected batches count:', this.batchesSelectedRowCount);
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
        // Handle delete action
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
    console.log('Selected users count:', this.usersSelectedRowCount);
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
        console.log('Upload clicked for banner:', event.data);
        // Handle upload action
      }
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
        console.log('Edit clicked for coupon:', event.data);
        // Handle edit action
      } else if (action === 'delete') {
        console.log('Delete clicked for coupon:', event.data);
        // Handle delete action
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
        console.log('Edit clicked for lead:', event.data);
        // Handle edit action
      } else if (action === 'delete') {
        console.log('Delete clicked for lead:', event.data);
        // Handle delete action
      }
    }
  }

  onLeadsSelectionChanged(event: any) {
    const selectedRows = event.api.getSelectedRows();
    this.leadsSelectedRowCount = selectedRows.length;
    console.log('Selected leads count:', this.leadsSelectedRowCount);
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
}
