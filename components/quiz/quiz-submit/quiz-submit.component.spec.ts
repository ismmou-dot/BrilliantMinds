import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizSubmitComponent } from './quiz-submit.component';

describe('QuizSubmitComponent', () => {
  let component: QuizSubmitComponent;
  let fixture: ComponentFixture<QuizSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizSubmitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select a multiple-choice option when clicked', () => {
    component.currentQuestionIndex = 0; // Ensure we are on the first question
    fixture.detectChanges();
    
    const optionElement = fixture.nativeElement.querySelector('.multiple-choice .option');
    optionElement.click();
    fixture.detectChanges();
    
    expect(optionElement.classList).toContain('selected');
    expect(component.quizForm.get('answers')?.value[0]?.answer).toBe('2x');
  });
});
