import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopaitalCompanyComponent } from './copaital-company.component';

describe('CopaitalCompanyComponent', () => {
  let component: CopaitalCompanyComponent;
  let fixture: ComponentFixture<CopaitalCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CopaitalCompanyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopaitalCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
