import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function forbiddenPasswordValidator(forbiddenPassword: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = control.value === forbiddenPassword;
    return forbidden ? { 'forbiddenPassword': { value: control.value } } : null;
  };
}
