import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { CommonModule } from '@angular/common';
import { Event } from '../../../models/event';

@Component({
  selector: 'app-admin-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-event-form.component.html',
  styleUrl: './admin-event-form.component.css'
})
export class AdminEventFormComponent {


eventForm: FormGroup;
eventId: number | null = null;
event: Partial<Event> = {};
eventPictureUrl!: string | null;
defaultEventPictureUrl = '/assets/facebookanonimo.jpg';
selectedFile: File | null = null;
message: string = '';
alertType: string = '';

constructor(
  private fb: FormBuilder,
  private eventService: EventService,
  private router: Router,
  private route: ActivatedRoute
) {
  this.eventForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    event_date: ['', Validators.required],
    start_time: ['', Validators.required],
    end_time: ['', Validators.required],
    location: ['', Validators.required],
  });
  this.eventPictureUrl = this.defaultEventPictureUrl;
}

ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    if (id) {
      this.eventId = +id;
      this.loadEvent(this.eventId);
    }
  });
}

loadEvent(id: number) {
  this.eventService.getEventById(id).subscribe(data => {
    console.log(data);
    this.event = data.data;
    if (this.event.event_date) {
      this.event.event_date = this.formatDate(this.event.event_date);
    }
    //this.event.event_date = this.formatDate(this.event.event_date)
    this.eventForm.patchValue(this.event);
    if(this.event.photo) {
      this.eventPictureUrl = `http://localhost:3000/uploads-event/${this.event.photo}`
    } else {
      this.eventPictureUrl = this.defaultEventPictureUrl;
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

hasErrors(field:string, errorType: string) {
  return this.eventForm.get(field)?.hasError(errorType) && this.eventForm.get(field)?.touched;
}

onFileChange(event: any) {
  this.selectedFile = event.target.files[0];
  if (this.selectedFile) {
    this.eventForm.patchValue({ photo: this.selectedFile });
  }
}

onUpload() {
  if (!this.selectedFile) {
    this.message = 'Please select a file to upload';
    this.alertType = 'warning';
    return;
  }

  const formData = new FormData();
  formData.append('photo', this.selectedFile);

  if (this.eventId) {
    this.eventService.uploadPhoto(this.eventId, formData).subscribe({
      next: (response) => {
        if (response.data && response.data.photo) {
          this.eventPictureUrl = `http://localhost:3000/uploads-event/${response.data.photo}`;
        } else {
          this.eventPictureUrl = '/assets/facebookanonimo.jpg';
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
}

deletePhoto() {
  if (this.eventId) {
    this.eventService.deletePhoto(this.eventId).subscribe({
      next: () => {
        this.message = 'Photo deleted successfully';
        this.alertType = 'success';
        this.eventPictureUrl = '/assets/facebookanonimo.jpg';
      },
      error: (error) => {
        this.message = 'Error deleting photo';
        this.alertType = 'danger';
        console.error('Error deleting photo', error);
      }
    });
  }
}

closeAlert() {
  this.message = '';
  this.alertType = '';
}

submitForm() {
  if(this.eventForm.invalid) {
    this.eventForm.markAllAsTouched();
    return;
  }

  const eventData: Partial<Event> = this.eventForm.value;

  if (this.eventId) {
    this.eventService.updateEvent(this.eventId, eventData).subscribe({
      next: () => this.router.navigate(['/admin/events']),
      error: (error) => {
        this.message = 'Error updating event';
        this.alertType = 'danger';
        console.error('Error updating event', error);
      }
    });
  } else {
    this.eventService.addEvent(eventData).subscribe({
      next: () => this.router.navigate(['/admin/events']),
      error: (error) => {
        this.message = 'Error creating event';
        this.alertType = 'danger';
        console.error('Error creating event', error);
      }
    });
  }
}
}
