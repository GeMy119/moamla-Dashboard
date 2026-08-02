import { TestBed } from '@angular/core/testing';

import { FamilyVisaService } from './family-visa.service';

describe('FamilyVisaService', () => {
  let service: FamilyVisaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamilyVisaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
