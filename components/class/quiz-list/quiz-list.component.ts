import { Component, Input, OnInit } from '@angular/core';
import { QuizService } from 'src/app/service/quiz.service';
import { Quiz } from 'src/app/models/Quiz';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.css'],
})
export class QuizListComponent implements OnInit {
  @Input() classId: string = ''; // Ajoutez cette ligne pour recevoir l'identifiant de la classe
  router: any;
  constructor(private quizService: QuizService ,router:Router,private authService: AuthService) {
    this.router = router;
    this.isTeacher = this.authService.getUserRole() === 'teacher';
   }
  ngOnInit(): void {
    this.fetchQuizzes();
  }

  isTeacher = true; // Replace with actual auth logic
  showCreateModal = false;
  
  quizzes: Quiz[] = [];

  fetchQuizzes() {
    this.quizService.getQuizzes(this.classId).subscribe((quizzes: Quiz[]) => {
      const currentDateTime = new Date();
      this.quizzes = quizzes.map(quiz => {
        const startDateTime = quiz.start_time ? new Date(quiz.start_time) : new Date();
        const endDateTime = new Date(startDateTime.getTime() + (quiz.duration ?? 0) * 60000);
        if (currentDateTime < startDateTime) {
          quiz.status = 'upcoming';
        } else if (currentDateTime >= startDateTime && currentDateTime <= endDateTime) {
          quiz.status = 'active';
        } else {
          quiz.status = 'completed';
        }
        return quiz;
      });
    });
  }

  openCreateModal() {
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    document.body.style.overflow = 'auto';
  }

  navigateToDetail(quizId: number) {
    if(this.isTeacher){
      this.router.navigate(['/quiz', quizId]);
    } else
    this.router.navigate(['/submitQuiz', quizId]);
    console.log(`Navigating to quiz ${quizId}`);
  }

  onQuizCreated(quiz: any) {
    
    this.closeCreateModal();
  }

}
