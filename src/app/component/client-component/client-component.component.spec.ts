import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientComponentComponent } from './client-component.component';

describe('ClientComponentComponent', () => {
  let component: ClientComponentComponent;
  let fixture: ComponentFixture<ClientComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
