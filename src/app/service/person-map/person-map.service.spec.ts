import { TestBed } from '@angular/core/testing';

import { PersonMapService } from './person-map.service';

describe('PersonMapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PersonMapService = TestBed.get(PersonMapService);
    expect(service).toBeTruthy();
  });
});
