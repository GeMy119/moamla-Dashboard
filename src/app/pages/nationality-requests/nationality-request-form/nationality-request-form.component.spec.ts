import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalityRequestFormComponent } from './nationality-request-form.component';

describe('NationalityRequestFormComponent', () => {
  let component: NationalityRequestFormComponent;
  let fixture: ComponentFixture<NationalityRequestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NationalityRequestFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NationalityRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
