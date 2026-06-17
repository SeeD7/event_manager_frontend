import { render, screen } from '@testing-library/angular';
import { UserListComponent } from './user-list.component';
import '@testing-library/jest-dom';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { User } from '../../../../core/models/user.model';
import { UsersService } from '../../../services/users.service';
import { UpdateRoleModalComponent } from '../update-role-modal/update-role-modal.component';
import { UsersTableComponent } from '../users-table/users-table.component';
import { RoleEnum } from '../../../../core/models/role.enum';
import { MatDialog } from '@angular/material/dialog';

describe('UserListComponent', () => {
  // On crée un "Mock" du service
  const mockUsersService = { updateRoleUser: jest.fn(), deleteUser: jest.fn(), getUsers: jest.fn(),};
  const mockDialog = { open: jest.fn() };
  const fakeUser = { id: 1, firstName: 'Ludo', email: 'ludo@test.com', role: RoleEnum.ORGANIZER } as User;
  const mockResponse = { content: [fakeUser], page: { number: 0, size: 10, totalElements: 1, totalPages: 1 } };

  test('appel de updateRoleUser du service si okay', async () => {
    mockUsersService.updateRoleUser.mockReturnValue(of(fakeUser));
    mockUsersService.getUsers.mockReturnValue(of(mockResponse)); // <-- Assure-toi que mockResponse a le .page !
    
    // On mock la modale pour qu'elle renvoie 'ADMIN' (ou un RoleEnum valide) lors du afterClosed
    mockDialog.open.mockReturnValue({
      afterClosed: () => of(RoleEnum.ADMIN) // Ton switchMap attend un rôle ou undefined
    });

    const { fixture } = await render(UserListComponent, {
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: MatDialog, useValue: mockDialog } // Ne pas oublier de moker le MatDialog injecté !
      ]
      // Note : Pas besoin de mocker le UsersTableComponent si tu veux tester l'intégration des deux
    });

    // 2. ACT
    const tableDebugEl = fixture.debugElement.query(By.directive(UsersTableComponent));
    const tableInstance = tableDebugEl.componentInstance;
    
    // On déclenche l'édition
    tableInstance.edit.emit(fakeUser);

    // 3. ASSERT
    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockUsersService.updateRoleUser).toHaveBeenCalledWith(fakeUser.id, RoleEnum.ADMIN);
  });

    test('appel de deleteUser du service si okay', async () => {
    mockUsersService.deleteUser.mockReturnValue(of(fakeUser));
    mockUsersService.getUsers.mockReturnValue(of(mockResponse)); // <-- Assure-toi que mockResponse a le .page !
    
    // On mock la modale pour qu'elle renvoie 'ADMIN' (ou un RoleEnum valide) lors du afterClosed
    mockDialog.open.mockReturnValue({
      afterClosed: () => of(true) // Ton switchMap attend un rôle ou undefined
    });

    const { fixture } = await render(UserListComponent, {
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: MatDialog, useValue: mockDialog } // Ne pas oublier de moker le MatDialog injecté !
      ]
      // Note : Pas besoin de mocker le UsersTableComponent si tu veux tester l'intégration des deux
    });

    // 2. ACT
    const tableDebugEl = fixture.debugElement.query(By.directive(UsersTableComponent));
    const tableInstance = tableDebugEl.componentInstance;
    
    // On déclenche l'édition
    tableInstance.delete.emit(fakeUser);

    // 3. ASSERT
    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockUsersService.deleteUser).toHaveBeenCalledWith(fakeUser.id);
  });
});