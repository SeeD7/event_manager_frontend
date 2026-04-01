import { render } from '@testing-library/angular';
import { SignInComponent } from './sign-in.component';
import '@testing-library/jest-dom';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { UserFormComponent } from '../user-form/user-form.component';
import { UsersService } from '../../services/users.service';
import { User } from '../../../core/models/user.model';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

describe('Sign-InComponent', () => {
  // On crée un "Mock" du service
  const mockUsersService = {
    createUser: jest.fn(),
  };

  const mockToastr = {
    error: jest.fn(),
    success: jest.fn()
  };

  const mockRouter = {
    navigateByUrl: jest.fn(),
  };

  const fakeUser = { firstName: 'Ludo', email: 'ludo@test.com' } as User;

  test('toaster et redirection si tout va bien en cas d\'event', async () => {
    mockUsersService.createUser.mockReturnValue(of(fakeUser));
    const { fixture } = await render(SignInComponent, {
      imports: [UserFormComponent, MatProgressSpinner], 
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: ToastrService, useValue: mockToastr },
        { provide: Router, useValue: mockRouter }
      ]
    });

    // 2. ACT : Trouver le composant enfant
    const userFormDebugEl = fixture.debugElement.query(By.directive(UserFormComponent));
    const userFormInstance = userFormDebugEl.componentInstance;
    userFormInstance.submitForm.emit(fakeUser);

    // 3. ASSERT
    expect(mockUsersService.createUser).toHaveBeenCalledWith(fakeUser);
    expect(mockToastr.success).toHaveBeenCalledWith(expect.stringContaining('Inscription réussie ! Bienvenue !'), 'Success');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/event-manager/auth/login');
  });

  
  test('toaster si échec', async () => {
    mockUsersService.createUser.mockReturnValue(of(undefined));
    const { fixture } = await render(SignInComponent, {
      imports: [UserFormComponent, MatProgressSpinner], 
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: ToastrService, useValue: mockToastr },
        { provide: Router, useValue: mockRouter }
      ]
    });

    // 2. ACT : Trouver le composant enfant
    const userFormDebugEl = fixture.debugElement.query(By.directive(UserFormComponent));
    const userFormInstance = userFormDebugEl.componentInstance;
    userFormInstance.submitForm.emit(undefined);

    // 3. ASSERT
    expect(mockUsersService.createUser).toHaveBeenCalledWith(undefined);
    expect(mockToastr.error).toHaveBeenCalledWith(expect.stringContaining('Echec de l\'inscription.'), 'Error');
  });
});