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
    const rowData = this.params.data;
    
    // For rows without startDate/endDate (non-batch rows like coupons, banners)
    if (!rowData || (!rowData.startDate && !rowData.batches)) {
      return true;
    }

    // For batch rows (has startDate and endDate)
    if (rowData.startDate && rowData.endDate && !rowData.batches) {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      const startDate = this.parseDate(rowData.startDate);
      const endDate = this.parseDate(rowData.endDate);

      if (!startDate || !endDate) {
        return true;
      }

      // Hide toggle if current date >= start date (batch has started or ended)
      return currentDate < startDate;
    }

    // For trip rows (has batches array)
    if (rowData.batches && Array.isArray(rowData.batches)) {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      // Check if any batch is currently active (current date is between start and end date)
      const hasActiveBatch = rowData.batches.some((batch: any) => {
        const batchStart = this.parseDateFromTimestamp(batch.from_date);
        const batchEnd = this.parseDateFromTimestamp(batch.to_date);
        
        if (!batchStart || !batchEnd) return false;
        
        // Check if current date is between start and end (inclusive)
        return currentDate >= batchStart && currentDate <= batchEnd;
      });

      // If any batch is currently active, hide the toggle
      if (hasActiveBatch) {
        return false;
      }

      // Check if all future batches (start date > current date) have bookings
      const futureBatches = rowData.batches.filter((batch: any) => {
        const batchStart = this.parseDateFromTimestamp(batch.from_date);
        return batchStart && batchStart > currentDate;
      });

      // If there are future batches
      if (futureBatches.length > 0) {
        // Check if all future batches have bookings
        const allFutureBatchesHaveBookings = futureBatches.every((batch: any) => {
          return parseInt(batch.booking_count || '0') > 0;
        });

        // Hide toggle if all future batches have bookings
        if (allFutureBatchesHaveBookings) {
          return false;
        }
      }

      // Show toggle if:
      // - No active batches AND
      // - (No future batches OR at least one future batch has no bookings)
      return true;
    }

    // Default: show toggle
    return true;
  }

  private parseDateFromTimestamp(timestamp: string | number): Date | null {
    if (!timestamp) return null;
    
    const timestampNum = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
    if (isNaN(timestampNum)) return null;
    
    const date = new Date(timestampNum * 1000);
    date.setHours(0, 0, 0, 0);
    return date;
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
