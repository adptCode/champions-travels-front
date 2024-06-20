import { Component } from '@angular/core';
import { AdminEventListComponent } from "../../components/admin/admin-event-list/admin-event-list.component";


@Component({
    selector: 'app-admin-page',
    standalone: true,
    templateUrl: './admin-page.component.html',
    styleUrl: './admin-page.component.css',
    imports: [AdminEventListComponent]
})
export class AdminPageComponent {

}
