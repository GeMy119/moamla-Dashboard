import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyVisaFormComponent } from './family-visa-form.component';

describe('FamilyVisaFormComponent', () => {
  let component: FamilyVisaFormComponent;
  let fixture: ComponentFixture<FamilyVisaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyVisaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamilyVisaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
