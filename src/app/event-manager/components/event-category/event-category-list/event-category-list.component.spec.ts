import { render, screen } from '@testing-library/angular';
import '@testing-library/jest-dom';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { EventCategoryTableComponent } from '../event-category-table/event-category-table.component';
import { EventCategoryListComponent } from '../event-category-list/event-category-list.component';
import { MatDialog } from '@angular/material/dialog';
import { EventCategory } from '../../../../core/models/business/event-category.model';
import { EventCategoryService } from '../../../services/event-category.service';
import { provideToastr } from 'ngx-toastr';
import { AuthenticatorService } from '../../../../core/service/authenticator.service';

describe('EventCategoryListComponent', () => {
  // On crée un "Mock" du service
  const mockEventCategoryService = { updateEventCategory: jest.fn(), deleteEventCategory: jest.fn(), getEventCategories: jest.fn(),};
  const mockDialog = { open: jest.fn() };
  const fakeEventCategory = { id: 1, name: 'Sport' } as EventCategory;
  const mockResponse = { content: [fakeEventCategory], page: { number: 0, size: 10, totalElements: 1, totalPages: 1 } };
  
  const category = new EventCategory();
  category.id = 1;
  category.name = 'Sports';
  category.icon = 'sports';

  test('appel de updateEventCategory du service si okay', async () => {
    mockEventCategoryService.updateEventCategory.mockReturnValue(of(fakeEventCategory));
    mockEventCategoryService.getEventCategories.mockReturnValue(of(mockResponse)); // <-- Assure-toi que mockResponse a le .page !
    
    mockDialog.open.mockReturnValue({
      afterClosed: () => of(category)
    });

    const mockAuthService = {
      user: () => ({ username: 'Lulu' }) // On simule le computed/signal
    };

    const { fixture } = await render(EventCategoryListComponent, {
      imports: [EventCategoryTableComponent],
      providers: [
        { provide: EventCategoryService, useValue: mockEventCategoryService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: AuthenticatorService, useValue: mockAuthService },
        provideToastr(),
      ]
    });

    // 2. ACT
    fixture.detectChanges();
    fixture.whenStable();
    const tableDebugEl = fixture.debugElement.query(By.directive(EventCategoryTableComponent));
    const tableInstance = tableDebugEl.componentInstance;
    
    // On déclenche l'édition
    tableInstance.edit.emit(fakeEventCategory);

    // 3. ASSERT
    expect(mockDialog.open).toHaveBeenCalled();
    const expectedCategory = { ...category, creator: 'Lulu' };
    expect(mockEventCategoryService.updateEventCategory).toHaveBeenCalledWith(fakeEventCategory.id, expectedCategory);
  });

    test('appel de deleteEventCategory du service si okay', async () => {
    mockEventCategoryService.deleteEventCategory.mockReturnValue(of(fakeEventCategory));
    mockEventCategoryService.getEventCategories.mockReturnValue(of(mockResponse)); // <-- Assure-toi que mockResponse a le .page !
    
    // On mock la modale pour qu'elle renvoie 'ADMIN' (ou un Enum valide) lors du afterClosed
    mockDialog.open.mockReturnValue({
      afterClosed: () => of(true) // Ton switchMap attend un rôle ou undefined
    });

    const { fixture } = await render(EventCategoryListComponent, {
      imports: [EventCategoryTableComponent],
      providers: [
        { provide: EventCategoryService, useValue: mockEventCategoryService },
        { provide: MatDialog, useValue: mockDialog },
        provideToastr(),
      ]
      // Note : Pas besoin de mocker le EventCategoryTableComponent si tu veux tester l'intégration des deux
    });

    // 2. ACT
    fixture.detectChanges();
    fixture.whenStable();
    const tableDebugEl = fixture.debugElement.query(By.directive(EventCategoryTableComponent));
    const tableInstance = tableDebugEl.componentInstance;
    
    // On déclenche l'édition
    tableInstance.delete.emit(fakeEventCategory);

    // 3. ASSERT
    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockEventCategoryService.deleteEventCategory).toHaveBeenCalledWith(fakeEventCategory.id);
  });
});