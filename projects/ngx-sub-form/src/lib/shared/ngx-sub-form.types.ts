import { FormControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { ArrayPropertyKey, ArrayPropertyValue, ControlForType, FormUpdate, TypedFormGroup } from './ngx-sub-form-utils';

/**
 * @deprecated
 */
export interface OnFormUpdate<FormInterface> {
  /**
   * @deprecated
   */
  onFormUpdate?: (formUpdate: FormUpdate<FormInterface>) => void;
}

type Nullable<T> = T | null;

export type NullableObject<T> = { [P in keyof T]: Nullable<T[P]> };

export type TypedValidatorFn<T> = (control: ControlForType<T>) => ValidationErrors | null;

export type TypedAsyncValidatorFn<T> = (
  control: ControlForType<T>,
) => Promise<ValidationErrors | null> | Observable<ValidationErrors | null>;

export interface TypedAbstractControlOptions<T> {
  /**
   * @description The list of validators applied to a control.
   */
  validators?: TypedValidatorFn<T> | TypedValidatorFn<T>[] | null;
  /**
   * @description The list of async validators applied to control.
   */
  asyncValidators?: TypedAsyncValidatorFn<T> | TypedAsyncValidatorFn<T>[] | null;
  /**
   * @description The event name for control to update upon.
   */
  updateOn?: 'change' | 'blur' | 'submit';
}

/**
 * @deprecated
 */
export type FormGroupOptions<T> = TypedAbstractControlOptions<T>;

// Unfortunately due to https://github.com/microsoft/TypeScript/issues/13995#issuecomment-504664533 the initial value
// cannot be fully type narrowed to the exact type that will be passed.
export interface NgxFormWithArrayControls<T> {
  createFormArrayControl(key: ArrayPropertyKey<T>, value: ArrayPropertyValue<T>): FormControl;
}
