import {Form, FormArray, FormGroup} from '@angular/forms';

export class CustomFormErrorHandling{
  private form: FormGroup;

  constructor(form: FormGroup) {
    this.form = form;
  }

  errorHandling(control: string, error: string){
    //console.log(control + " " + error + " : " + this.signUpForm.controls[control].hasError(error));
    return this.form.controls[control].hasError(error);
  }

   getLenValidator(control: string, type: 'minlength' | 'maxlength'): string {
     return this.form.controls[control].getError(type)['requiredLength'] || '';
  }
}

