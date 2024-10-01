import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostumesComponent } from './costumes.component';

describe('CostumesComponent', () => {
  let component: CostumesComponent;
  let fixture: ComponentFixture<CostumesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CostumesComponent]
    });
    fixture = TestBed.createComponent(CostumesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
