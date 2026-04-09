import { render, screen } from '@testing-library/angular';
import { UserListComponent } from './user-list.component';
import '@testing-library/jest-dom';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { User } from '../../../../core/models/user.model';
import { UsersService } from '../../../services/users.service';
import { UpdateRoleModalComponent } from '../update-role-modal/update-role-modal.component';
import { UsersTableComponent } from '../users-table/users-table.component';

describe('UserListComponent', () => {
  // On crée un "Mock" du service
  const mockUsersService = { updateRoleUser: jest.fn(), deleteUser: jest.fn(), getUsers: jest.fn(),};
  const mockDialog = { open: jest.fn() };
  const fakeUser = { id: 1, firstName: 'Ludo', email: 'ludo@test.com' } as User;
  const mockResponse = { content: [fakeUser], totalElements: 1, size: 10, number: 0 };
  const mockTable = { ngOnChanges: jest.fn() };

  test('appel de updateRoleUser du service si okay', async () => {
    mockUsersService.updateRoleUser.mockReturnValue(of(fakeUser));
    
    mockUsersService.getUsers.mockReturnValue(of(mockResponse));
    const { fixture } = await render(UserListComponent, {
      //imports: [UserFormComponent, MatProgressSpinner], 
      providers: [{ provide: UsersService, useValue: mockUsersService },
        { provide: UsersTableComponent, useValue: mockTable }
      ]
    });

    expect(screen.getByRole('table')).toBeInTheDocument();

    // 2. ACT : Trouver le composant enfant
    const userFormDebugEl = fixture.debugElement.query(By.directive(UsersTableComponent));
    const userFormInstance = userFormDebugEl.componentInstance;
    userFormInstance.edit.emit(fakeUser);

    expect(mockDialog.open).toHaveBeenCalledWith(UpdateRoleModalComponent, expect.any(User));

    mockDialog.open.mockReturnValue({
      afterClosed: () => of(true) // Simule que l'utilisateur a cliqué sur OK
    });

    expect(mockUsersService.updateRoleUser).toHaveBeenCalledWith(1, fakeUser);
  });
});