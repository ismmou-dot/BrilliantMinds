import { Component, OnInit, Output, EventEmitter, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/service/auth.service';
import { DiscussionService } from 'src/app/service/discussion.service';

interface FilePreview {
  file: File;
  url?: string;
  type: 'image' | 'document' | 'video' | 'other';
  icon: string;
}

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  @Input() discussionId: any;
  postForm: FormGroup;
  classSelect = this.fb.control('all');
  linkInput = this.fb.control('');
  previews: FilePreview[] = [];
  showLinkInput = false;

  constructor(
    private fb: FormBuilder,
    private discussionService: DiscussionService,
    private dialogRef: MatDialogRef<CreatePostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.postForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log('Discussion ID:', this.data.discussionId); // Debug: Afficher l'ID de la discussion
  }

  getFileIcon(type: string): string {
    const icons = {
      'image': '📷',
      'application/pdf': '📄',
      'application/msword': '📝',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
      'application/vnd.ms-excel': '📊',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
      'video': '🎥',
      'audio': '🎵'
    };

    for (const [key, value] of Object.entries(icons)) {
      if (type.startsWith(key)) return value;
    }
    return '📎';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const files = Array.from(input.files);
    console.log('Files selected:', files); // Debug: Afficher les fichiers sélectionnés

    files.forEach(file => {
      const preview: FilePreview = {
        file,
        type: file.type.startsWith('image/') ? 'image' : 'document',
        icon: this.getFileIcon(file.type)
      };

      if (preview.type === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
          preview.url = e.target?.result as string;
          this.previews.push(preview);
          console.log('Image preview URL:', preview.url); // Debug: Afficher l'URL de l'aperçu
        };
        reader.readAsDataURL(file);
      } else {
        this.previews.push(preview);
      }
    });
    console.log('Previews array:', this.previews); // Debug: Afficher le tableau d'aperçus
  }

  toggleLinkInput(): void {
    this.showLinkInput = !this.showLinkInput;
    if (this.showLinkInput) {
      setTimeout(() => {
        const linkInput = document.querySelector('.link-input') as HTMLInputElement;
        linkInput?.focus();
      });
    }
  }

  addLink(event: Event): void {
    event.preventDefault();
    const url = this.linkInput.value;

    if (!url) return;

    // Basic URL validation
    try {
      new URL(url);
      const content = this.postForm.get('content');
      const currentContent = content?.value || '';
      const newContent = currentContent + (currentContent ? '\n' : '') + url;
      content?.setValue(newContent);
      
      this.linkInput.setValue('');
      this.showLinkInput = false;
      console.log('Link added to content:', newContent); // Debug: Afficher le nouveau contenu
    } catch {
      // Handle invalid URL
      alert('Please enter a valid URL');
      console.error('Invalid URL entered:', url); // Debug: Afficher l'URL invalide
    }
  }

  removeFile(index: number): void {
    this.previews.splice(index, 1);
    console.log('File removed, updated previews:', this.previews); // Debug: Afficher le tableau d'aperçus mis à jour
  }

  onSubmit(): void {
   
  
    // Construire un objet `postData` structuré
    const postData = {
      content: this.postForm.get('content')?.value, // Contenu du post
      links: this.linkInput.value ? [this.linkInput.value] : [], // Liste des liens
    };
  
    // Ajout des fichiers dans un tableau compatible
    const formData = new FormData();
    formData.append('content', postData.content);
    postData.links.forEach((link, index) => {
      formData.append(`links[${index}]`, link);
    });
  
    this.previews.forEach((preview, index) => {
      formData.append(`files[${index}]`, preview.file);
    });
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    }); // Debug: Afficher le contenu du formulaire
    // Appeler le service pour soumettre le post
    this.discussionService.createPost(this.data.discussionId, formData).subscribe({
      next: (response) => {
        console.log('Post created successfully:', response);
        alert('Post created successfully!');
        this.cancel();
      },
      error: (error) => {
        console.error('Error creating post:', error);
        alert('Failed to create post. Please try again.');
      }
    });
  }
  


  cancel(): void {
    this.postForm.reset();
    this.previews = [];
    this.classSelect.setValue('all');
    this.linkInput.setValue('');
    this.showLinkInput = false;
    this.dialogRef.close();
  }
}
