import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratorInputComponent } from './generator-input.component';

describe('GeneratorInputComponent', () => {
  let component: GeneratorInputComponent;
  let fixture: ComponentFixture<GeneratorInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneratorInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeneratorInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
