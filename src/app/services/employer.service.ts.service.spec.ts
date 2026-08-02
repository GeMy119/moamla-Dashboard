import { TestBed } from '@angular/core/testing';

import { EmployerServiceTsService } from './employer.service.ts.service';

describe('EmployerServiceTsService', () => {
  let service: EmployerServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployerServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
