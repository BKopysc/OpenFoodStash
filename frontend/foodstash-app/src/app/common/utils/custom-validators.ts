import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';

export function passwordStrengthValidator(): ValidatorFn {

  return (control:AbstractControl): ValidationErrors | null => {

    const value = control.value;

    if(!value){
      return null;
    }

    const hasUpperCase = /[A-Z]+/.test(value);
    const hasLowerCase = /[a-z]+/.test(value);
    const hasNumeric = /[0-9]+/.test(value);
    const hasSpecialSymbol =/[!@#$%^&*]+/.test(value);
    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialSymbol;

    return !passwordValid ? {passwordStrength: true} : null;

  }

}

export function notMatchValidator(matchValue: string): ValidatorFn{
  return (control:AbstractControl): ValidationErrors | null => {

    const value = control.value;

    return value == matchValue ? {notMatch: true} : null;

  }

}

export function matchValidator(
  matchTo: string,
  reverse?: boolean
): ValidatorFn {
  return (control: AbstractControl):
    ValidationErrors | null => {
    if (control.parent && reverse) {
      const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
      if (c) {
        c.updateValueAndValidity();
      }
      return null;
    }
    return !!control.parent &&
    !!control.parent.value &&
    control.value ===
    (control.parent?.controls as any)[matchTo].value
      ? null
      : { matching: true };
  };
}

// export function freshScoreConditionalValidator(formControl: AbstractControl) {
//
//   if(!formControl.parent){
//     console.log("too? null parent")
//     return null;
//   }
//
//   if(formControl.parent.get('autoPredict')?.value === false) {
//     console.log('null dla fresh')
//     return Validators.nullValidator;
//
//   } else if(formControl.parent.get('autoPredict')?.value === true) {
//     console.log('fresh is required');
//     return Validators.required(formControl);
//   }
//
//   console.log("koniec null")
//   return null;
// }
//
// export function expirationDateConditionalValidator(formControl: AbstractControl) {
//
//   if(!formControl.parent){
//     return null;
//   }
//
//   if(formControl.parent.get('autoPredict')?.value === true) {
//     console.log("null dla date");
//     return Validators.nullValidator;
//
//   } else if(formControl.parent.get('autoPredict')?.value === false) {
//     console.log('date is required');
//     return Validators.required(formControl);
//   }
//   return null;
// }

export function requiredIfValidator(predicate: () => any) {
  return ((formControl: AbstractControl<any, any>) => {
    if (!formControl.parent) {
      return null;
    }
    if (predicate()) {
      return Validators.required(formControl);
    }
    return null;
  })
}
