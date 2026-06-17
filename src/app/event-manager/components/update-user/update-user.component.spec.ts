import { render } from '@testing-library/angular';
import { UpdateUserComponent } from './update-user.component';
import '@testing-library/jest-dom';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { UserFormComponent } from '../user-form/user-form.component';
import { UsersService } from '../../services/users.service';
import { User } from '../../../core/models/user.model';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { AuthenticatorService } from '../../../core/service/authenticator.service';

describe('UpdateUserComponent', () => {
  // On crée un "Mock" du service
  const mockUsersService = {
    updateUser: jest.fn(),
  };

  const mockToastr = {
    error: jest.fn(),
    success: jest.fn()
  };

  const mockRouter = {
    navigateByUrl: jest.fn(),
  };

  const mockAuth = {
    navigateByUrl: jest.fn(),
  };

  const fakeUser = { id: 1, firstName: 'Ludo', email: 'ludo@test.com' } as User;

  const mockUserSignal = signal(fakeUser);

  const mockAuthService = {
    user: mockUserSignal 
  };

  test('toaster et redirection si tout va bien en cas d\'event', async () => {
    mockUsersService.updateUser.mockReturnValue(of(fakeUser));
    const { fixture } = await render(UpdateUserComponent, {
      imports: [UserFormComponent, MatProgressSpinner], 
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: ToastrService, useValue: mockToastr },
        { provide: Router, useValue: mockRouter },
        { provide: AuthenticatorService, useValue: mockAuthService }
      ]
    });

    // 2. ACT : Trouver le composant enfant
    const userFormDebugEl = fixture.debugElement.query(By.directive(UserFormComponent));
    const userFormInstance = userFormDebugEl.componentInstance;
    userFormInstance.submitForm.emit(fakeUser);

    // 3. ASSERT
    expect(mockUsersService.updateUser).toHaveBeenCalledWith(1, fakeUser);
    expect(mockToastr.success).toHaveBeenCalledWith(expect.stringContaining('Profil mis à jour avec succés !'), 'Success');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/event-manager/profile');
  });

  
  test('toaster si échec', async () => {
    mockUsersService.updateUser.mockReturnValue(of(undefined));
    const { fixture } = await render(UpdateUserComponent, {
      imports: [UserFormComponent, MatProgressSpinner], 
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: ToastrService, useValue: mockToastr },
        { provide: Router, useValue: mockRouter },
        { provide: AuthenticatorService, useValue: mockAuthService }
      ]
    });

    // 2. ACT : Trouver le composant enfant
    const userFormDebugEl = fixture.debugElement.query(By.directive(UserFormComponent));
    const userFormInstance = userFormDebugEl.componentInstance;
    userFormInstance.submitForm.emit(fakeUser);

    // 3. ASSERT
    expect(mockUsersService.updateUser).toHaveBeenCalledWith(1, fakeUser);
    expect(mockToastr.error).toHaveBeenCalledWith(expect.stringContaining('Echec de la mis à jour.'), 'Error');
  });
});