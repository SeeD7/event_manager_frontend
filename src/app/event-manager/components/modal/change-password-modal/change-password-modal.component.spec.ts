import { fireEvent, render, screen } from '@testing-library/angular';
import '@testing-library/jest-dom';
import { ChangePasswordModalComponent } from './change-password-modal.component';
import { MatDialogRef } from '@angular/material/dialog';

describe('ChangePasswordModalComponent', () => {
  function getByLabeltextChangeAndBlur(name: RegExp, value: string) {
    const input = screen.getByLabelText(name);
    fireEvent.input(input, { target: { value: value } });
    fireEvent.blur(input);
  }

  test('le bouton devrait être désactivé si le formulaire est invalide', async () => {
    // 1. ARRANGE : On affiche le composant
    await render(ChangePasswordModalComponent, {
      providers: [{ provide: MatDialogRef, useValue: { close: jest.fn() } }],
    });

    // 2. ACT : On récupère le bouton
    const submitBtn = screen.getByRole('button', { name: /Valider/i });

    // 3. ASSERT : Il doit être disabled par défaut (champs vides)
    expect(submitBtn).toBeDisabled();
  });

  test('le mot de passe doit être valide', async () => {
    // 1. ARRANGE : On affiche le composant
    await render(ChangePasswordModalComponent, {
      providers: [{ provide: MatDialogRef, useValue: { close: jest.fn() } }],
    });
    // 2. ACT
    getByLabeltextChangeAndBlur(/^Nouveau mot de passe$/i, 'bla');
    const alert = await screen.findByText(
      /Le mot de passe doit faire entre 8 et 36 caractères et doit contenir une minuscule, une majuscule, un chiffre et un caractère spécial \(@#\$%\^&\+=\)/i,
    );
    // 3. On vérifie la présence
    expect(alert).toBeInTheDocument();
  });

  test('la confirmartion du mot de passe doit correspondre', async () => {
    // 1. ARRANGE : On affiche le composant
    await render(ChangePasswordModalComponent, {
      providers: [{ provide: MatDialogRef, useValue: { close: jest.fn() } }],
    });
    // 2. ACT
    getByLabeltextChangeAndBlur(/^Nouveau mot de passe$/i, 'Password99@');
    getByLabeltextChangeAndBlur(/^Confirmer le mot de passe$/i, 'Password88@');
    const alert = await screen.findByText(/Les deux mots de passe ne correspondent pas/i);
    // 3. On vérifie la présence
    expect(alert).toBeInTheDocument();
  });

  test('devrait fermer la modale avec le mot de passe si le formulaire est valide', async () => {
    const mockDialogRef = { close: jest.fn() };
    await render(ChangePasswordModalComponent, {
      providers: [{ provide: MatDialogRef, useValue: mockDialogRef }],
    });

    const password = 'ValidPassword123@';
    getByLabeltextChangeAndBlur(/^Nouveau mot de passe$/i, password);
    getByLabeltextChangeAndBlur(/^Confirmer le mot de passe$/i, password);

    const submitBtn = screen.getByRole('button', { name: /Valider/i });
    fireEvent.click(submitBtn);

    // ASSERT : On vérifie que close() a été appelé avec la bonne valeur
    expect(mockDialogRef.close).toHaveBeenCalledWith(password);
  });

  test('devrait fermer la modale sans données au clic sur Annuler', async () => {
    const mockDialogRef = { close: jest.fn() };
    await render(ChangePasswordModalComponent, {
      providers: [{ provide: MatDialogRef, useValue: mockDialogRef }],
    });

    const cancelBtn = screen.getByRole('button', { name: /Annuler/i });
    fireEvent.click(cancelBtn);

    expect(mockDialogRef.close).toHaveBeenCalledWith(); // Appelé sans arguments
  });
});
