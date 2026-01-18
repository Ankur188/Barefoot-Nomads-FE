import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-role-dropdown-renderer',
  template: `
    <div class="role-dropdown-container">
      <span class="role-text">{{ value }}</span>
      <mat-icon 
        class="dropdown-icon" 
        [matMenuTriggerFor]="menu"
        (click)="$event.stopPropagation()">
        expand_more
      </mat-icon>
      <mat-menu #menu="matMenu" class="role-menu">
        <button mat-menu-item (click)="onSelectOption('Admin')">
          Admin
        </button>
        <button mat-menu-item (click)="onSelectOption('User')">
          User
        </button>
      </mat-menu>
    </div>
  `,
  styles: [`
    .role-dropdown-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 100%;
      padding: 0;
    }

    .role-text {
      color: #222222;
      font-size: 13px;
    }

    .dropdown-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #222222;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .dropdown-icon:hover {
      color: #1154A2;
    }

    :host ::ng-deep .role-menu .mat-menu-content {
      padding: 0;
    }

    :host ::ng-deep .role-menu .mat-menu-item {
      color: #222222;
      font-size: 13px;
      height: 36px;
      line-height: 36px;
    }

    :host ::ng-deep .role-menu .mat-menu-item:hover {
      background-color: #f5f5f5;
    }
  `]
})
export class RoleDropdownRendererComponent implements ICellRendererAngularComp {
  public params!: ICellRendererParams;
  public value: string = '';

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.value = params.value;
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    this.value = params.value;
    return true;
  }

  onSelectOption(option: string): void {
    this.value = option;
    // Update the data in the grid
    if (this.params.node && this.params.colDef.field) {
      this.params.node.setDataValue(this.params.colDef.field, option);
    }
    console.log('Role changed to:', option, 'for user:', this.params.data);
  }
}
