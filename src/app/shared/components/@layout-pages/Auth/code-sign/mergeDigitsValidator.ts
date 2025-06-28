import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function mergeDigitsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const digit1 = control.get('digit1')?.value || '';
    const digit2 = control.get('digit2')?.value || '';
    const digit3 = control.get('digit3')?.value || '';
    const digit4 = control.get('digit4')?.value || '';
    const digit5 = control.get('digit5')?.value || '';
    const digit6 = control.get('digit6')?.value || '';
    const mergedValue = `${digit1}${digit2}${digit3}${digit4}${digit5}${digit6}`;

    // Validate the merged value here if needed
    // For example, you can check if the merged value meets certain criteria

    // Return null if the merged value is valid, otherwise return a validation error
    return null; // Replace with your validation logic
  };
}
