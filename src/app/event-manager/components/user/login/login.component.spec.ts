import { render, screen, fireEvent } from '@testing-library/angular';
import { LoginComponent } from './login.component';
import { AuthenticatorService } from '../../../../core/service/authenticator.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import '@testing-library/jest-dom';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  // On crée un "Mock" du service
  const mockAuthService = {
    authenticate: jest.fn(),
  };

  test('le bouton devrait être désactivé si le formulaire est invalide', async () => {
    // 1. ARRANGE : On affiche le composant
    await render(LoginComponent, {
      providers: [{ provide: AuthenticatorService, useValue: mockAuthService }],
    });

    // 2. ACT : On récupère le bouton
    const submitBtn = screen.getByRole('button', { name: /se connecter/i });

    // 3. ASSERT : Il doit être disabled par défaut (champs vides)
    expect(submitBtn).toBeDisabled();
  });

  test('devrait afficher une erreur si la connexion échoue avec 401', async () => {
    // 1. ARRANGE : On simule une VRAIE erreur 401 (objet avec propriété status)
    mockAuthService.authenticate.mockImplementation((credentials, cb, errCb) => {
      if (errCb) {
        // On simule une erreur HTTP avec le status 401
        errCb({ status: 401 } as any);
      }
    });

    await render(LoginComponent, {
      imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule],
      providers: [{ provide: AuthenticatorService, useValue: mockAuthService }],
    });

    // 2. ACT
    fireEvent.input(screen.getByLabelText(/username/i), { target: { value: 'test' } });
    fireEvent.input(screen.getByLabelText(/mot de passe/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    // 3. ASSERT : On attend que l'élément apparaisse
    const alert = await screen.findByText(/problème d'authentification/i);

    // 3. On vérifie la présence
    expect(alert).toBeInTheDocument();
  });

  test('devrait afficher une erreur si la connexion échoue avec 400', async () => {
    // 1. ARRANGE
    mockAuthService.authenticate.mockImplementation((credentials, cb, errCb) => {
      if (errCb) {
        errCb({ status: 400 } as any);
      }
    });

    await render(LoginComponent, {
      imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule],
      providers: [{ provide: AuthenticatorService, useValue: mockAuthService }],
    });

    // 2. ACT
    fireEvent.input(screen.getByLabelText(/username/i), { target: { value: 'test' } });
    fireEvent.input(screen.getByLabelText(/mot de passe/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    // 3. ASSERT : On attend que l'élément apparaisse
    const alert = await screen.findByText(/problème réseau/i);

    // 3. On vérifie la présence
    expect(alert).toBeInTheDocument();
  });

  test('redirect si tout va bien', async () => {
    // 1. ARRANGE
    const mockRouter = {
      navigateByUrl: jest.fn(),
    };

    await render(LoginComponent, {
      providers: [
        { provide: AuthenticatorService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }, // On remplace le vrai routeur
      ],
    });

    mockAuthService.authenticate.mockImplementation((cred, cb, errCb) => {
      if (cb) cb();
    });

    // 2. ACT
    fireEvent.input(screen.getByLabelText(/username/i), { target: { value: 'test' } });
    fireEvent.input(screen.getByLabelText(/mot de passe/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    // 3. ASSERT : On attend que l'élément apparaisse
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
  });
});
