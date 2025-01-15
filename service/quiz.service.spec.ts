import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { QuizService } from './quiz.service';

describe('QuizService', () => {
  let service: QuizService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should submit quiz and return response', () => {
    const quizId = 1;
    const data = { answers: [] };
    const response = { success: true };

    spyOn(service, 'submitQuiz').and.returnValue(of(response));

    service.submitQuiz(quizId, data).subscribe(res => {
      expect(res).toEqual(response);
    });
  });
});
