import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorHistoryDialogComponent } from './director-history-dialog.component';

describe('DirectorHistoryDialogComponent', () => {
  let component: DirectorHistoryDialogComponent;
  let fixture: ComponentFixture<DirectorHistoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectorHistoryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectorHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
