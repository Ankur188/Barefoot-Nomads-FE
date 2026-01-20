import { Component, OnInit, OnDestroy } from '@angular/core';
import { ColDef, GridReadyEvent, GridApi, IDateFilterParams } from 'ag-grid-community';
import { CheckboxCellRendererComponent } from './checkbox-cell-renderer.component';
import { HeaderCheckboxRendererComponent } from './header-checkbox-renderer.component';
import { StatusToggleRendererComponent } from './status-toggle-renderer.component';
import { CustomHeaderRendererComponent } from './custom-header-renderer.component';
import { AvailabilityDropdownRendererComponent } from './availability-dropdown-renderer.component';
import { RoleDropdownRendererComponent } from './role-dropdown-renderer.component';

interface Trip {
  name: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive';
}

interface Batch {
  batchName: string;
  assignedTrip: string;
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
  batchesSelectedRowCount = 0;
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
  rowData: Trip[] = [
    { name: 'Little Hangleton', startDate: 'May 12, 2019', endDate: 'May 12, 2019', status: 'active' },
    { name: 'Gambol and Japes Wizarding Joke Shop', startDate: 'December 19, 2013', endDate: 'December 19, 2013', status: 'inactive' },
    { name: 'Florean Fortescue\'s Ice Cream Parlor', startDate: 'February 29, 2012', endDate: 'February 29, 2012', status: 'active' },
    { name: 'House of Gaunt', startDate: 'October 30, 2017', endDate: 'October 30, 2017', status: 'active' },
    { name: 'House of Gaunt -2', startDate: 'February 28, 2018', endDate: 'February 28, 2018', status: 'inactive' },
    { name: 'Hagrid\'s Hut', startDate: 'May 31, 2015', endDate: 'May 31, 2015', status: 'active' },
    { name: 'Godric\'s Hollow', startDate: 'May 9, 2014', endDate: 'May 9, 2014', status: 'active' },
    { name: 'Forest of Dean', startDate: 'March 6, 2018', endDate: 'March 6, 2018', status: 'active' },
    { name: 'Madam Malkin\'s Robes for All Occasions', startDate: 'March 23, 2013', endDate: 'March 23, 2013', status: 'inactive' },
    { name: 'Olivanders: Makers of Fine Wands since 382 BC', startDate: 'September 9, 2013', endDate: 'September 9, 2013', status: 'active' },
    { name: 'Diagon Alley', startDate: 'June 15, 2016', endDate: 'June 15, 2016', status: 'active' },
    { name: 'Hogsmeade Village', startDate: 'August 22, 2014', endDate: 'August 22, 2014', status: 'active' },
    { name: 'The Leaky Cauldron', startDate: 'January 10, 2015', endDate: 'January 10, 2015', status: 'inactive' },
    { name: 'Gringotts Wizarding Bank', startDate: 'July 4, 2017', endDate: 'July 4, 2017', status: 'active' },
    { name: 'Shrieking Shack', startDate: 'November 18, 2016', endDate: 'November 18, 2016', status: 'active' },
    { name: 'Three Broomsticks', startDate: 'September 30, 2018', endDate: 'September 30, 2018', status: 'inactive' },
    { name: 'Honeydukes', startDate: 'April 12, 2019', endDate: 'April 12, 2019', status: 'active' },
    { name: 'Zonko\'s Joke Shop', startDate: 'December 5, 2013', endDate: 'December 5, 2013', status: 'active' },
    { name: 'The Hog\'s Head', startDate: 'February 14, 2015', endDate: 'February 14, 2015', status: 'inactive' },
    { name: 'Knockturn Alley', startDate: 'October 31, 2017', endDate: 'October 31, 2017', status: 'active' },
  ];

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
  batchesRowData: Batch[] = [
    { batchName: 'BATCH2334', assignedTrip: 'Little Hangleton', standardPrice: 7791, singleRoom: 5626, doubleRoom: 4349, tripleRoom: 4600, tax: '8%', travelers: 'Ankur Sood +12', tripProgress: 'Completed', count: 20, availability: 'Filling Fast', status: 'active' },
    { batchName: 'BATCH2335', assignedTrip: 'Florean Forkes', standardPrice: 8801, singleRoom: 0, doubleRoom: 9059, tripleRoom: 4179, tax: '8%', travelers: 'Ankur Tyagi +50', tripProgress: 'Upcoming', count: 20, availability: 'Sold Out', status: 'active' },
    { batchName: 'BATCH2577', assignedTrip: 'Godrick Hollow', standardPrice: 5550, singleRoom: 1784, doubleRoom: 9462, tripleRoom: 5045, tax: '8%', travelers: 'Ankush Tiwari +19', tripProgress: 'Completed', count: 20, availability: 'Sold Out', status: 'active' },
    { batchName: 'BATCH2345', assignedTrip: 'Olivanders', standardPrice: 8829, singleRoom: 0, doubleRoom: 8829, tripleRoom: 9261, tax: '8%', travelers: 'Dean Morris +12', tripProgress: 'Upcoming', count: 20, availability: 'Filling Fast', status: 'active' },
    { batchName: 'BATCH4125', assignedTrip: 'House of Gaunt', standardPrice: 9402, singleRoom: 4122, doubleRoom: 5774, tripleRoom: 1784, tax: '8%', travelers: 'Lil Wayne +98', tripProgress: 'Completed', count: 20, availability: 'Sold Out', status: 'active' },
    { batchName: 'BATCH2345', assignedTrip: 'House of Gaunt', standardPrice: 1784, singleRoom: 7791, doubleRoom: 6055, tripleRoom: 5560, tax: '8%', travelers: 'Tanya Mittal +2', tripProgress: 'Upcoming', count: 16, availability: 'Filling Fast', status: 'active' },
    { batchName: 'BATCH5642', assignedTrip: 'Florean Forkes', standardPrice: 8811, singleRoom: 1577, doubleRoom: 0, tripleRoom: 1148, tax: '8%', travelers: 'Gaurav Singh +50', tripProgress: 'Completed', count: 10, availability: 'Sold Out', status: 'active' },
    { batchName: 'BATCH8864', assignedTrip: 'Olivanders', standardPrice: 1577, singleRoom: 0, doubleRoom: 4846, tripleRoom: 5946, tax: '8%', travelers: 'Monica Sadler +1', tripProgress: 'Upcoming', count: 20, availability: 'Filling Fast', status: 'active' },
    { batchName: 'BATCH6784', assignedTrip: 'Florean Forkes', standardPrice: 3948, singleRoom: 3536, doubleRoom: 0, tripleRoom: 6025, tax: '8%', travelers: 'Chandler Bing +12', tripProgress: 'Completed', count: 13, availability: 'Sold Out', status: 'active' },
    { batchName: 'BATCH4952', assignedTrip: 'Olivanders', standardPrice: 1148, singleRoom: 0, doubleRoom: 6690, tripleRoom: 9359, tax: '8%', travelers: 'Jim Halpert +16', tripProgress: 'Completed', count: 10, availability: 'Filling Fast', status: 'active' },
    { batchName: 'BATCH2334', assignedTrip: 'Little Hangleton', standardPrice: 7791, singleRoom: 5626, doubleRoom: 4349, tripleRoom: 4600, tax: '8%', travelers: 'Ankur Sood +12', tripProgress: 'Completed', count: 20, availability: 'Filling Fast', status: 'active' },
    { batchName: 'BATCH2335', assignedTrip: 'Florean Forkes', standardPrice: 8801, singleRoom: 0, doubleRoom: 9059, tripleRoom: 4179, tax: '8%', travelers: 'Ankur Tyagi +50', tripProgress: 'Upcoming', count: 20, availability: 'Sold Out', status: 'active' },
    { batchName: 'BATCH2577', assignedTrip: 'Godrick Hollow', standardPrice: 5550, singleRoom: 1784, doubleRoom: 9462, tripleRoom: 5045, tax: '8%', travelers: 'Ankush Tiwari +19', tripProgress: 'Completed', count: 20, availability: 'Sold Out', status: 'active' },
    { batchName: 'BATCH2345', assignedTrip: 'Olivanders', standardPrice: 8829, singleRoom: 0, doubleRoom: 8829, tripleRoom: 9261, tax: '8%', travelers: 'Dean Morris +12', tripProgress: 'Upcoming', count: 20, availability: 'Filling Fast', status: 'active' },
    { batchName: 'BATCH4125', assignedTrip: 'House of Gaunt', standardPrice: 9402, singleRoom: 4122, doubleRoom: 5774, tripleRoom: 1784, tax: '8%', travelers: 'Lil Wayne +98', tripProgress: 'Completed', count: 20, availability: 'Sold Out', status: 'active' },
    { batchName: 'BATCH2345', assignedTrip: 'House of Gaunt', standardPrice: 1784, singleRoom: 7791, doubleRoom: 6055, tripleRoom: 5560, tax: '8%', travelers: 'Tanya Mittal +2', tripProgress: 'Upcoming', count: 16, availability: 'Filling Fast', status: 'active' },
    { batchName: 'BATCH5642', assignedTrip: 'Florean Forkes', standardPrice: 8811, singleRoom: 1577, doubleRoom: 0, tripleRoom: 1148, tax: '8%', travelers: 'Gaurav Singh +50', tripProgress: 'Completed', count: 10, availability: 'Sold Out', status: 'active' },
    { batchName: 'BATCH8864', assignedTrip: 'Olivanders', standardPrice: 1577, singleRoom: 0, doubleRoom: 4846, tripleRoom: 5946, tax: '8%', travelers: 'Monica Sadler +1', tripProgress: 'Upcoming', count: 20, availability: 'Filling Fast', status: 'active' },
    { batchName: 'BATCH6784', assignedTrip: 'Florean Forkes', standardPrice: 3948, singleRoom: 3536, doubleRoom: 0, tripleRoom: 6025, tax: '8%', travelers: 'Chandler Bing +12', tripProgress: 'Completed', count: 13, availability: 'Sold Out', status: 'active' },
    { batchName: 'BATCH4952', assignedTrip: 'Olivanders', standardPrice: 1148, singleRoom: 0, doubleRoom: 6690, tripleRoom: 9359, tax: '8%', travelers: 'Jim Halpert +16', tripProgress: 'Completed', count: 10, availability: 'Filling Fast', status: 'active' },
  ];

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

  constructor() { }

  ngOnInit(): void {
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    // Restore body scroll when leaving admin page
    document.body.style.overflow = 'auto';
  }

  onTabChange(index: number) {
    this.selectedTab = index;
    console.log('Tab changed to:', index);
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
    const rowHeight = Math.max(calculatedRowHeight, minRowHeight);

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
    const rowHeight = Math.max(calculatedRowHeight, minRowHeight);

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
    const rowHeight = Math.max(calculatedRowHeight, minRowHeight);

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
    const rowHeight = Math.max(calculatedRowHeight, minRowHeight);

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
    const rowHeight = Math.max(calculatedRowHeight, minRowHeight);

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
    const rowHeight = Math.max(calculatedRowHeight, minRowHeight);

    // Set the row height
    this.leadsGridApi.forEachNode((node) => {
      node.setRowHeight(rowHeight);
    });
    this.leadsGridApi.onRowHeightChanged();
  }
}
