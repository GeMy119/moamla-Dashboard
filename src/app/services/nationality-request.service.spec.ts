import { TestBed } from '@angular/core/testing';

import { NationalityRequestService } from './nationality-request.service';

describe('NationalityRequestService', () => {
  let service: NationalityRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NationalityRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
