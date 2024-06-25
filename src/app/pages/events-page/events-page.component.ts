import { Component } from '@angular/core';
import { EventSectionComponent } from "../../components/event-section/event-section.component";

@Component({
    selector: 'app-events-page',
    standalone: true,
    templateUrl: './events-page.component.html',
    styleUrl: './events-page.component.css',
    imports: [EventSectionComponent]
})
export class EventsPageComponent {

}
