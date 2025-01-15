import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateClassComponent } from './components/teacher/create-class/create-class.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegistrationComponent } from './components/auth/registration/registration.component';
import { StudentDashboardComponent } from './components/student/dashboard/dashboard.component';
import { DiscussionDetailComponent } from './components/discussion/discussion-detail/discussion-detail.component';
import { ClassDetailComponent } from './components/class/class-detail/class-detail.component';
import { AuthGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/auth/profile/profile.component';
import { AssignmentListComponent } from './components/class/assignment-list/assignment-list.component';
import { SubmitAssignmentComponent } from './components/student/submit-assignment/submit-assignment.component';
import { SubmissionsComponent } from './components/teacher/submissions/submissions.component';
import { QuizSubmitComponent } from './components/quiz/quiz-submit/quiz-submit.component';
import { QuizSubmissionsComponent } from './components/quiz/quiz-submissions/quiz-submissions.component';
import { TeacherDashboardComponent } from './components/teacher/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  {path:'home',component:HomeComponent},
  {path:'schedule',component:ScheduleComponent},

  { path: 'teacher/dashboard', component: TeacherDashboardComponent  },
  { path: 'student/dashboard', component: StudentDashboardComponent  },

  { path: 'create-class', component: CreateClassComponent },
  {path: 'class/:classId', component: ClassDetailComponent},
  { path: 'class/:classId/discussion', component: DiscussionDetailComponent }, 
  {path:'profile',component:ProfileComponent},
  {path:'submit/:id',component:SubmitAssignmentComponent},
  {path:'assignments',component:AssignmentListComponent},
  { path: 'submissions/:id', component: SubmissionsComponent },
  {path:'submitQuiz/:id',component:QuizSubmitComponent},
  {path:'quiz/:id',component:QuizSubmissionsComponent},

  { path: '**', redirectTo: 'login' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
