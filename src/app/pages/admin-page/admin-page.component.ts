import { Component } from '@angular/core';
import { AdminSectionComponent } from "../../components/admin-section/admin-section.component";

@Component({
    selector: 'app-admin-page',
    standalone: true,
    templateUrl: './admin-page.component.html',
    styleUrl: './admin-page.component.css',
    imports: [AdminSectionComponent]
})
export class AdminPageComponent {

}
