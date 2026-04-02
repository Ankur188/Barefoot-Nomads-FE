import { Component, ChangeDetectorRef } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-status-toggle-renderer',
  template: `
    <div class="status-toggle-container">
      <mat-slide-toggle
        *ngIf="showToggle"
        [checked]="isActive"
        (change)="onToggleChange($event)"
        [color]="'primary'"
        class="status-toggle">
      </mat-slide-toggle>
    </div>
  `,
  styles: [`
    .status-toggle-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
    }
    
    .status-toggle {
      transform: scale(0.8);
    }

    ::ng-deep .status-toggle .mat-slide-toggle-bar {
      width: 32px;
      height: 16px;
      border-radius: 8px;
    }

    ::ng-deep .status-toggle .mat-slide-toggle-thumb {
      width: 12px;
      height: 12px;
    }

    ::ng-deep .status-toggle.mat-checked .mat-slide-toggle-bar {
      background-color: rgba(25, 118, 210, 0.5);
    }

    ::ng-deep .status-toggle.mat-checked .mat-slide-toggle-thumb {
      background-color: #1976d2;
    }

    ::ng-deep .status-toggle:not(.mat-checked) .mat-slide-toggle-bar {
      background-color: rgba(0, 0, 0, 0.26);
    }

    ::ng-deep .status-toggle:not(.mat-checked) .mat-slide-toggle-thumb {
      background-color: #fafafa;
    }
  `]
})
export class StatusToggleRendererComponent implements ICellRendererAngularComp {
  private params!: ICellRendererParams;
  public isActive = false;
  public showToggle = true;

  constructor(private cdr: ChangeDetectorRef) {}

  agInit(params: ICellRendererParams): void {
    console.log('StatusToggleRendererComponent agInit params:', params)
    this.params = params;
    this.isActive = params.value === true || params.value === 'active';
    this.showToggle = this.shouldShowToggle();
  }

  refresh(params: ICellRendererParams): boolean {
    console.log('StatusToggleRendererComponent refresh params:', params)
    this.params = params;
    this.isActive = params.value === true || params.value === 'active';
    this.showToggle = this.shouldShowToggle();
    return true;
  }

  private shouldShowToggle(): boolean {
    // Check if this is a batches row (has startDate and endDate)
    const rowData = this.params.data;
    if (!rowData || !rowData.startDate || !rowData.endDate) {
      // For non-batch rows (trips, coupons, etc.), always show toggle
      return true;
    }

    // Parse dates for batches
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset to midnight for date comparison
    
    const startDate = this.parseDate(rowData.startDate);
    const endDate = this.parseDate(rowData.endDate);

    if (!startDate || !endDate) {
      // If dates can't be parsed, show toggle by default
      return true;
    }

    // Hide toggle if current date >= start date (trip has started or ended)
    return currentDate < startDate;
  }

  private parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;

    // Handle different date formats
    // Format 1: "January 1, 2026" or "Month DD, YYYY"
    const monthMap: { [key: string]: number } = {
      'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
      'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
    };

    const dateParts = dateStr.trim().split(' ');
    if (dateParts.length === 3) {
      const month = monthMap[dateParts[0]];
      const day = Number(dateParts[1].replace(',', ''));
      const year = Number(dateParts[2]);
      
      if (month !== undefined && !isNaN(day) && !isNaN(year)) {
        const date = new Date(year, month, day);
        date.setHours(0, 0, 0, 0);
        return date;
      }
    }

    // Format 2: ISO format or other standard formats
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      date.setHours(0, 0, 0, 0);
      return date;
    }

    return null;
  }

  onToggleChange(event: any): void {
    const newStatus = event.checked;
    const newStatusValue = newStatus ? 'active' : 'inactive';
    
    // Update the data in AG Grid
    this.params.node.setDataValue(this.params.column?.getColId() || 'status', newStatusValue);
    
    console.log('Status changed:', {
      rowData: this.params.data,
      newStatus: newStatusValue
    });
    
    // Call the update function from context if provided
    if (this.params.context && this.params.context.updateStatus) {
      this.params.context.updateStatus(this.params.data, newStatusValue);
    }
  }
}
