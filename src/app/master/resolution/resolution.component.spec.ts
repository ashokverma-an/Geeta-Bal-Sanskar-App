import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolutionComponent } from './resolution.component';

describe('ResolutionComponent', () => {
  let component: ResolutionComponent;
  let fixture: ComponentFixture<ResolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResolutionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
