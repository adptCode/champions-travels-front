import { Component } from '@angular/core';
import { ProfileFormComponent } from "../../components/profile-form/profile-form.component";

@Component({
    selector: 'app-profile-page',
    standalone: true,
    templateUrl: './profile-page.component.html',
    styleUrl: './profile-page.component.css',
    imports: [ProfileFormComponent]
})
export class ProfilePageComponent {

}
