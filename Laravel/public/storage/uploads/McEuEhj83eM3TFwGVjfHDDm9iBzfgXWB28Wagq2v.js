// create-post.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface FilePreview {
  file: File;
  url: string;
}

@Component({
  selector: 'app-create-post',
  template: `
    <div class="post-container">
      <!-- Class Selection -->
      <div class="select-wrapper">
        <select [formControl]="classSelect" class="class-select">
          <option value="all">All students</option>
          <option value="math">Math class</option>
          <option value="science">Science class</option>
        </select>
      </div>

      <!-- Post Content -->
      <form [formGroup]="postForm" (ngSubmit)="onSubmit()">
        <div class="content-wrapper">
          <textarea
            formControlName="content"
            placeholder="Share something with your class..."
            class="content-input"
            rows="4"
          ></textarea>
        </div>

        <!-- File Previews -->
        <div class="preview-grid" *ngIf="previews.length > 0">
          <div class="preview-item" *ngFor="let preview of previews; let i = index">
            <img [src]="preview.url" alt="Preview" class="preview-image">
            <button type="button" class="remove-btn" (click)="removeFile(i)">
              <span class="close-icon">×</span>
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="actions-bar">
          <div class="left-actions">
            <label class="upload-btn">
              <input
                type="file"
                multiple
                (change)="onFileSelected($event)"
                accept="image/*"
                hidden
              >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </label>
            <button type="button" class="link-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            </button>
          </div>
          <div class="right-actions">
            <button type="button" class="cancel-btn" (click)="cancel()">Cancel</button>
            <button type="submit" class="post-btn" [disabled]="postForm.invalid">
              <span class="btn-content">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                Post
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .post-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      padding: 24px;
    }

    .select-wrapper {
      margin-bottom: 16px;
    }

    .class-select {
      padding: 8px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      width: 200px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .class-select:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    }

    .content-wrapper {
      margin-bottom: 16px;
    }

    .content-input {
      width: 100%;
      padding: 16px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      resize: vertical;
      min-height: 120px;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .content-input:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    }

    .preview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }

    .preview-item {
      position: relative;
      aspect-ratio: 16/9;
      border-radius: 8px;
      overflow: hidden;
    }

    .preview-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .remove-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      background: white;
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .preview-item:hover .remove-btn {
      opacity: 1;
    }

    .close-icon {
      font-size: 18px;
      line-height: 1;
      color: #666;
    }

    .actions-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
    }

    .left-actions, .right-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .upload-btn, .link-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border: none;
      background: transparent;
      border-radius: 8px;
      color: #64748b;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .upload-btn:hover, .link-btn:hover {
      background: #f1f5f9;
    }

    .cancel-btn {
      padding: 8px 16px;
      border: none;
      background: transparent;
      color: #64748b;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .cancel-btn:hover {
      background: #f1f5f9;
    }

    .post-btn {
      padding: 8px 16px;
      border: none;
      background: #3b82f6;
      color: white;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.2s;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .post-btn:hover {
      background: #2563eb;
    }

    .post-btn:disabled {
      background: #93c5fd;
      cursor: not-allowed;
    }

    .btn-content {
      display: flex;
      align-items: center;
      gap: 6px;
    }
  `]
})
export class CreatePostComponent {
  postForm: FormGroup;
  classSelect = this.fb.control('all');
  previews: FilePreview[] = [];

  constructor(private fb: FormBuilder) {
    this.postForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const files = Array.from(input.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previews.push({
            file,
            url: e.target?.result as string
          });
        };
        reader.readAsDataURL(file);
      }
    });
  }

  removeFile(index: number): void {
    this.previews.splice(index, 1);
  }

  onSubmit(): void {
    if (this.postForm.invalid) return;
    
    const formData = new FormData();
    formData.append('class', this.classSelect.value);
    formData.append('content', this.postForm.get('content')?.value);
    this.previews.forEach(preview => {
      formData.append('files', preview.file);
    });

    // Add your API call here
    console.log('Submitting:', formData);
  }

  cancel(): void {
    this.postForm.reset();
    this.previews = [];
    this.classSelect.setValue('all');
  }
}
