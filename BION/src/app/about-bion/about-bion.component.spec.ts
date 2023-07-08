import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutBionComponent } from './about-bion.component';

describe('AboutBionComponent', () => {
  let component: AboutBionComponent;
  let fixture: ComponentFixture<AboutBionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AboutBionComponent]
    });
    fixture = TestBed.createComponent(AboutBionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
