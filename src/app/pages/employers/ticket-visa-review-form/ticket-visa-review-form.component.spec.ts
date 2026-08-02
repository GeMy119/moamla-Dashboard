import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketVisaReviewFormComponent } from './ticket-visa-review-form.component';

describe('TicketVisaReviewFormComponent', () => {
  let component: TicketVisaReviewFormComponent;
  let fixture: ComponentFixture<TicketVisaReviewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketVisaReviewFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketVisaReviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
