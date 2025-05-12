import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenratedocumentComponent } from './genratedocument.component';

describe('GenratedocumentComponent', () => {
  let component: GenratedocumentComponent;
  let fixture: ComponentFixture<GenratedocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenratedocumentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenratedocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
