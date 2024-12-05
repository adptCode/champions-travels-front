import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Event } from '../../../models/event';
// import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-event-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-event-list.component.html',
  styleUrl: './admin-event-list.component.css'
})
export class AdminEventListComponent implements OnInit {

  // public readonly baseUrl = environment.apiUrl;

  events: Event[] = [];
  defaultEventPictureUrl: string = '/assets/facebookanonimo.jpg';

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getEvents().subscribe(data => {
      console.log(data)
      this.events = data.data;
    });
  }

  deleteEvent(id: number) {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(id).subscribe(() => {
        this.loadEvents();
      });
    }
  }

}
