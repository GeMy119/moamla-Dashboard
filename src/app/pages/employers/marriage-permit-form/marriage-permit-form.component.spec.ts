import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarriagePermitFormComponent } from './marriage-permit-form.component';

describe('MarriagePermitFormComponent', () => {
  let component: MarriagePermitFormComponent;
  let fixture: ComponentFixture<MarriagePermitFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarriagePermitFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarriagePermitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
