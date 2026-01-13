import { Component, OnInit } from '@angular/core';
import { ColDef, GridReadyEvent, GridApi, IDateFilterParams } from 'ag-grid-community';

interface Trip {
  name: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  selectedTab = 0;
  private gridApi!: GridApi;

  // Column Definitions
  columnDefs: ColDef[] = [
    {
      headerName: '',
      field: 'checkbox',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50,
      sortable: false,
      filter: false,
      resizable: false,
      suppressMenu: true,
      pinned: 'left' 
    },
    {
      headerName: 'Name',
      field: 'name',
      flex: 2,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      sortable: true,
      resizable: true,
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
        suppressAndOrCondition: false,
        maxNumConditions: 2
      }
    },
    {
      headerName: 'Start Date',
      field: 'startDate',
      flex: 1,
      filter: 'agDateColumnFilter',
      floatingFilter: true,
      sortable: true,
      resizable: true,
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
      flex: 1,
      filter: 'agDateColumnFilter',
      floatingFilter: true,
      sortable: true,
      resizable: true,
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
      flex: 1,
      filter: 'agSetColumnFilter',
      floatingFilter: true,
      sortable: true,
      resizable: true,
      cellRenderer: (params: any) => {
        const status = params.value;
        const isActive = status === 'active';
        return `<div style="display: flex; align-items: center;">
          <span style="width: 10px; height: 10px; border-radius: 50%; background-color: ${isActive ? '#1976d2' : '#999'}; display: inline-block; margin-right: 8px;"></span>
        </div>`;
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        values: ['active', 'inactive']
      }
    },
    {
      headerName: 'Actions',
      field: 'actions',
      flex: 0.8,
      sortable: false,
      filter: false,
      resizable: false,
      cellRenderer: (params: any) => {
        return `<div style="display: flex; gap: 8px; align-items: center;">
          <button class="action-btn edit-btn" data-action="edit" style="border: none; background: none; cursor: pointer; padding: 4px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1976d2" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="action-btn delete-btn" data-action="delete" style="border: none; background: none; cursor: pointer; padding: 4px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
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
    { name: 'Knockturn Alley', startDate: 'October 31, 2017', endDate: 'October 31, 2017', status: 'active' }
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
    rowSelection: 'multiple',
    animateRows: true,
    enableCellTextSelection: true,
    ensureDomOrder: true
  };

  constructor() { }

  ngOnInit(): void {
  }

  onTabChange(index: number) {
    this.selectedTab = index;
    console.log('Tab changed to:', index);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();
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
  }
}
