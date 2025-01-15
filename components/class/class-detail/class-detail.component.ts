import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { ClassService } from 'src/app/service/class.service';

@Component({
  selector: 'app-class-detail',
  templateUrl: './class-detail.component.html',
  styleUrls: ['./class-detail.component.css']
})
export class ClassDetailComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  previewImage: string | null = null;
  isSaving: boolean = false;
  
  classId: any;
  classDetails: any;
  json: any;
  activeTab: string = 'discussion';
  defaultBgImage: string = 'assets/default-class-bg.jpg'; // Add default background image path
  isPopupOpen: boolean = false; // Add a flag to control popup visibility
  selectedFile: File | null = null; // Add a variable to store the selected file
  isTeacher: boolean = true; 
  constructor(private classService: ClassService, @Inject(AuthService) private authService: AuthService, private sanitizer: DomSanitizer, private activateRoute: ActivatedRoute) {}

  ngOnInit() {
    this.classId = this.activateRoute.snapshot.paramMap.get('classId'); // Example class ID
    this.getClassDetails();
    this.isTeacher = this.authService.getUserRole() === 'teacher';
  }

  getClassDetails() {
    this.classService.getClass(this.classId).subscribe(
      (response) => {
        this.classDetails = response.class;
        console.log("class", this.classDetails);
      },
      (error) => {
        console.error('Error fetching class details:', error);
      }
    );
  }

  getBackgroundImage(): string {
    if (this.classDetails && this.classDetails.background) {
      try {
        new URL(this.classDetails.backgrounds);
        // console.log('valid background image URL:', this.classDetails.background);
        return this.classDetails.background;
      } catch (_) {
        // console.error('Invalid background image URL:', this.classDetails.background);
        return this.defaultBgImage;
      }
    }
    return this.defaultBgImage;
  }
  // getBackgroundImage(): SafeStyle {
    
  //   const bgImage = this.classDetails?.backgrounds|| this.defaultBgImage;
  //   return this.sanitizer.bypassSecurityTrustStyle(`url('${bgImage}')`);
  // }
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  copyClassCode() {
    navigator.clipboard.writeText(this.classDetails.code)
      .then(() => {
        // You could add a toast notification here
        console.log('Class code copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy class code:', err);
      });
  }

  openCustomizePopup() {
    this.isPopupOpen = true;
  }

  closeCustomizePopup() {
    this.isPopupOpen = false;
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.previewImage = null;
    this.fileInput.nativeElement.value = '';
  }

  saveClassDetails() {
    this.isSaving = true;
    if (this.selectedFile) {
      const formData = new FormData();
      
      formData.append('background', this.selectedFile);
      formData.append('name', this.classDetails.name);
      formData.append('description', this.classDetails.description);

      this.classService.updateClass(this.classId, formData).subscribe(
        (response) => {
          console.log('Class details updated successfully');
          this.closeCustomizePopup();
          this.getClassDetails(); // Refresh class details to show updated background image
          this.isSaving = false;
        },
        (error) => {
          console.error('Error updating class details:', error);
          this.isSaving = false;
        }
      );
    } else {
      this.classService.updateClass(this.classId, this.classDetails).subscribe(
        (response) => {
          console.log('Class details updated successfully');
          this.closeCustomizePopup();
          this.isSaving = false;
        },
        (error) => {
          console.error('Error updating class details:', error);
          this.isSaving = false;
        }
      );
    }
  }
}
