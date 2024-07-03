import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { minimumAgeValidator } from '../../validators/age-validator';
import { forbiddenPasswordValidator } from '../../validators/password-validator';
import { passwordMatchValidator } from '../../validators/password-match.validator';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent {
  registerForm!: FormGroup;
  message: string = '';
  alertType: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      first_name: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-zÀ-ÿÑñ\s]+$/),
          Validators.minLength(3),
        ],
      ],
      last_name: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-zÀ-ÿÑñ\s]+$/),
          Validators.minLength(3),
        ],
      ],
      birth_date: ['', [Validators.required, minimumAgeValidator(18)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          forbiddenPasswordValidator('123456'),
        ],
      ],
      confirm_password: ['', [Validators.required, Validators.minLength(5), passwordMatchValidator('password')]]
    });
  }

  hasErrors(field: string, typeError: string) {
    return (
      this.registerForm.get(field)?.hasError(typeError) &&
      this.registerForm.get(field)?.touched
    );
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.message = 'User registered successfully';
          this.alertType = 'success';
          console.log('User registered successfully', response);
          //this.router.navigate(['/login']);
          this.registerForm.reset();
        },
        error: (error) => {
          this.message = 'Registration error';
          this.alertType = 'danger';
          console.error('Registration error', error);
          if (error.error && error.error.errors) {
            error.error.errors.forEach((err: any) => {
              this.message += ` - Error in ${err.path}: ${err.msg}`;
              console.error(`Error in ${err.path}: ${err.msg}`);
            });
          }
        },
      });

  }

  closeAlert() {
    if (this.alertType === 'success') {
      this.router.navigate(['/login']);
    }
    this.message = '';
    this.alertType = '';
  }
}
