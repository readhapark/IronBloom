import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachChat } from './coach-chat';

describe('CoachChat', () => {
  let component: CoachChat;
  let fixture: ComponentFixture<CoachChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachChat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachChat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
