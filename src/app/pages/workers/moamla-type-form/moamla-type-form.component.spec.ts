import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoamlaTypeFormComponent } from './moamla-type-form.component';

describe('MoamlaTypeFormComponent', () => {
  let component: MoamlaTypeFormComponent;
  let fixture: ComponentFixture<MoamlaTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoamlaTypeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoamlaTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
