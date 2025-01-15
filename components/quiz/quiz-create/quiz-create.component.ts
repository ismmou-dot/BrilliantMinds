import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { QuizService } from 'src/app/service/quiz.service';

@Component({
  selector: 'app-quiz-create',
  templateUrl: './quiz-create.component.html',
  styleUrls: ['./quiz-create.component.css']
})
export class QuizCreateComponent {
  @Input() classId: string = ''; // Ajoutez cette ligne pour recevoir l'identifiant de la classe
  quizForm!: FormGroup;


  constructor(private fb: FormBuilder,private router: Router, private quizService: QuizService) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.quizForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.maxLength(500)]],
      duration: [null, [Validators.min(1)]],
      start_time: [null],
      end_time: [null],
      questions: this.fb.array([])
    });

    // Add initial question
    this.addQuestion();
  }

  get questions() {
    return this.quizForm.get('questions') as FormArray;
  }

  addQuestion() {
    const questionGroup = this.fb.group({
      text: ['', Validators.required],
      type: ['multiple_choice', Validators.required],
      options: this.fb.array(['', '']), // Start with two empty options
      correct_answer: ['', Validators.required],
      points: [1, [Validators.required, Validators.min(1)]]
    });

    this.questions.push(questionGroup);
  }

  removeQuestion(index: number) {
    if (this.questions.length > 0) {
      this.questions.removeAt(index);
    }
  }

  getOptions(questionIndex: number) {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }

  addOption(questionIndex: number) {
    const options = this.getOptions(questionIndex);
    options.push(this.fb.control(''));
  }

  removeOption(questionIndex: number, optionIndex: number) {
    const options = this.getOptions(questionIndex);
    if (options.length > 2) {
      options.removeAt(optionIndex);
    }
  }

  onTypeChange(event: any, questionIndex: number) {
    const questionGroup = this.questions.at(questionIndex);
    const newType = event.target.value;

    if (newType === 'true_false') {
      questionGroup.patchValue({
        correct_answer: 'true'
      });
    } else if (newType === 'multiple_choice') {
      // Reset options when switching to multiple choice
      (questionGroup as FormGroup).setControl('options', this.fb.array(['', '']));
    }
  }

  adjustPoints(questionIndex: number, adjustment: number) {
    const questionGroup = this.questions.at(questionIndex);
    const currentPoints = questionGroup.get('points')?.value || 0;
    const newPoints = Math.max(1, currentPoints + adjustment);
    questionGroup.patchValue({ points: newPoints });
  }

  getErrorMessage(control: any, fieldName: string): string {
    if (control.hasError('required')) {
      return `${fieldName} est requis`;
    }
    if (control.hasError('maxlength')) {
      return `${fieldName} est trop long`;
    }
    if (control.hasError('min')) {
      return `${fieldName} doit être supérieur à 0`;
    }
    return '';
  }

  onSubmit() {
    if (this.quizForm.valid) {
      console.log('Quiz submitted:', this.quizForm.value);
      this.quizService.createQuiz(this.classId, this.quizForm.value).subscribe(
        (response) => {
          console.log('Quiz created:', response);
          this.router.navigate(['/quiz', response.id]);
          },
          (error) => {
            console.error('Error creating quiz:', error);
          }
      );
      // Handle form submission
    } else {
      this.markFormGroupTouched(this.quizForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }
}
