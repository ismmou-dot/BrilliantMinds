import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegistrationComponent } from './components/auth/registration/registration.component';
import {  TeacherDashboardComponent } from './components/teacher/dashboard/dashboard.component';
import { CreateClassComponent } from './components/teacher/create-class/create-class.component';
import { StudentDashboardComponent } from './components/student/dashboard/dashboard.component';
import { ClassDetailComponent } from './components/class/class-detail/class-detail.component';
import { DiscussionDetailComponent } from './components/discussion/discussion-detail/discussion-detail.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FileSizePipe, PostComponent } from './components/discussion/post/post.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreatePostComponent } from './components/discussion/create-post/create-post.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { ProfileComponent } from './components/auth/profile/profile.component';
import { CreateAssignmentComponent } from './components/teacher/create-assignment/create-assignment.component';
import { SubmitAssignmentComponent } from './components/student/submit-assignment/submit-assignment.component';
import { AssignmentsComponent } from './components/class/assignments/assignments.component';
import { AssignmentDetailComponent } from './components/class/assignment-detail/assignment-detail.component';
import { AssignmentListComponent } from './components/class/assignment-list/assignment-list.component';
import { RouterModule } from '@angular/router';
import { SubmissionsComponent } from './components/teacher/submissions/submissions.component';
import { QuizCreateComponent } from './components/quiz/quiz-create/quiz-create.component';
import { QuizListComponent } from './components/class/quiz-list/quiz-list.component';
import { QuizSubmitComponent } from './components/quiz/quiz-submit/quiz-submit.component';
import { QuizSubmissionsComponent } from './components/quiz/quiz-submissions/quiz-submissions.component';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { StudentsComponent } from './components/teacher/students/students.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    RegistrationComponent,
    StudentDashboardComponent,
    TeacherDashboardComponent,
    CreateClassComponent,
    StudentDashboardComponent,
    ClassDetailComponent,
    DiscussionDetailComponent,
    NavbarComponent,
    PostComponent,
    CreatePostComponent,
    FileSizePipe,
    ProfileComponent,
    CreateAssignmentComponent,
    SubmitAssignmentComponent,
    AssignmentsComponent,
    AssignmentDetailComponent,
    AssignmentListComponent,
    SubmissionsComponent,
    QuizCreateComponent,
    QuizListComponent,
    QuizSubmitComponent,
    QuizSubmissionsComponent,
    HomeComponent,
    ScheduleComponent,
    StudentsComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatOptionModule,
    MatCardModule,
    BrowserModule,
    FormsModule,
    RouterModule,
    CommonModule,
    RouterModule.forRoot([
      { path: 'submit', component: SubmitAssignmentComponent },
      {path:'submitQuiz',component:QuizSubmitComponent},
      {path:'quiz',component:QuizSubmissionsComponent},
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
