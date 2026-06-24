import { fireEvent, render, screen } from '@testing-library/angular';
import '@testing-library/jest-dom';
import { EventCategoryModalComponent } from './event-category-modal.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { of } from 'rxjs';
import { EventCategoryService } from '../../../services/event-category.service';
import { EventCategory } from '../../../../core/models/business/event-category.model';
import { provideToastr } from 'ngx-toastr';

describe('EventCategoryModalComponent', () => {
  const mockEventCategoryService = {
    exists: jest.fn(),
  };

  const category = new EventCategory();
  category.name = 'Sports';
  category.icon = 'sports';

  const mockDialogRef = { close: jest.fn() };

  async function setup(data: Object | null = null) {
    const spy = jest.fn();
    const utils = await render(EventCategoryModalComponent, {
      imports: [MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatFormFieldModule, MatInputModule],
      providers: [
        { provide: EventCategoryService, useValue: mockEventCategoryService }, 
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: mockDialogRef },
        provideToastr(),
      ],
    });
    return { ...utils, spy };
  }
  
  function getByLabeltextChangeAndBlur(name: RegExp, value: string) {
    const input = screen.getByLabelText(name);
    fireEvent.input(input, { target: { value: value } });
    fireEvent.blur(input);
  }
  
  test('le bouton devrait être désactivé si le formulaire est invalide', async () => {
    // 1. ARRANGE : On affiche le composant
    const { fixture } = await setup();
    fixture.detectChanges();

    // 2. ACT : On récupère le bouton
    const submitBtn = screen.getByRole('button', { name: /Créer/i });

    // 3. ASSERT : Il doit être disabled par défaut (champs vides)
    expect(submitBtn).toBeDisabled();
  });

  test("le nom de la catégorie ne doit pas déjà exister", async () => {
    // 1. ARRANGE : On affiche le composant
    mockEventCategoryService.exists.mockReturnValue(of(true));
    await setup();
    // 2. ACT
    getByLabeltextChangeAndBlur(/^nom de la catégorie$/i, 'Sports');
    const alert = await screen.findByText(/Le nom de catégorie existe déjà/i);
    // 3. On vérifie la présence
    expect(alert).toBeInTheDocument();
  });

  test("la vérification du nom de la catégorie ne doit pas se déclencher si le nom est le même", async () => {
    // 1. ARRANGE : On affiche le composant
    const data = { ...category, id: 1 };
    mockEventCategoryService.exists.mockReturnValue(of(true));
    await setup(data);
    // 2. ACT
    const submitBtn = screen.getByRole('button', { name: /Modifier/i });
    expect(submitBtn).toBeInTheDocument();
    getByLabeltextChangeAndBlur(/^nom de la catégorie$/i, 'Sports');
    const alert = await screen.queryByText(/Le nom de catégorie existe déjà/i);
    // 3. On vérifie la non présence
    expect(alert).not.toBeInTheDocument();
  });


  test('devrait fermer la modale avec la catégorie si le formulaire est valide', async () => {
    const { fixture } = await setup();
    fixture.detectChanges();

    getByLabeltextChangeAndBlur(/^Nom de la catégorie$/i, 'Sports');
    getByLabeltextChangeAndBlur(/^Icône de la catégorie$/i, 'sports');

    const submitBtn = screen.getByRole('button', { name: /Créer/i });
    fireEvent.click(submitBtn);

    // ASSERT : On vérifie que close() a été appelé avec la bonne valeur
    expect(mockDialogRef.close).toHaveBeenCalledWith(category);
  });

  test('devrait fermer la modale sans données au clic sur Annuler', async () => {
    const { fixture } = await setup();
    fixture.detectChanges();

    const cancelBtn = screen.getByRole('button', { name: /Annuler/i });
    fireEvent.click(cancelBtn);

    expect(mockDialogRef.close).toHaveBeenCalledWith(); // Appelé sans arguments
  });
});
