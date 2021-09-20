import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  createFormArray,
  formBuilder,
  FormType,
  subformComponentProviders,
  TypedFormControl,
} from 'ngx-sub-form';
import { CrewMember } from '../../../../../interfaces/crew-member.interface';

interface CrewMembersForm {
  crewMembers: CrewMember[];
}

@Component({
  selector: 'app-crew-members',
  templateUrl: './crew-members.component.html',
  styleUrls: ['./crew-members.component.scss'],
  providers: subformComponentProviders(CrewMembersComponent),
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrewMembersComponent {
  public form = formBuilder<CrewMember[], CrewMembersForm>().create(this, {
    formType: FormType.SUB,
    formControls: {
      crewMembers: createFormArray([] as TypedFormControl<CrewMember>[]),
    },
    toFormGroup: (obj: CrewMember[]): CrewMembersForm => {
      return {
        crewMembers: !obj ? [] : obj,
      };
    },
    fromFormGroup: (formValue: CrewMembersForm): CrewMember[] => {
      return formValue.crewMembers;
    },
    createFormArrayControl: (key, value) => {
      switch (key) {
        case 'crewMembers':
          return new FormControl(value, [Validators.required]);
        default:
          return new FormControl(value);
      }
    },
  });

  public removeCrewMember(index: number): void {
    this.form.formGroup.controls.crewMembers.removeAt(index);
  }

  public addCrewMember(): void {
    this.form.formGroup.controls.crewMembers.push(
      this.form.createFormArrayControl('crewMembers', {
        firstName: '',
        lastName: '',
      }),
    );
  }
}
