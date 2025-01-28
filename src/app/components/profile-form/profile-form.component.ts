import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { minimumAgeValidator } from '../../validators/age-validator';
import { CountryService } from '../../services/country.service';
import { User } from '../../models/user';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.css'
})
export class ProfileFormComponent {

  private baseUrl = `${environment.apiUrl}`;

  profileForm!: FormGroup;
  message: string = '';
  alertType: string = '';
  selectedFile: File | null = null;
  user: User | null = null;
  profilePictureUrl!: string | undefined;
  countries: any[] = [];
  newTeam: string = '';
  teams: string[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private countryService: CountryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÿÑñ\s]+$/),
        Validators.minLength(3)]],
      last_name: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÿÑñ\s]+$/),
        Validators.minLength(3)]],
      birth_date: ['', [Validators.required, minimumAgeValidator(18)]],
      city: ['', Validators.pattern(/^[A-Za-zÀ-ÿÑñ\s]+$/)],
      country: [''],
      preferences: ['']
    });

    this.loadUser();
    this.loadCountries()
  }

  loadUser() {
    this.userService.getUser().subscribe({
      next: (response) => {
        console.log('Respuesta getUser:', response);
        this.user = response.data;
        this.user.birth_date = this.formatDate(this.user.birth_date);
        this.profileForm.patchValue(this.user)
        console.log(response);
        if(this.user.profile_picture) {
          this.profilePictureUrl = response.data.profile_picture;
          //this.profilePictureUrl = `${this.user.profile_picture}?t=${new Date().getTime()}`;
        } else {
          this.profilePictureUrl = '/assets/facebookanonimo.jpg';
        }
        this.teams = this.user.preferences || [];
      },
      error: (error) => {
        console.error('Error loading user data', error);
      }
    });
  }

  loadCountries() {
    this.countryService.getCountries().subscribe({
      next: (response) => {
        this.countries = response.map((country: any) => ({
          name: country.name.common,
          code: country.cca2
        })).sort((a: any, b: any) => a.name.localeCompare(b.name));
      },
      error: (error) => {
        console.error('Error loading countries', error);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
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
        console.log('Respuesta del backend:', response); // DEBUG
        if (response.data && response.data.profile_picture) {
          this.profilePictureUrl = response.data.profile_picture;
          // this.profilePictureUrl = `${response.data.profile_picture}?t=${new Date().getTime()}`;
        } else {
          this.profilePictureUrl = '/assets/facebookanonimo.jpg';
        }
        this.message = 'Photo uploaded successfully';
        this.alertType = 'success';
        this.selectedFile = null;
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
        this.profilePictureUrl = '/assets/facebookanonimo.jpg';
      },
      error: (error) => {
        this.message = 'Error deleting photo';
        this.alertType = 'danger';
        console.error('Error deleting photo', error);
      }
    });
  }

  addTeam() {
    if (this.newTeam.trim()) {
      this.userService.addPreference(this.newTeam.trim()).subscribe({
        next: (response) => {
          this.teams.push(this.newTeam.trim());
          this.newTeam = '';
        },
        error: (error) => {
          console.error('Error adding team', error);
        }
      });
    }
  }

  removeTeam(team: string) {
    this.userService.removePreference(team).subscribe({
      next: (response) => {
        this.teams = this.teams.filter(t => t !== team);
      },
      error: (error) => {
        console.error('Error removing team', error);
      }
    });
  }

}
