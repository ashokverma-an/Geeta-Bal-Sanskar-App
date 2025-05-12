import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorEntryComponent } from './director-entry.component';

describe('DirectorEntryComponent', () => {
  let component: DirectorEntryComponent;
  let fixture: ComponentFixture<DirectorEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectorEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectorEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
