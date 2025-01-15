import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface UserData {
    name: string;
    email: string;
    role: string;
    phone: string;
    address: string;
    date_of_birth: string;
    gender: string;
    avatar: string;
    is_active: boolean;
    last_login_at: string;
    last_login_ip: string;
    last_login_browser: string;
}

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    isEditing = false;
    previewImage: string | null = null;
    profileForm: FormGroup;
    userData: UserData = {
        name: '',
        email: '',
        role: '',
        phone: '',
        address: '',
        date_of_birth: '',
        gender: '',
        avatar: '',
        is_active: false,
        last_login_at: '',
        last_login_ip: '',
        last_login_browser: ''
    };

    constructor(private fb: FormBuilder, private http: HttpClient) {
        this.profileForm = this.fb.group({
            name: [''],
            email: [''],
            phone: [''],
            address: [''],
            date_of_birth: [''],
            gender: [''],
            avatar: [''] // Keep this for input if you want to allow URL input
        });
    }

    ngOnInit() {
        this.fetchUserData();
    }
    getInitial(name: string | undefined): string {
      return name ? name.charAt(0).toUpperCase() : '?';
    }
    fetchUserData() {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        this.http.get<UserData>('http://127.0.0.1:8000/api/user', { headers }).subscribe(data => {
            this.userData = data;
            this.resetForm();
        });
    }

    resetForm() {
        this.profileForm.patchValue({
            name: this.userData.name,
            email: this.userData.email,
            phone: this.userData.phone || '',
            address: this.userData.address || '',
            date_of_birth: this.userData.date_of_birth,
            gender: this.userData.gender,
            avatar: this.userData.avatar // Preset the avatar URL
        });
        this.previewImage = this.userData.avatar || null; // Show current avatar as preview
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
        if (!this.isEditing) {
            this.resetForm();
        }
    }

    onImageSelected(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.previewImage = e.target.result; // This is the data URL of the image
                this.profileForm.patchValue({
                    avatar: file // Store the file in the form
                });
            };
            reader.readAsDataURL(file);
        }
    }
    
    onSubmit() {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        const formData = new FormData();
        formData.append('name', this.profileForm.value.name);
        formData.append('email', this.profileForm.value.email);
        formData.append('phone', this.profileForm.value.phone);
        formData.append('address', this.profileForm.value.address);
        formData.append('date_of_birth', this.profileForm.value.date_of_birth);
        formData.append('gender', this.profileForm.value.gender);

        // Get the file from the form value
        const avatarFile = this.profileForm.get('avatar')?.value;
        if (avatarFile instanceof File) {
            formData.append('avatar', avatarFile);
        }

        if (this.profileForm.valid) {
            this.http.post<{ avatar?: string }>('http://127.0.0.1:8000/api/user', formData, { headers }).subscribe(response => {
                console.log('User updated:', response);
                this.userData = { ...this.userData, ...this.profileForm.value };
                if (response.avatar) {
                    this.userData.avatar = response.avatar;
                }
                this.isEditing = false;
            });
        }
    }
}
