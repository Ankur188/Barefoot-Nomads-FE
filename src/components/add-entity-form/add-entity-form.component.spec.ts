import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEntityFormComponent } from './add-entity-form.component';

describe('AddEntityFormComponent', () => {
  let component: AddEntityFormComponent;
  let fixture: ComponentFixture<AddEntityFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEntityFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEntityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
