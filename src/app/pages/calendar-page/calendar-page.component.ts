import { Component } from '@angular/core';
import { CalendarComponent } from "../../components/calendar/calendar.component";

@Component({
    selector: 'app-calendar-page',
    standalone: true,
    templateUrl: './calendar-page.component.html',
    styleUrl: './calendar-page.component.css',
    imports: [CalendarComponent]
})
export class CalendarPageComponent {

}
