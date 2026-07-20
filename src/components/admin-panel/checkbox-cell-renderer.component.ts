import { Component, ChangeDetectorRef } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-checkbox-cell-renderer',
  template: `
    <mat-checkbox
      [checked]="isChecked"
      (change)="onCheckboxChange($event)"
      [color]="'primary'"
      class="ag-grid-checkbox">
    </mat-checkbox>
  `,
  styles: [`
    :host {
      display: flex;
      align-items: center;
      height: 100%;
    }
    
    .ag-grid-checkbox {
      margin: 0;
      padding: 0;
    }

    ::ng-deep .ag-grid-checkbox .mat-checkbox-inner-container {
      width: 18px;
      height: 18px;
    }

    ::ng-deep .ag-grid-checkbox .mat-checkbox-frame {
      border-color: #d0d0d0;
      border-width: 2px;
    }

    ::ng-deep .ag-grid-checkbox.mat-checkbox-checked .mat-checkbox-background {
      background-color: #1976d2;
    }
  `]
})
export class CheckboxCellRendererComponent implements ICellRendererAngularComp {
  private params!: ICellRendererParams;
  public isChecked = false;

  constructor(private cdr: ChangeDetectorRef) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.isChecked = params.node.isSelected();

    // Listen to row selection changes
    params.node.addEventListener('rowSelected', () => {
      this.isChecked = params.node.isSelected();
      this.cdr.detectChanges();
    });
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    this.isChecked = params.node.isSelected();
    return true;
  }

  onCheckboxChange(event: any): void {
    const checked = event.checked;
    this.params.node.setSelected(checked);
  }
}
