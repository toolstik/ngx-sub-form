import { ControlValueAccessor, FormControl, Validator } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { Nilable } from './helpers';
import {
  ArrayPropertyKey,
  ArrayPropertyValue,
  ControlsNames,
  ControlsType,
  NewFormErrors,
  TypedFormGroup,
} from './shared/ngx-sub-form-utils';
import { TypedAbstractControlOptions } from './shared/ngx-sub-form.types';

export interface ComponentHooks {
  onDestroy: Observable<void>;
  afterViewInit: Observable<void>;
}

export interface FormBindings<ControlInterface> {
  readonly writeValue$: Observable<Nilable<ControlInterface>>;
  readonly registerOnChange$: Observable<(formValue: ControlInterface | null) => void>;
  readonly registerOnTouched$: Observable<() => void>;
  readonly setDisabledState$: Observable<boolean>;
}

export type ControlValueAccessorComponentInstance = Object &
  // ControlValueAccessor methods are called
  // directly by Angular and expects a value
  // so we have to define it within ngx-sub-form
  // and this should *never* be overridden by the component
  Partial<Record<keyof ControlValueAccessor, never> & Record<keyof Validator, never>>;

export interface NgxSubForm<
  ControlInterface,
  FormInterface,
  FormControlsType extends ControlsType<FormInterface> = ControlsType<FormInterface>
> {
  readonly formGroup: TypedFormGroup<FormInterface, FormControlsType>;
  readonly formControlNames: ControlsNames<FormInterface>;
  readonly formGroupErrors: NewFormErrors<FormInterface>;
  readonly createFormArrayControl: CreateFormArrayControlMethod<FormInterface>;
  readonly controlValue$: Observable<Nilable<ControlInterface>>;
}

export type CreateFormArrayControlMethod<FormInterface> = <K extends ArrayPropertyKey<FormInterface>>(
  key: K,
  initialValue: ArrayPropertyValue<FormInterface, K>,
) => FormControl;

export interface NgxRootForm<
  ControlInterface,
  FormInterface,
  FormControlsType extends ControlsType<FormInterface> = ControlsType<FormInterface>
> extends NgxSubForm<ControlInterface, FormInterface, FormControlsType> {
  // @todo: anything else needed here?
}

export interface NgxSubFormArrayOptions<FormInterface> {
  createFormArrayControl?: CreateFormArrayControlMethod<FormInterface>;
}

export interface NgxSubFormRemapOptions<ControlInterface, FormInterface> {
  toFormGroup: (obj: ControlInterface) => FormInterface;
  fromFormGroup: (formValue: FormInterface) => ControlInterface;
}

export type AreTypesSimilar<T, U> = T extends U ? (U extends T ? true : false) : false;

// if the 2 types are the same, instead of hiding the remap options
// we expose them as optional so that it's possible for example to
// override some defaults
type NgxSubFormRemap<ControlInterface, FormInterface> = AreTypesSimilar<ControlInterface, FormInterface> extends true // we expose them
  ? Partial<NgxSubFormRemapOptions<ControlInterface, FormInterface>>
  : NgxSubFormRemapOptions<ControlInterface, FormInterface>;

type NgxSubFormArray<FormInterface> = ArrayPropertyKey<FormInterface> extends never
  ? {} // no point defining `createFormArrayControl` if there's not a single array in the `FormInterface`
  : NgxSubFormArrayOptions<FormInterface>;

export type NgxAbstractFormOptions<
  FType extends FormType,
  ControlInterface,
  FormInterface = ControlInterface,
  FormControlsType extends ControlsType<FormInterface> = ControlsType<FormInterface>
> = {
  formType: FType;
  formControls: FormControlsType;
  formGroupOptions?: TypedAbstractControlOptions<FormInterface>;
  emitNullOnDestroy?: boolean;
  componentHooks?: ComponentHooks;
  // emit on this observable to mark the control as touched
  touched$?: Observable<void>;
} & NgxSubFormRemap<ControlInterface, FormInterface> &
  NgxSubFormArray<FormInterface>;

export type NgxSubFormOptions<
  ControlInterface,
  FormInterface = ControlInterface,
  FormControlsType extends ControlsType<FormInterface> = ControlsType<FormInterface>
> = NgxAbstractFormOptions<FormType.SUB, ControlInterface, FormInterface, FormControlsType>;

export type NgxRootFormOptions<
  ControlInterface,
  FormInterface = ControlInterface,
  FormControlsType extends ControlsType<FormInterface> = ControlsType<FormInterface>
> = NgxAbstractFormOptions<FormType.ROOT, ControlInterface, FormInterface, FormControlsType> & {
  input$: Observable<ControlInterface | undefined>;
  output$: Subject<ControlInterface>;
  disabled$?: Observable<boolean>;
  // by default, a root form is considered as an automatic root form
  // if you want to transform it into a manual root form, provide the
  // following observable which trigger a save every time a value is emitted
  manualSave$?: Observable<void>;
  // The default behavior is to compare the current transformed value of input$ with the current value of the form, and
  // if these are equal emission on output$ is suppressed to prevent the from broadcasting the current value.
  // Configure this option to provide your own custom predicate whether or not the form should emit.
  outputFilterPredicate?: (currentInputValue: FormInterface, outputValue: FormInterface) => boolean;
  // if you want to control how frequently the form emits on the output$, you can customise the emission rate with this
  // option. e.g. `handleEmissionRate: formValue$ => formValue$.pipe(debounceTime(300)),`
  handleEmissionRate?: (obs$: Observable<FormInterface>) => Observable<FormInterface>;
};

export enum FormType {
  SUB = 'Sub',
  ROOT = 'Root',
}

export type NgxFormOptions<
  ControlInterface,
  FormInterface,
  FormControlsType extends ControlsType<FormInterface> = ControlsType<FormInterface>
> =
  | NgxSubFormOptions<ControlInterface, FormInterface, FormControlsType>
  | NgxRootFormOptions<ControlInterface, FormInterface, FormControlsType>;
