import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { AuthenticatorService } from '../../../../core/service/authenticator.service';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatProgressSpinner, AsyncPipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {

  private formBuilder = inject(FormBuilder);
  private authenticatorService = inject(AuthenticatorService);
  private router = inject(Router);

  form!: FormGroup;

  usernameCtrl!: FormControl;
  passwordCtrl!: FormControl;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  credentials = { username: '', password: '' };
  error = "";

  ngOnInit(): void {
    this.initFormControls();
  }

  private initFormControls(): void {
    this.usernameCtrl = this.formBuilder.control('', Validators.required);
    this.passwordCtrl = this.formBuilder.control('', Validators.required);
    this.form = this.formBuilder.group({
      username: this.usernameCtrl,
      password: this.passwordCtrl,
    });
  }

  onSubmitForm() {
    this.loadingSubject.next(true);
    this.authenticatorService.authenticate({ username: this.usernameCtrl.value, password: this.passwordCtrl.value }, () => {
      this.loadingSubject.next(false);
      this.router.navigateByUrl('/');
    },
    (err) => {
      this.loadingSubject.next(false);
      if(err.status == 401){
        this.error = "authentication";
      } else {
        this.error = "other";
      }
    });
  }
}
