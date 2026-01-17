import { Component, ChangeDetectorRef } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-status-toggle-renderer',
  template: `
    <div class="status-toggle-container">
      <mat-slide-toggle
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

  constructor(private cdr: ChangeDetectorRef) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.isActive = params.value === 'active';
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    this.isActive = params.value === 'active';
    return true;
  }

  onToggleChange(event: any): void {
    const newStatus = event.checked ? 'active' : 'inactive';
    
    // Update the data in AG Grid
    this.params.node.setDataValue(this.params.column?.getColId() || 'status', newStatus);
    
    // Optional: Call an API or service to persist the change
    console.log('Status changed:', {
      rowData: this.params.data,
      newStatus: newStatus
    });
    
    // You can emit an event or call a service here
    // For example: this.statusService.updateStatus(this.params.data.id, newStatus);
  }
}
