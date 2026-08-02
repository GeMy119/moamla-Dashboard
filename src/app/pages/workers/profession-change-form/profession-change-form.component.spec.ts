import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionChangeFormComponent } from './profession-change-form.component';

describe('ProfessionChangeFormComponent', () => {
  let component: ProfessionChangeFormComponent;
  let fixture: ComponentFixture<ProfessionChangeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessionChangeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessionChangeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
