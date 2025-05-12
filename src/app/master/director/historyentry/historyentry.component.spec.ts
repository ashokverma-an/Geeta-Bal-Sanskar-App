import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryentryComponent } from './historyentry.component';

describe('HistoryentryComponent', () => {
  let component: HistoryentryComponent;
  let fixture: ComponentFixture<HistoryentryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryentryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
