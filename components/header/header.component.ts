import { Component, AfterViewInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit {
  isNavbarCollapsed = false;
  isAuth : boolean= false;

  constructor(private renderer: Renderer2,private authService: AuthService, private router: Router) {
    
  }

  ngOnInit(): void {
    this.initNavbarAnimation();
    this.handleActiveClassOnPageLoad();
    this.isAuth=this.authService.getUserRole() !== '';
  }

  ngAfterViewInit(): void {
    this.initNavbarAnimation();
    this.handleActiveClassOnPageLoad();
  }

  initNavbarAnimation(): void {
    const horiSelector = document.querySelector('.hori-selector') as HTMLElement;
    const navbar = document.getElementById('navbarSupportedContent') as HTMLElement;

    if (navbar && horiSelector) {
      const updateSelectorPosition = () => {
        const activeItem = navbar.querySelector('.nav-item.active') as HTMLElement;
        if (activeItem) {
          horiSelector.style.top = `${activeItem.offsetTop}px`;
          horiSelector.style.left = `${activeItem.offsetLeft}px`;
          horiSelector.style.height = `${activeItem.offsetHeight}px`;
          horiSelector.style.width = `${activeItem.offsetWidth}px`;
        }
      };

      updateSelectorPosition();

      navbar.addEventListener('click', (event) => {
        const target = (event.target as HTMLElement).closest('li');
        if (target) {
          navbar.querySelectorAll('.nav-item').forEach((el) => el.classList.remove('active'));
          target.classList.add('active');
          updateSelectorPosition();
        }
      });

      window.addEventListener('resize', updateSelectorPosition);
    }
  }
  getDashboardLink(): string {
    const userRole = this.authService.getUserRole();
    if (userRole === 'teacher') {
      return '/teacher/dashboard';
    } else if (userRole === 'student') {
      return '/student/dashboard';
    }
    return '/login'; // Fallback if role is undefined
  }
  getProfileLink(): string {
    
    return '/profile'; // Fallback if role is undefined
  }
  logout() {
    this.authService.logout();
    window.location.reload();
    this.router.navigate(['/login']); // Redirect to the login page
  }

  handleActiveClassOnPageLoad(): void {
    const path = window.location.pathname;
    const links = document.querySelectorAll('#navbarSupportedContent ul li a');
    links.forEach((link) => {
      const parent = link.parentElement;
      console.log("link",link.getAttribute('routerLink'));
      if (parent && (link.getAttribute('routerLink') === path || link.getAttribute('routerLink') === this.getDashboardLink())) {
        parent.classList.add('active');
      }
    });
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
