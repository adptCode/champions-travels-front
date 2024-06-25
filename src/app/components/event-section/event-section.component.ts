import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-event-section',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './event-section.component.html',
  styleUrl: './event-section.component.css',
  providers: [DatePipe]
})
export class EventSectionComponent implements OnInit{

  events: any[] = [];

  constructor(private eventService: EventService, private datePipe: DatePipe) {}


  ngOnInit(): void {
    this.loadEvents()
  }

  loadEvents() {
    this.eventService.getEvents().subscribe(data => {
      console.log(data);
      this.events = data.data.sort((a: any, b: any) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
    })
  }
}
