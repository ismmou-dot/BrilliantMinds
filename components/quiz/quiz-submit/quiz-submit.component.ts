import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from 'src/app/service/quiz.service';
import { Quiz } from 'src/app/models/Quiz';

@Component({
  selector: 'app-quiz-submit',
  templateUrl: './quiz-submit.component.html',
  styleUrls: ['./quiz-submit.component.css']
})
export class QuizSubmitComponent implements OnInit {

  quizForm: FormGroup;
  timeRemaining: string = '';
  currentQuestionIndex: number = 0;
  quiz: Quiz | null = null;
  isSubmitted: boolean = false;
  submittedAnswers: any[] = [];
  score: number = 0;
  private lastMouseMoveTime: number = 0;
  private cheatingDetected: boolean = false;
  cheatingMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService
  ) {
    this.quizForm = this.fb.group({
      answers: this.fb.array([])
    });
  }

  ngOnInit() {
    const quizId = this.route.snapshot.paramMap.get('id');
    if (quizId) {
      this.checkIfSubmitted(Number(quizId));
    }
    this.detectMouseMovement();
  }

  private checkIfSubmitted(quizId: number) {
    this.quizService.checkIfSubmitted(quizId).subscribe(response => {
      
      if (response && response.answers) {
        console.log('Check if submitted:', response);
        this.isSubmitted = true;
        this.submittedAnswers = response.answers;
        this.score = response.score;
        this.fetchQuiz(quizId);
      } else {
        this.fetchQuiz(quizId);
      }
    });
  }

  private fetchQuiz(quizId: number) {
    this.quizService.getQuiz(quizId).subscribe((quiz: Quiz) => {
      this.quiz = quiz;
      this.initializeForm();
      this.startTimer();
    });
  }

  private initializeForm() {
    if (!this.quiz) return;
    const answersArray = this.quiz.questions.map(question => {
      return this.fb.group({
        questionId: [question.id],
        answer: ['', [Validators.required]]
      });
    });
    this.quizForm = this.fb.group({
      answers: this.fb.array(answersArray)
    });
  }

  get answers() {
    return this.quizForm.get('answers') as FormArray;
  }

  getFormGroup(index: number): FormGroup {
    return (this.answers.at(index) as FormGroup);
  }

  isAnswerInvalid(index: number): boolean {
    const control = this.getFormGroup(index).get('answer');
    return control ? (control.invalid && control.touched) : false;
  }

  getCurrentQuestion(): any {
    return this.quiz?.questions[this.currentQuestionIndex];
  }

  nextQuestion() {
    if (this.currentQuestionIndex < (this.quiz?.questions.length || 0) - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  private startTimer() {
    const duration = this.quiz?.duration ?? 20; // Default to 20 minutes if duration is null
    const endTime = new Date().getTime() + (duration || 0) * 60000;
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance <= 0) {
        clearInterval(timer);
        this.submitQuiz();
        this.router.navigate(['/quiz-ended']);
        return;
      }

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      this.timeRemaining = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  }

  private detectMouseMovement() {
    window.addEventListener('mousemove', () => {
      this.lastMouseMoveTime = new Date().getTime();
    });

    setInterval(() => {
      const currentTime = new Date().getTime();
      if (currentTime - this.lastMouseMoveTime > 5000) { // 30 seconds
        this.cheatingDetected = true;
        this.cheatingMessage = 'Cheating detected! You cannot answer this question.';
      }
    }, 1000);
  }

  submitQuiz() {
    if (this.cheatingDetected) {
      this.cheatingMessage = 'Quiz submission failed due to cheating detection.';
      return;
    }
    if (this.quizForm.valid) {
      const formValue = this.quizForm.value;
      let score = 0;
      formValue.answers.forEach((answer: any, index: number) => {
        if (this.quiz?.questions[index].correct_answer === answer.answer) {
          score += this.quiz?.questions[index].points || 0;
        }
      });
      const answers = {
        score: score,
        answers: formValue.answers.map((answer: any) => ({
          questionId: answer.questionId,
          answer: answer.answer
        }))
      };
      this.quizService.submitQuiz(this.quiz?.id, answers).subscribe(
        response => {
          this.isSubmitted = true;
          this.submittedAnswers = answers.answers;
          this.score = score;
          alert(`Quiz submitted successfully! Your score is ${score}.`);
        },
        error => {
          console.error('Submission failed:', error);
        }
      );
    } else {
      this.answers.controls.forEach(control => {
        control.markAsTouched();
      });
      console.error('Please answer all questions');
    }
  }

  isLastQuestion(): boolean {
    return this.currentQuestionIndex === (this.quiz?.questions.length || 0) - 1;
  }

  getProgressPercentage(): number {
    return ((this.currentQuestionIndex + 1) / (this.quiz?.questions.length || 1)) * 100;
  }

  selectOption(option: string) {
    if (this.cheatingDetected) {
      this.cheatingMessage = 'Cheating detected! You cannot answer this question.';
      return;
    }
    (this.quizForm.get('answers') as FormArray).at(this.currentQuestionIndex).get('answer')?.setValue(option);
  }

  isSelected(option: string): boolean {
    const questionControl = (this.quizForm.get('answers') as FormArray).at(this.currentQuestionIndex);
    return questionControl?.get('answer')?.value === option;
  }
}
