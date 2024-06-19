import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forbiddenPasswordValidator } from '../../validators/password-validator';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  loginForm!: FormGroup;
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(5)
        ],
      ],
    });
  }

  hasErrors(field:string, errorType:string) {
    return this.loginForm.get(field)?.hasError(errorType) && this.loginForm.get(field)?.touched
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: response => {
        console.log('Login successful', response);
      },
      error: error => {
        console.error('Login error', error);
        this.message = 'Login error';
          if (error.error && error.error.errors) {
            error.error.errors.forEach((err: any) => {
              this.message += ` - ${err.message}`;
            });
          }
      }
    });
  }

  closeAlert() {
    this.message = '';
  }
}

