import { Component } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { IHeaderParams } from 'ag-grid-community';

@Component({
  selector: 'app-custom-header-renderer',
  template: `
    <div class="custom-header-container" (click)="onSortRequested($event)">
      <span class="header-text">{{ params.displayName }}</span>
      <mat-icon class="menu-icon" (click)="onMenuClick($event)">menu</mat-icon>
      <mat-icon *ngIf="params.enableSorting && sortDirection" class="sort-icon">
        {{ sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward' }}
      </mat-icon>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .custom-header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 100%;
      padding: 0 8px;
      cursor: pointer;
      gap: 4px;
    }

    .header-text {
      flex: 1;
      color: #222222;
      font-weight: 700;
      font-size: 13px;
    }

    .menu-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      line-height: 16px;
      color: #666;
      cursor: pointer;
      margin-left: 4px;
      
      &:hover {
        color: #1976d2;
      }
    }

    .sort-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      line-height: 16px;
      color: #1976d2;
      margin-left: 2px;
    }
  `]
})
export class CustomHeaderRendererComponent implements IHeaderAngularComp {
  params!: IHeaderParams;
  sortDirection: string | null = null;

  agInit(params: IHeaderParams): void {
    this.params = params;
    this.updateSortDirection();
  }

  refresh(params: IHeaderParams): boolean {
    this.params = params;
    this.updateSortDirection();
    return true;
  }

  onSortRequested(event: MouseEvent): void {
    // Only sort if we're not clicking on the menu icon
    if (!(event.target as HTMLElement).closest('.menu-icon')) {
      if (this.params.enableSorting) {
        this.params.progressSort(event.shiftKey);
        this.updateSortDirection();
      }
    }
  }

  onMenuClick(event: MouseEvent): void {
    event.stopPropagation();
    if (this.params.showColumnMenu) {
      this.params.showColumnMenu(event.currentTarget as HTMLElement);
    }
  }

  updateSortDirection(): void {
    const column = this.params.column;
    if (column.isSortAscending()) {
      this.sortDirection = 'asc';
    } else if (column.isSortDescending()) {
      this.sortDirection = 'desc';
    } else {
      this.sortDirection = null;
    }
  }
}
