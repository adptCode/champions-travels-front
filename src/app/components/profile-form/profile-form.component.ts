import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.css'
})
export class ProfileFormComponent {

  profileForm!: FormGroup;
  message: string = '';
  alertType: string = '';
  selectedFile: File | null = null;
  user: any = {};
  profilePictureUrl!: string | null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      birth_date: ['', [Validators.required]],
      city: [''],
      country: [''],
      preferences: ['']
    });

    this.loadUser();
  }

  loadUser() {
    this.userService.getUser().subscribe({
      next: (response) => {
        this.user = response.data;
        this.profileForm.patchValue(this.user);
        console.log(response);
        if(this.user.profile_picture) {
          this.profilePictureUrl = this.user.profile_picture
        } else {
          this.profilePictureUrl = '/assets/facebookanonimo.jpg';
        }

      },
      error: (error) => {
        console.error('Error loading user data', error);
      }
    });
  }

  hasErrors(field:string, errorType:string) {
    return this.profileForm.get(field)?.hasError(errorType) &&
    this.profileForm.get(field)?.touched
  }

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.userService.updateUser(this.profileForm.value).subscribe({
      next: (response) => {
        this.message = 'Profile updated successfully';
        this.alertType = 'success';
      },
      error: (error) => {
        this.message = 'Error updating profile';
        this.alertType = 'danger';
        console.error('Error updating profile', error);
        if (error.error && error.error.errors) {
          error.error.errors.forEach((err: any) => {
            this.message += ` - Error in ${err.path}: ${err.msg}`;
            console.error(`Error in ${err.path}: ${err.msg}`);
          });
        }
      }
    });
  }

  onUpload() {
    if (!this.selectedFile) {
      this.message = 'Please select a file to upload';
      this.alertType = 'warning';
      return;
    }

    this.userService.uploadPhoto(this.selectedFile).subscribe({
      next: (response) => {
        if (response.data && response.data.profile_picture) {
          this.profilePictureUrl = `http://localhost:3000/uploads/${response.data.profile_picture}`;
        } else {
          this.profilePictureUrl = '/assets/facebookanonimo.jpg'; // Default picture if upload fails
        }
        this.message = 'Photo uploaded successfully';
        this.alertType = 'success';
        this.selectedFile = null; // Reset the selected file
      },
      error: (error) => {
        this.message = 'Error uploading photo';
        this.alertType = 'danger';
        console.error('Error uploading photo', error);
      }
    });
  }

  closeAlert() {
    this.message = '';
    this.alertType = '';
  }

  deletePhoto() {
    this.userService.deletePhoto().subscribe({
      next: (response) => {
        this.message = 'Photo deleted successfully';
        this.alertType = 'success';
        this.profilePictureUrl = '/assets/facebookanonimo.jpg'; // Set a default profile picture
      },
      error: (error) => {
        this.message = 'Error deleting photo';
        this.alertType = 'danger';
        console.error('Error deleting photo', error);
      }
    });
  }

}
