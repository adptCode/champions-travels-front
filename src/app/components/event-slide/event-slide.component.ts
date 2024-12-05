import { Component, OnInit } from '@angular/core';
import { Event } from '../../models/event'
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EventService } from '../../services/event.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-event-slide',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-slide.component.html',
  styleUrl: './event-slide.component.css'
})
export class EventSlideComponent implements OnInit{

  public readonly baseUrl = environment.apiUrl;

  events: Event[] = [];
  isAuthenticated: boolean = false;
  defaultEventPictureUrl: string = '/assets/default-event.png';

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: response => {
        this.events = response.data;
      },
      error: err => {
        console.error('Error loading events', err);
      }
    });
  }

  navigateToEvent(eventId: number): void {
    if (this.isAuthenticated) {
      this.router.navigate(['/events', eventId]);
    } else {
      localStorage.setItem('redirectUrl', `/events/${eventId}`);
      this.router.navigate(['/login']);
    }
  }

}
