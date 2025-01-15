import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentService } from 'src/app/service/assignment.service';
import { AuthService } from 'src/app/service/auth.service';
 interface Assignment {
  id: string;
  title: string;
  dueDate: Date;
  class: string;
  instructions: string;
  status: 'pending' | 'submitted' | 'late';
}
@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css']
})
export class AssignmentDetailComponent implements OnInit {

   // Ajoutez cette ligne pour recevoir l'identifiant de la classe
  assignments: any ;
  showCreateModal = false;
  role: 'teacher' | 'student' = 'student'; // Par défaut, rôle étudiant
  router: any;
  isTeacher: boolean = true; 
  editingAssignment: Assignment | null = null;


  constructor(private authService: AuthService,private assignmentService: AssignmentService, router: Router, private http: HttpClient) {}

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
    this.editingAssignment = null;
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
    this.router.navigate(['/assignments', id]);
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

}
