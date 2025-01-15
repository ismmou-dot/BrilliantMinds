import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from 'src/app/service/quiz.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-quiz-submissions',
  templateUrl: './quiz-submissions.component.html',
  styleUrls: ['./quiz-submissions.component.css']
})
export class QuizSubmissionsComponent implements OnInit {
  submissions: any[] = [];
  quiz: any;
  loading: boolean = true;
  totalScore: number = 0;

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    const quizId = this.route.snapshot.paramMap.get('id');
    if (quizId) {
      this.loadSubmissions(Number(quizId));
      this.loadQuizDetails(Number(quizId));

    }
    // Removed totalScore calculation from ngOnInit
  }

  loadSubmissions(quizId: number): void {
    this.quizService.getAllSubmissions(quizId).subscribe(
      data => {
        this.submissions = data;
        this.loading = false;
      },
      error => {
        console.error('Error loading submissions:', error);
        this.loading = false;
      }
    );
  }

  loadQuizDetails(quizId: number): void {
    this.quizService.getQuiz(quizId).subscribe(
      quiz => {
        this.quiz = quiz;
        this.totalScore = this.quiz.questions.reduce((sum: number, question: any) => sum + question.points, 0);
      },
      error => console.error('Error loading quiz details:', error)
    );
  }

  getScoreColor(score:number): string {
    if (!this.quiz || !this.quiz.questions) return '#ef4444'; 
    if ((score / this.totalScore) * 100 >= 80) return '#10b981';
    if ((score / this.totalScore) * 100 >= 60) return '#f59e0b';
    return '#ef4444';
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 1);
  }

  getAvatarColor(name: string): string {
    const colors = [
      '#10B981', '#3B82F6', '#F59E0B', '#EF4444', 
      '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6',
      '#F472B6', '#6B7280', '#374151', '#4B5563',
      '#1E293B', '#D97706', '#DC2626', '#059669',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  goBack(): void {
    this.location.back();
  }
}
