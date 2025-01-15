import { Component, OnInit, Input } from '@angular/core';
import { DiscussionService } from '../../../service/discussion.service';
import {Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CreatePostComponent } from '../create-post/create-post.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-discussion-detail',
  templateUrl: './discussion-detail.component.html',
  styleUrls: ['./discussion-detail.component.css'],
})
export class DiscussionDetailComponent implements OnInit {
  @Input() discussion: any;
  discussionDetails: any; 
  newPostContent: string = '';
  dialogRef: any; 
  posts: any[] = [];
  currentUserId: number = 1; 
  isTeacher: boolean = true; 
  navigationSubscription:Subscription;

  constructor(  private discussionService: DiscussionService,private dialog: MatDialog,
    private authService: AuthService, 
    private route: ActivatedRoute,
    private router: Router) {
      this.navigationSubscription = this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart && this.dialogRef) {
          this.dialogRef.close();
        }
      });
    }

  ngOnInit() {
    this.currentUserId = this.authService.getUserId(); 
    this.isTeacher = this.authService.isTeacher(); 
    console.log('DiscussionDetailComponent Initialized');
    console.log('Received Discussion:', this.discussion);

    this.getDiscussionDetails();
  }
  openCreatePostDialog(): void {
    this.dialogRef = this.dialog.open(CreatePostComponent, {
      data: { discussionId: this.discussion.id },
      width: '700px', 
      height: '700px', 
      hasBackdrop: true, 
      disableClose: false, 
      position: { left: '20%' }, 
    },);

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('Post soumis:', result);
      }
    });
  }
  
  ngOnDestroy(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
  getDiscussionDetails() {
    if (this.discussion) {
      console.log('Fetching posts for discussion ID:', this.discussion.id);
      this.discussionService.getPosts(this.discussion.id).subscribe(
        (response) => {
          this.discussionDetails = { ...this.discussion, posts: response.posts };
          console.log('Discussion Details with Posts:', this.discussionDetails);
        },
        (error) => {
          console.error('Error fetching discussion details:', error);
        }
      );
    } else {
      console.log('No discussion data provided');
    }
  }

  deletePost(postId: number) {
    console.log('Attempting to delete post with ID:', postId);

    this.discussionService.deletePost(this.discussion.id, postId).subscribe(
      (response) => {
        console.log('Post deleted successfully:', response);
        this.discussionDetails.posts = this.discussionDetails.posts.filter(
          (post: any) => post.id !== postId
        );
      },
      (error) => {
        console.error('Error deleting post:', error);
        
      }
    );
  }
}
