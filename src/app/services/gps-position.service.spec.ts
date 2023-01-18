import { TestBed } from '@angular/core/testing';

import { GpsPositionService } from './gps-position.service';

describe('GpsPositionService', () => {
  let service: GpsPositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GpsPositionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
