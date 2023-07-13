import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusRemarksComponent } from './bonus-remarks.component';

describe('BonusRemarksComponent', () => {
  let component: BonusRemarksComponent;
  let fixture: ComponentFixture<BonusRemarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BonusRemarksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BonusRemarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
