import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraggableBottomSheetComponent } from './draggable-bottom-sheet.component';

describe('DraggableBottomSheetComponent', () => {
  let component: DraggableBottomSheetComponent;
  let fixture: ComponentFixture<DraggableBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DraggableBottomSheetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DraggableBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
