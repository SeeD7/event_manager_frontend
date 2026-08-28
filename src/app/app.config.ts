import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { xhrInterceptor } from './core/interceptors/xhr.interceptor';
import { DatePipe } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    DatePipe,
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([xhrInterceptor])),
    provideToastr({
      positionClass: 'toast-bottom-center'
    })
  ]
};
