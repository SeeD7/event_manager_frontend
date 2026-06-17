import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { environment } from '../../../../../environments/environment';
import { map, Observable } from 'rxjs';
import { confirmEqualValidator } from '../../../../shared/validators/confirm-equal.validator';
import { AsyncPipe } from '@angular/common';


@Component({
  selector: 'app-change-password-modal',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatFormFieldModule, MatInputModule, AsyncPipe],
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.scss',
})
export class ChangePasswordModalComponent implements OnInit {

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ChangePasswordModalComponent>);

  passwordCtrl!: FormControl;
  confirmPasswordCtrl!: FormControl;

  showPasswordError$!: Observable<boolean>;

  form!: FormGroup;

  ngOnInit(): void {
    this.passwordCtrl = this.fb.control('', [Validators.required, Validators.pattern(environment.passwordRegex)]);
    this.confirmPasswordCtrl = this.fb.control('', Validators.required);

    this.form = this.fb.group({
      password: this.passwordCtrl,
      confirmPassword: this.confirmPasswordCtrl
    }, {
      validators: [confirmEqualValidator('password', 'confirmPassword')],
      updateOn: 'blur'
    });

    this.showPasswordError$ = this.form.statusChanges.pipe(
      map(status => status === 'INVALID' && this.passwordCtrl.value && this.confirmPasswordCtrl.value && this.form.hasError('confirmEqual'))
    );
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;

    return password === confirm ? null : { passwordMismatch: true };
  }

  validate() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.password);
    } else {
      this.form.markAllAsTouched();
    }
  }  

  cancel() {
    this.dialogRef.close();
  }
}