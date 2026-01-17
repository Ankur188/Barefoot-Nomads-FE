import { Component } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { IHeaderParams } from 'ag-grid-community';

@Component({
  selector: 'app-header-checkbox-renderer',
  template: `
    <mat-checkbox
      [checked]="isChecked"
      [indeterminate]="isIndeterminate"
      (change)="onCheckboxChange($event)"
      [color]="'primary'"
      class="ag-grid-header-checkbox">
    </mat-checkbox>
  `,
  styles: [`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
    }
    
    .ag-grid-header-checkbox {
      margin: 0;
      padding: 0;
    }

    ::ng-deep .ag-grid-header-checkbox .mat-checkbox-inner-container {
      width: 18px;
      height: 18px;
    }

    ::ng-deep .ag-grid-header-checkbox .mat-checkbox-frame {
      border-color: #d0d0d0;
      border-width: 2px;
    }

    ::ng-deep .ag-grid-header-checkbox.mat-checkbox-checked .mat-checkbox-background,
    ::ng-deep .ag-grid-header-checkbox.mat-checkbox-indeterminate .mat-checkbox-background {
      background-color: #1976d2;
    }
  `]
})
export class HeaderCheckboxRendererComponent implements IHeaderAngularComp {
  private params!: IHeaderParams;
  public isChecked = false;
  public isIndeterminate = false;

  agInit(params: IHeaderParams): void {
    this.params = params;
    this.updateCheckboxState();

    // Listen to selection changes
    this.params.api.addEventListener('selectionChanged', () => {
      this.updateCheckboxState();
    });

    this.params.api.addEventListener('rowDataUpdated', () => {
      this.updateCheckboxState();
    });
  }

  refresh(params: IHeaderParams): boolean {
    this.params = params;
    this.updateCheckboxState();
    return true;
  }

  private updateCheckboxState(): void {
    const allRowsCount = this.params.api.getDisplayedRowCount();
    const selectedRowsCount = this.params.api.getSelectedRows().length;

    if (selectedRowsCount === 0) {
      this.isChecked = false;
      this.isIndeterminate = false;
    } else if (selectedRowsCount === allRowsCount) {
      this.isChecked = true;
      this.isIndeterminate = false;
    } else {
      this.isChecked = false;
      this.isIndeterminate = true;
    }
  }

  onCheckboxChange(event: any): void {
    const checked = event.checked;
    if (checked) {
      this.params.api.selectAll();
    } else {
      this.params.api.deselectAll();
    }
  }
}
