import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DressCheckerComponent } from './dress-checker.component';

describe('DressCheckerComponent', () => {
  let component: DressCheckerComponent;
  let fixture: ComponentFixture<DressCheckerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DressCheckerComponent]
    });
    fixture = TestBed.createComponent(DressCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
