import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';



@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule, CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {

  events: any[] = [];
  eventDate!: string;
  event?: any;

  constructor(private userService: UserService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserEvents();
  }

  loadUserEvents() {
      this.authService.currentUser$.subscribe(user => {
        if (user) {
          this.userService.getUserEvents(user.id).subscribe({
            next: (response) => {
              this.events = response.data.map((event: any) => ({
                title: event.title,
                start: event.event_date.split('T')[0],
                end: event.event_date.split('T')[0],
                extendedProps: {
                  id: event.id,
                  description: event.description,
                  location: event.location,
                  photo: event.photo,
                  start_time: event.start_time,
                  end_time: event.end_time
                }
              }));
              this.calendarOptions.events = this.events;
            }
          });
        }
      });
    }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin],
    dateClick:  this.handleDateClick.bind(this),
    eventClick:  this.handleEventClick.bind(this),

    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek',
    },
    weekends: true,
    editable: true,
    selectable: true,
    eventStartEditable: false,
    eventDurationEditable: false
  };

  handleDateClick(date:any) {
    this.eventDate = date.dateStr;
    console.log(this.eventDate)
  }

  handleEventClick(arg:any)  {
    const eventId = arg.event.extendedProps.id;
    this.router.navigate([`/events/${eventId}`]);
  }

}
