import { Component, inject, input, OnInit, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { debounceTime, filter, map, Observable, switchMap } from 'rxjs';
import { confirmEqualValidator } from '../../../shared/validators/confirm-equal.validator';
import { User } from '../../../core/models/user.model';
import { RoleEnum } from '../../../core/models/role.enum';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, AsyncPipe, CommonModule],
  templateUrl: './user-form-component.html',
  styleUrl: './user-form-component.scss',
})
export class UserFormComponent  implements OnInit {
  private formBuilder = inject(FormBuilder);
  private usersService = inject(UsersService);

  user = input<User>(new User);
  editProfile = input<boolean>(false);
  submitForm = output<User>();

  mainForm!: FormGroup;
  personalInfoForm!: FormGroup;

  emailCtrl!: FormControl;
  confirmEmailCtrl!: FormControl;
  emailForm!: FormGroup;

  usernameCtrl!: FormControl;
  passwordCtrl!: FormControl;
  confirmPasswordCtrl!: FormControl;
  loginInfoForm!: FormGroup;

  showEmailCtrl$!: Observable<boolean>;
  showPhoneCtrl$!: Observable<boolean>;

  showEmailError$!: Observable<boolean>;
  showPasswordError$!: Observable<boolean>;

  ngOnInit(): void {
    this.initFormControls();
    this.initMainForm();
    this.initFormObservables();
    this.setupAsyncValidator(this.emailCtrl, value => this.usersService.checkEmail(value), 'emailExists', this.user().email);
    this.setupAsyncValidator(this.loginInfoForm.get('username')!, value => this.usersService.checkUsername(value), 'userExists', this.user().username);
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
      firstName: [this.editProfile() ? this.user().firstName : '', Validators.required],
      lastName: [this.editProfile() ? this.user().lastName : '', Validators.required],
    });

    this.emailCtrl = this.formBuilder.control(this.editProfile() ? this.user().email : '', [Validators.required, Validators.email]);
    this.confirmEmailCtrl = this.formBuilder.control(this.editProfile() ? this.user().email : '', [Validators.required, Validators.email]);

    this.emailForm = this.formBuilder.group({
      email: this.emailCtrl,
      confirm: this.confirmEmailCtrl,
    }, {
      validators: [confirmEqualValidator('email', 'confirm')],
      updateOn: 'blur'
    });

    this.usernameCtrl = this.formBuilder.control(this.editProfile() ? this.user().username : '', Validators.required);

    if(this.editProfile()){
      this.loginInfoForm = this.formBuilder.group({username: this.usernameCtrl});
    } else {
      this.passwordCtrl = this.formBuilder.control('', Validators.required);
      this.confirmPasswordCtrl = this.formBuilder.control('', Validators.required);
      this.loginInfoForm = this.formBuilder.group({
        username: this.usernameCtrl,
        password: this.passwordCtrl,
        confirmPassword: this.confirmPasswordCtrl,
      }, {
        validators: [confirmEqualValidator('password', 'confirmPassword')],
        updateOn: 'blur'
      });
    }
  }

  private initFormObservables() {
    this.showEmailError$ = this.emailForm.statusChanges.pipe(
      map(status => status === 'INVALID' && this.emailCtrl.value && this.confirmEmailCtrl.value && this.emailForm.hasError('confirmEqual'))
    );
    if(!this.editProfile()){
      this.showPasswordError$ = this.loginInfoForm.statusChanges.pipe(
        map(status => status === 'INVALID' && this.passwordCtrl.value && this.confirmPasswordCtrl.value && this.loginInfoForm.hasError('confirmEqual'))
      );
    }
  }

  private setupAsyncValidator(
    control: AbstractControl,
    checkFn: (value: string) => Observable<boolean>,
    errorKey: string,
    userValue: string,
  ) {
    control.valueChanges.pipe(
      debounceTime(500),
      filter(value => control.valid && control.dirty && this.editProfile() && value !== userValue),
      switchMap(value => checkFn(value)),
    ).subscribe(exists => {
      if (exists) {
        control.setErrors({
          ...control.errors,
          [errorKey]: true
        });
      }
    });
  }

  getFormControlErrorText(ctrl: AbstractControl) {
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
    const user = new User();

    user.firstName = this.personalInfoForm.get('firstName')?.value;
    user.lastName = this.personalInfoForm.get('lastName')?.value;
    user.username = this.loginInfoForm.get('username')?.value;

    user.email = this.emailCtrl.value;
    if(!this.editProfile()){
      user.password = this.passwordCtrl.value;
      user.role = RoleEnum.USER;
    } else {
      user.id = this.user().id;
      user.password = this.user().password;
      user.role = this.user().role;
    }
    
    this.submitForm.emit(user);
  }
}
