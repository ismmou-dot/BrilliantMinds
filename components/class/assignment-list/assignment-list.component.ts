import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssignmentService } from 'src/app/service/assignment.service';
import { AuthService } from 'src/app/service/auth.service';
import { ClassService } from 'src/app/service/class.service';

@Component({
  selector: 'app-assignment-list',
  templateUrl: './assignment-list.component.html',
  styleUrls: ['./assignment-list.component.css']
})
export class AssignmentListComponent implements OnInit {
   @Input() classId: string = ''; 
  assignments: any ;
  showCreateModal = false;
  role: 'teacher' | 'student' = 'student'; // Par défaut, rôle étudiant
  router: any;
  isTeacher: boolean = true; 
  editingAssignment: any;

  constructor(private authService: AuthService, private assignmentService: AssignmentService, private classService :ClassService,router: Router, private http: HttpClient) {
    this.router = router;
  }

  ngOnInit() {
    this.isTeacher = this.authService.getUserRole() === 'teacher';
    this.getAssignments();
  }

  deleteAssignment(assignmentId: string) {
    if (!this.isTeacher) return;
    if (confirm('Are you sure you want to delete this assignment?')) {
      // Implement delete logic
    }
  }

  openCreateModal() {
    if (!this.isTeacher) return;
    this.showCreateModal = true;
    document.body.style.overflow = 'hidden';
  }

  getAssignments() {
    this.assignmentService.getAssignments().subscribe(
      (data) => {
        this.assignments = data;
        console.log("assignments" ,data);
      },
      (error) => {
        console.error('Erreur lors de la récupération des devoirs', error);
      }
    );
  }

  // Navigation vers la page de détail
  navigateToDetail(id: string) {
    if (this.isTeacher) {
      this.router?.navigate(['submissions', id]).catch((err: any) => console.error('Navigation failed:', err));
    } else {
      console.log('Navigating to submit page', this.router);
      this.router?.navigate(['submit', id]).catch((err: any) => console.error('Navigation failed:', err));
    }
  }

  closeCreateModal() {
    this.showCreateModal = false;
    document.body.style.overflow = 'auto'; // Restore background scrolling
  }

  onAssignmentCreated(assignment: any) {
    // Handle the newly created assignment (e.g., add to list, refresh data)
    this.closeCreateModal();
    // Optionally refresh the assignments list
    // this.loadAssignments();
  }

  // Vérifier si un devoir est en retard
  isOverdue(dueDate: Date): boolean {
    return  !dueDate && new Date(dueDate) < new Date();
  }

  goBack() {
    window.history.back();
  }

  editAssignment(assignment: any) {
    if (!this.isTeacher) return;
    this.editingAssignment = assignment;
    this.showCreateModal = true;
    document.body.style.overflow = 'hidden';
  }

  createClass() {
    // Implement create class logic
  }

}
