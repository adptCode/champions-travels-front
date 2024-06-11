import { Component } from '@angular/core';
import { RegisterFormComponent } from "../../components/register-form/register-form.component";

@Component({
    selector: 'app-register-page',
    standalone: true,
    templateUrl: './register-page.component.html',
    styleUrl: './register-page.component.css',
    imports: [RegisterFormComponent]
})
export class RegisterPageComponent {

}
