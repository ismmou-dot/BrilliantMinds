import { Component, EventEmitter, Input, OnInit, Output, HostListener } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Output() tabSelected = new EventEmitter<string>();
  @Input() activeTab: string = ''; // Ajoutez cette ligne pour recevoir l'onglet actif
  isSmallScreen: boolean = false;
  isTeacher: boolean = true; 

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {

    this.isSmallScreen = window.innerWidth <= 640;
  }

  selectTab(tab: string) {
    this.tabSelected.emit(tab);
  }

  constructor(private authService:AuthService) {
    this.isTeacher = this.authService.getUserRole() === 'teacher';
   }

  ngOnInit(): void {
    this.isSmallScreen = window.innerWidth <= 640;
   
  }
}
