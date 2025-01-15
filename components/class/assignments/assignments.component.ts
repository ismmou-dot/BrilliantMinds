import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AssignmentService } from 'src/app/service/assignment.service';
import { AuthService } from 'src/app/service/auth.service';

export interface Assignment {
  id: string;
  title: string;
  dueDate: Date;
  class: string;
  instructions: string;
  status: 'pending' | 'submitted' | 'late';
}

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit {
  @Input() classId: string = ''; // Ajoutez cette ligne pour recevoir l'identifiant de la classe
  assignments: any ;
  showCreateModal = false;
  role: 'teacher' | 'student' = 'student'; // Par défaut, rôle étudiant
  private router: Router;
  isTeacher: boolean = true; 
  editingAssignment: Assignment | null = null;

  constructor(private authService: AuthService, private assignmentService: AssignmentService, private http: HttpClient, router: Router) {
    this.router = router;
  }

  ngOnInit() {
    this.isTeacher = this.authService.getUserRole() === 'teacher';
    this.navigateToDetail = this.navigateToDetail.bind(this);
    this.getAssignmentsByClass(this.classId);
  }

  deleteAssignment(assignmentId: string) {
    if (!this.isTeacher) return;
    if (confirm('Are you sure you want to delete this assignment?')) {
      // Implement delete logic
    }
  }

  openCreateModal() {
    if (!this.isTeacher) return;
    this.editingAssignment = null;
    this.showCreateModal = true;
    document.body.style.overflow = 'hidden';
  }

  editAssignment(assignment: Assignment) {
    if (!this.isTeacher) return;
    this.editingAssignment = assignment;
    this.showCreateModal = true;
    document.body.style.overflow = 'hidden';
  }

  getAssignmentsByClass(classId: string) {
    this.assignmentService.getAssignmentsByClassId(classId).subscribe(
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
}
