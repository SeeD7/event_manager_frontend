import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, map, Observable, tap } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { confirmEqualValidator } from '../../../shared/validators/confirm-equal.validator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { AsyncPipe, CommonModule } from '@angular/common';
import { User } from '../../../core/models/user.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatProgressSpinner, AsyncPipe, CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private usersService = inject(UsersService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  mainForm!: FormGroup;
  personalInfoForm!: FormGroup;

  emailCtrl!: FormControl;
  confirmEmailCtrl!: FormControl;
  emailForm!: FormGroup;

  passwordCtrl!: FormControl;
  confirmPasswordCtrl!: FormControl;
  loginInfoForm!: FormGroup;

  showEmailCtrl$!: Observable<boolean>;
  showPhoneCtrl$!: Observable<boolean>;

  showEmailError$!: Observable<boolean>;
  showPasswordError$!: Observable<boolean>;

  loading = false;

  ngOnInit(): void {
    this.initFormControls();
    this.initMainForm();
    this.initFormObservables();
    this.emailCtrl.valueChanges
    .pipe(debounceTime(500)) // Wait 500ms after last input
    .subscribe((value: string) => {
      if (this?.emailCtrl?.valid && this?.emailCtrl?.dirty) {
        this.usersService.checkEmail(value).subscribe(data => {
          if(data === true) {
            const currentErrors = this.emailCtrl.errors || {};
            this.emailCtrl.setErrors({
              ...currentErrors,
              emailExists: true
            });
          }
        })
      }
    });
    this.loginInfoForm.get('username')?.valueChanges
    .pipe(debounceTime(500)) // Wait 500ms after last input
    .subscribe((value: string) => {
      if (this.loginInfoForm.get('username')?.valid && this.loginInfoForm.get('username')?.dirty) {
        this.usersService.checkUsername(value).subscribe(data => {
          if(data === true) {
            const currentErrors = this.loginInfoForm.get('username')?.errors || {};
            this.loginInfoForm.get('username')?.setErrors({
              ...currentErrors,
              userExists: true
            });
          }
        })
      }
    });
  }

  private initMainForm(): void {
    this.mainForm = this.formBuilder.group({
      personalInfo: this.personalInfoForm,
      email: this.emailForm,
      loginInfo: this.loginInfoForm,
    });
  }

  private initFormControls(): void {
    this.personalInfoForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });

    this.emailCtrl = this.formBuilder.control('', [Validators.required, Validators.email]);
    this.confirmEmailCtrl = this.formBuilder.control('', [Validators.required, Validators.email]);

    this.emailForm = this.formBuilder.group({
      email: this.emailCtrl,
      confirm: this.confirmEmailCtrl,
    }, {
      validators: [confirmEqualValidator('email', 'confirm')],
      updateOn: 'blur'
    });

    this.passwordCtrl = this.formBuilder.control('', Validators.required);
    this.confirmPasswordCtrl = this.formBuilder.control('', Validators.required);
    this.loginInfoForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: this.passwordCtrl,
      confirmPassword: this.confirmPasswordCtrl,
    }, {
      validators: [confirmEqualValidator('password', 'confirmPassword')],
      updateOn: 'blur'
    });
  }

  private initFormObservables() {
    this.showEmailError$ = this.emailForm.statusChanges.pipe(
      map(status => status === 'INVALID' && this.emailCtrl.value && this.confirmEmailCtrl.value && this.emailForm.hasError('confirmEqual'))
    );
    this.showPasswordError$ = this.loginInfoForm.statusChanges.pipe(
      map(status => status === 'INVALID' && this.passwordCtrl.value && this.confirmPasswordCtrl.value && this.loginInfoForm.hasError('confirmEqual'))
    );
  }

  getFormControlErrorText(ctrl: AbstractControl) {
    console.log(ctrl.errors);
    if (ctrl.hasError('required')) {
      return 'Ce champ est requis';
    } else if (ctrl.hasError('email')) {
      return "Merci d'entrer une adresse mail valide";
    } else if (ctrl.hasError('emailExists')) {
      return "L'email est déjà utilisé";
    } else if (ctrl.hasError('userExists')) {
      return "Le nom d'utilisateur est déjà utilisé";
    } else {
      return 'Ce champ contient une erreur';
    }
  }

  onSubmitForm() {
    this.loading = true;
    const user = new User();

    user.firstName = this.personalInfoForm.get('firstName')?.value;
    user.lastName = this.personalInfoForm.get('lastName')?.value;
    user.username = this.loginInfoForm.get('username')?.value;
    user.role = "USER";
    user.email = this.emailCtrl.value;
    user.password = this.passwordCtrl.value;
    
    this.usersService
      .createUser(user)
      .pipe(
        tap((saved) => {
          this.loading = false;
          if (saved) {
            this.mainForm.reset();
            this.toastr.success('Inscription réussie ! Bienvenue !', 'Success');
            this.router.navigateByUrl('/event-manager/auth/login');
          } else {
            this.toastr.error('Echec de l\'inscription.', 'Error');
          }
        }),
      ).subscribe();
  }
}
