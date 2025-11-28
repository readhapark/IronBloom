import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeLibrary } from './recipe-library';

describe('RecipeLibrary', () => {
  let component: RecipeLibrary;
  let fixture: ComponentFixture<RecipeLibrary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeLibrary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeLibrary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
