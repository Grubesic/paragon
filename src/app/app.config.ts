import {APP_INITIALIZER, ApplicationConfig, inject, Provider} from '@angular/core';
import {provideRouter, Routes, withComponentInputBinding, withViewTransitions} from '@angular/router';

import { routes } from './app.routes';
import { nonNavbarRoutes} from "./app.routes";
import { provideAnimations } from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {KeycloakBearerInterceptor, KeycloakService} from "keycloak-angular";
import {provideClientHydration} from "@angular/platform-browser";

const allRoutes: Routes = [...routes, ...nonNavbarRoutes];

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      // Configuration details for Keycloak
      config: {
        url: 'http://192.168.50.76:7200',
        realm: 'paragon',
        clientId: 'paragon-client'
      },
      // Options for Keycloak initialization
      initOptions: {
        onLoad: 'login-required', // Action to take on load
        /*silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html' // URI for silent SSO checks
        ,*/
        checkLoginIframe: false
      },
      // Enables Bearer interceptor
      enableBearerInterceptor: true,
      // Prefix for the Bearer token
      bearerPrefix: 'Bearer',
      // URLs excluded from Bearer token addition (empty by default)
      //bearerExcludedUrls: []
    });
}

// Provider for Keycloak Bearer Interceptor
const KeycloakBearerInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: KeycloakBearerInterceptor,
  multi: true
};

// Provider for Keycloak Initialization
const KeycloakInitializerProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: initializeKeycloak,
  multi: true,
  deps: [KeycloakService]
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(allRoutes),
    provideHttpClient(withInterceptorsFromDi()), // Provides HttpClient with interceptors
    KeycloakInitializerProvider, // Initializes Keycloak
    KeycloakBearerInterceptorProvider, // Provides Keycloak Bearer Interceptor
    KeycloakService, // Service for Keycloak
    provideRouter(allRoutes,withViewTransitions(),withComponentInputBinding()),
    provideAnimations(),

  ]
};
