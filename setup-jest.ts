import 'jest-preset-angular/setup-env/zoneless';
import '@testing-library/jest-dom';
import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// On vérifie si le TestBed est déjà initialisé
try {
  TestBed.initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
  );
} catch (e) {
  // Si on arrive ici, c'est que l'environnement est déjà là. 
  // On ne fait rien, et on laisse couler.
}