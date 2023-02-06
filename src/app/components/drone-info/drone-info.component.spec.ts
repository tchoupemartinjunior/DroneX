import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DroneInfoComponent } from './drone-info.component';

describe('DroneInfoComponent', () => {
  let component: DroneInfoComponent;
  let fixture: ComponentFixture<DroneInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DroneInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DroneInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
