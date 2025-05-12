import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapitalEntryComponent } from './capital-entry.component';

describe('CapitalEntryComponent', () => {
  let component: CapitalEntryComponent;
  let fixture: ComponentFixture<CapitalEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapitalEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapitalEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
