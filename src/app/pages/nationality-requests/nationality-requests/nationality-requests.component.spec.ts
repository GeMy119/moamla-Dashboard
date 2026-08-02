import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalityRequestsComponent } from './nationality-requests.component';

describe('NationalityRequestsComponent', () => {
  let component: NationalityRequestsComponent;
  let fixture: ComponentFixture<NationalityRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NationalityRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NationalityRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
