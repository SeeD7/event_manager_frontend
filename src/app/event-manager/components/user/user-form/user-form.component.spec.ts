import { render, screen, fireEvent } from '@testing-library/angular';
import { UserFormComponent } from './user-form.component';
import '@testing-library/jest-dom';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { AsyncPipe, CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { User } from '../../../../core/models/business/user.model';
import { RoleEnum } from '../../../../core/models/business/role.enum';
import { UsersService } from '../../../services/users.service';

describe('Sign-InComponent', () => {
  // On crée un "Mock" du service
  const mockUsersService = {
    checkEmail: jest.fn(),
    checkUsername: jest.fn(),
  };

  const user = new User();
  user.firstName = 'Lulu';
  user.lastName = 'Berlu';
  user.username = 'Luluberlu';
  user.email = 'lulu.berlu@mail.com';
  user.password = 'Blerg@88';
  user.role = RoleEnum.USER;

  async function setup(inputs = {}, outputs = {}) {
    const spy = jest.fn();
    const utils = await render(UserFormComponent, {
      imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, AsyncPipe, CommonModule],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
      componentInputs: inputs,
      componentOutputs: outputs
    });
    return { ...utils, spy };
  }

  function getByLabeltextChangeAndBlur(name:RegExp, value: string) {
    const input = screen.getByLabelText(name);
    fireEvent.input(input, { target: { value: value } });
    fireEvent.blur(input);
  }

  describe("Formulaire d'inscription", () => {
    test('le bouton devrait être désactivé si le formulaire est invalide', async () => {
      // 1. ARRANGE : On affiche le composant
      await setup();
      // 2. ACT : On récupère le bouton
      const submitBtn = screen.getByRole('button', { name: /s'inscrire/i });
      // 3. ASSERT : Il doit être disabled par défaut (champs vides)
      expect(submitBtn).toBeDisabled();
    });

    test("l'adresse email doit être valide", async () => {
      // 1. ARRANGE : On affiche le composant
      await setup();
      // 2. ACT
      getByLabeltextChangeAndBlur(/^adresse mail$/i, 'invalid-email');
      const alert = await screen.findByText(/merci d'entrer une adresse mail valide/i);
      // 3. On vérifie la présence
      expect(alert).toBeInTheDocument();
    });

    test("la confirmartion de l'adresse email doit correspondre", async () => {
      // 1. ARRANGE : On affiche le composant
      await setup();
      // 2. ACT
      getByLabeltextChangeAndBlur(/^adresse mail$/i, 'toto@tata.titi');
      getByLabeltextChangeAndBlur(/^confirmer votre adresse mail$/i, 'tutu@tata.titi');
      const alert = await screen.findByText(/les deux adresses ne correspondent pas/i);
      // 3. On vérifie la présence
      expect(alert).toBeInTheDocument();
    });

    test('le mot de passe doit être valide', async () => {
      // 1. ARRANGE : On affiche le composant
      await setup();
      // 2. ACT
      getByLabeltextChangeAndBlur(/^mot de passe$/i, 'bla');
      const alert = await screen.findByText(
        /Le mot de passe doit faire entre 8 et 36 caractères et doit contenir une minuscule, une majuscule, un chiffre et un caractère spécial \(@#\$%\^&\+=\)/i,
      );
      // 3. On vérifie la présence
      expect(alert).toBeInTheDocument();
    });

    test('la confirmartion du mot de passe doit correspondre', async () => {
      // 1. ARRANGE : On affiche le composant
      await setup();
      // 2. ACT
      getByLabeltextChangeAndBlur(/^mot de passe$/i, 'Password99@');
      getByLabeltextChangeAndBlur(/^confirmer votre mot de passe$/i, 'Password88@');
      const alert = await screen.findByText(/Les deux mots de passe ne correspondent pas/i);
      // 3. On vérifie la présence
      expect(alert).toBeInTheDocument();
    });

    test("l'adresse email ne doit pas déjà exister", async () => {
      // 1. ARRANGE : On affiche le composant
      mockUsersService.checkEmail.mockReturnValue(of(true));
      await setup();
      // 2. ACT
      getByLabeltextChangeAndBlur(/^adresse mail$/i, 'toto@tata.titi');
      const alert = await screen.findByText(/L'email est déjà utilisé/i);
      // 3. On vérifie la présence
      expect(alert).toBeInTheDocument();
    });

    test("le nom d'utilisateur ne doit pas déjà exister", async () => {
      // 1. ARRANGE : On affiche le composant
      mockUsersService.checkUsername.mockReturnValue(of(true));
      await setup();
      // 2. ACT
      getByLabeltextChangeAndBlur(/^Nom d'utilisateur$/i, 'Lulu');
      const alert = await screen.findByText(/Le nom d'utilisateur est déjà utilisé/i);
      // 3. On vérifie la présence
      expect(alert).toBeInTheDocument();
    });

    test("l'event emit doit être appelé si tout est ok", async () => {
      // 1. ARRANGE : On affiche le composant
      const spy = jest.fn();
      mockUsersService.checkUsername.mockReturnValue(of(true));
      await setup({}, { submitForm: { emit: spy } as any });
      // 2. ACT
      getByLabeltextChangeAndBlur(/^Prénom$/i, user.firstName);
      getByLabeltextChangeAndBlur(/^Nom$/i, user.lastName);
      getByLabeltextChangeAndBlur(/^adresse mail$/i, user.email);
      getByLabeltextChangeAndBlur(/^confirmer votre adresse mail$/i, user.email);
      getByLabeltextChangeAndBlur(/^Nom d'utilisateur$/i, user.username);
      getByLabeltextChangeAndBlur(/^mot de passe$/i, user.password);
      getByLabeltextChangeAndBlur(/^confirmer votre mot de passe$/i, user.password);
      fireEvent.click(screen.getByRole('button', { name: /S'inscrire/i }));
      // 3. On vérifie l'appel du emit
      expect(spy).toHaveBeenCalledWith(user);
    });
  });

  describe("Formulaire de mise à jour", () => {
    const inputs = { user: user, editProfile: true };
    test('le bouton devrait être désactivé si le formulaire est invalide', async () => {
      // 1. ARRANGE : On affiche le composant
      await setup(inputs);
      // 2. ACT : On récupère le bouton
      getByLabeltextChangeAndBlur(/^adresse mail$/i, '');
      const submitBtn = screen.getByRole('button', { name: /Mettre à jour les informations/i });
      // 3. ASSERT : Il doit être disabled par défaut (champs vides)
      expect(submitBtn).toBeDisabled();
    });

    test("l'adresse email doit être valide", async () => {
      // 1. ARRANGE : On affiche le composant
      await setup(inputs);
      // 2. ACT
      getByLabeltextChangeAndBlur(/^adresse mail$/i, 'invalid-email');
      const alert = await screen.findByText(/merci d'entrer une adresse mail valide/i);
      // 3. On vérifie la présence
      expect(alert).toBeInTheDocument();
    });

    test("la confirmartion de l'adresse email doit correspondre", async () => {
      // 1. ARRANGE : On affiche le composant
      await setup(inputs);
      // 2. ACT
      getByLabeltextChangeAndBlur(/^adresse mail$/i, 'toto@tata.titi');
      getByLabeltextChangeAndBlur(/^confirmer votre adresse mail$/i, 'tutu@tata.titi');
      const alert = await screen.findByText(/les deux adresses ne correspondent pas/i);
      // 3. On vérifie la présence
      expect(alert).toBeInTheDocument();
    });

    test("l'adresse email ne doit pas déjà exister", async () => {
      // 1. ARRANGE : On affiche le composant
      mockUsersService.checkEmail.mockReturnValue(of(true));
      await setup(inputs);
      // 2. ACT
      getByLabeltextChangeAndBlur(/^adresse mail$/i, 'toto@tata.titi');
      const alert = await screen.findByText(/L'email est déjà utilisé/i);
      // 3. On vérifie la présence
      expect(alert).toBeInTheDocument();
    });

    test("ok si l'email' est le même", async () => {
      // 1. ARRANGE : On affiche le composant
      mockUsersService.checkEmail.mockReturnValue(of(true));
      await setup(inputs);
      // 2. ACT
      getByLabeltextChangeAndBlur(/^adresse mail$/i, 'lulu.berlu@mail.com');
      const alert = await screen.queryByText(/L'email est déjà utilisé/i);
      // 3. On vérifie la présence
      expect(alert).not.toBeInTheDocument();
    });

    test("le nom d'utilisateur ne doit pas déjà exister", async () => {
      // 1. ARRANGE : On affiche le composant
      mockUsersService.checkUsername.mockReturnValue(of(true));
      await setup(inputs);
      // 2. ACT
      getByLabeltextChangeAndBlur(/^Nom d'utilisateur$/i, 'Lulu');
      // 3. ASSERT : On attend que l'élément apparaisse
      const alert = await screen.findByText(/Le nom d'utilisateur est déjà utilisé/i);
      // 3. On vérifie la présence
      expect(alert).toBeInTheDocument();
    });

    test("ok si le nom d'utilisateur est le même", async () => {
      // 1. ARRANGE : On affiche le composant
      mockUsersService.checkUsername.mockReturnValue(of(true));
      await setup(inputs);
      // 2. ACT
      getByLabeltextChangeAndBlur(/^Nom d'utilisateur$/i, 'Luluberlu');
      // 3. ASSERT : On attend que l'élément apparaisse
      const alert = await screen.queryByText(/Le nom d'utilisateur est déjà utilisé/i);
      // 3. On vérifie la présence
      expect(alert).not.toBeInTheDocument();
    });

    test("l'event emit doit être appelé si tout est ok", async () => {
      // 1. ARRANGE : On affiche le composant
      const spy = jest.fn();
      mockUsersService.checkUsername.mockReturnValue(of(true));
      await setup(inputs, { submitForm: { emit: spy } as any });
      // 2. ACT
      getByLabeltextChangeAndBlur(/^Prénom$/i, user.firstName);
      getByLabeltextChangeAndBlur(/^Nom$/i, user.lastName);
      getByLabeltextChangeAndBlur(/^adresse mail$/i, user.email);
      getByLabeltextChangeAndBlur(/^confirmer votre adresse mail$/i, user.email);
      getByLabeltextChangeAndBlur(/^Nom d'utilisateur$/i, user.username);
      fireEvent.click(screen.getByRole('button', { name: /Mettre à jour les informations/i }));
      // 3. On vérifie l'appel du emit
      expect(spy).toHaveBeenCalledWith(user);
    });
  });
});
