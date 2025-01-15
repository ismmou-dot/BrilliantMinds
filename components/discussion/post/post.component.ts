import { Component, EventEmitter, Input, OnInit, Output, Pipe, PipeTransform } from '@angular/core';
import { DiscussionService } from 'src/app/service/discussion.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Post {
  id: number;
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
  content: string;
  created_at: string;
  files?: Array<{
    name: string;
    file_path: string;
    size: number;
    type: string;
  }>;
  links?: Array<{
    url: string;
  }>;
  comments?: Array<{
    id: number;
    user: {
      id: number;
      name: string;
      avatar?: string;
    };
    content: string;
    created_at: string;
  }>;
  class?: string;
}

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() post!: Post;
  @Input() currentUserId!: number;
  @Input() isTeacher: boolean = false;
  @Input() isOwner: boolean = false;
  @Output() deletePostEvent = new EventEmitter<number>();

  newComment: string = '';
  isViewerOpen = false;
  viewerFilePath: SafeResourceUrl | null = null;
  viewerFileType: string | null = null;

  constructor(private discussionService: DiscussionService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    console.log('Post data:', this.post);
  }

  getInitial(name: string | undefined): string {
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  getFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension) return 'other';

    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'image';
      case 'pdf':
        return 'pdf';
      case 'doc':
      case 'docx':
        return 'doc';
      case 'xls':
      case 'xlsx':
        return 'excel';
      case 'zip':
      case 'rar':
        return 'zip';
      case 'txt':
        return 'txt';
      default:
        return 'other';
    }
  }

  refreshComments(postId: number): void {
    this.discussionService.getPost(postId).subscribe(
      (updatedPost: Post) => {
        console.log('Updated post data:', updatedPost);
        this.post.comments = updatedPost.comments; // Update the comments array
      },
      (error) => {
        console.error('Error refreshing comments:', error);
      }
    );
  }

  deletePost(): void {
    this.deletePostEvent.emit(this.post.id);
  }

  addComment(postId: number): void {
    if (!this.newComment.trim()) return;

    const newComment = {
      id: Date.now(), 
      user: {
        id: this.currentUserId,
        name: "", 
        avatar: undefined, 
      },
      content: this.newComment,
      created_at: new Date().toISOString(),
    };


    this.post.comments = [...(this.post.comments || []), newComment];

    this.discussionService.PostComment(postId, this.newComment).subscribe(
      (response) => {
        console.log('Comment added:', response);
        this.refreshComments(postId); 
      },
      (error) => {
        console.error('Error adding comment:', error);
        this.post.comments = this.post.comments?.filter(c => c.id !== newComment.id); 
      }
    );

    this.newComment = ''; 
  }

  openViewer(filePath: string, fileType: string): void {
    if (fileType === 'pdf') {
      window.open(filePath, '_blank');
    } else if (fileType === 'image') {
      this.viewerFilePath = this.sanitizer.bypassSecurityTrustResourceUrl(filePath);
      this.viewerFileType = fileType;
      this.isViewerOpen = true;
    }
  }

  closeViewer(): void {
    this.isViewerOpen = false;
    this.viewerFilePath = null;
    this.viewerFileType = null;
  }

  getViewerUrl(filePath: string, fileType: string): string {
    if (fileType === 'pdf' || fileType === 'doc') {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(filePath)}&embedded=true`;
    }
    return filePath;
  }

  getSafeViewerUrl(): SafeResourceUrl | null {
    if (this.viewerFilePath && typeof this.viewerFilePath === 'string') {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.viewerFilePath);
    }
    return this.viewerFilePath;
  }
}


@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {
  transform(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }
}

