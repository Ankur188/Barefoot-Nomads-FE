import { Component, OnInit, OnDestroy } from '@angular/core';
import { ColDef, GridReadyEvent, GridApi, IDateFilterParams } from 'ag-grid-community';
import { CheckboxCellRendererComponent } from './checkbox-cell-renderer.component';
import { HeaderCheckboxRendererComponent } from './header-checkbox-renderer.component';
import { StatusToggleRendererComponent } from './status-toggle-renderer.component';
import { CustomHeaderRendererComponent } from './custom-header-renderer.component';

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
export class AdminPanelComponent implements OnInit, OnDestroy {
  selectedTab = 0;
  private gridApi!: GridApi;
  selectedRowCount = 0;

  // Column Definitions
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
        suppressAndOrCondition: false,
        maxNumConditions: 2
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
}
