import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RemoteError } from '../model/remote-error';
import * as _ from 'lodash';

@Injectable()
export class ErrorService {

    displayValidationErrors(errors: any, frmForm: FormGroup, formErrors: any, onsubmit: boolean) {
      if (!frmForm) { return; }
      const form = frmForm;
      for (const field in formErrors) {
        formErrors[field] = '';
        const control = form.get(field);
        if (control && (control.dirty || onsubmit) && !control.valid) {
          const messages = errors[field];
          for (const key in control.errors) {
            formErrors[field] += messages[key] + ' ';
          }
        }
	  }
      return formErrors;
    }
    displayRemoteErrors(errors: Array<RemoteError>, formErrors: any) {
      for (const field in formErrors) {
        formErrors[field] = '';
      }
      if (errors) {
          errors.forEach((errorMessageObj: any) => {
            formErrors[_.camelCase(errorMessageObj.field)] = errorMessageObj.message;
          });
      }
      return formErrors;
    }
}
