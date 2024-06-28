import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventService } from '../../services/event.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Event, EventParticipation } from '../../models/event';
import { User } from '../../models/user';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent implements OnInit {

  event: Event | null = null;
  participants: EventParticipation[] = [];
  message: string = '';
  isParticipating: boolean = false;
  currentUser: User | null = null;
  modal:boolean = false;


  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: user => {
        this.currentUser = user;
        this.route.params.subscribe(params => {
          const eventId = params['id'];
          this.loadEvent(eventId);
          this.loadParticipants(eventId);
        });
      },
      error: err => {
        console.error('Error loading current user', err);
      }
    });
  }

  loadEvent(id: number) {
    this.eventService.getEventById(id).subscribe({
      next: data => {
        this.event = data.data;
      },
      error: err => {
        console.error('Error loading event', err);
      }
    });
  }

  loadParticipants(id: number) {
    this.eventService.getParticipants(id).subscribe({
      next: data => {
        this.participants = data.data;
        console.log(this.participants)
        if (this.currentUser && this.currentUser.id) {
          this.isParticipating = this.participants.some(participant => participant.id === this.currentUser!.id);
        }
      },
      error: err => {
        console.error('Error loading participants', err);
      }
    });
  }


  participate() {

    if(this.event) {
      this.eventService.participate(this.event.id).subscribe({
        next: () => {
          this.loadParticipants(this.event!.id);
          this.isParticipating = true;
          this.message = 'Successfully registered for the event.';
        },
        error: err => {
          console.error('Error participating in event', err);
          this.message = 'Error registering for the event.';
        }
      });

    }


  }

  leave() {

    if(this.event) {
      this.eventService.leaveEvent(this.event.id).subscribe({
        next: () => {
          this.loadParticipants(this.event!.id);
          this.isParticipating = false;
          this.message = 'Successfully unregistered from the event.';
        },
        error: err => {
          console.error('Error leaving event', err);
          this.message = 'Error unregistering from the event.';
        }
      });
    }

  }

  openParticipantsModal() {
    this.modal = true;

  }

  closeModal() {
    this.modal = false;
  }


}
