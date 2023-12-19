import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Image2imageComponent } from './image2image.component';

describe('Image2imageComponent', () => {
  let component: Image2imageComponent;
  let fixture: ComponentFixture<Image2imageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Image2imageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Image2imageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
