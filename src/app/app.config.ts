import {APP_INITIALIZER, ApplicationConfig, inject, Provider} from '@angular/core';
import {provideRouter, Routes, withComponentInputBinding, withViewTransitions} from '@angular/router';

import { routes } from './app.routes';
import { nonNavbarRoutes} from "./app.routes";
import { provideAnimations } from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {KeycloakBearerInterceptor, KeycloakService} from "keycloak-angular";
import {AuthGuardService} from "./core/auth/authguard.service";
import {RxStompService} from "./core/ws/rx-stomp.service";
import {rxStompServiceFactory} from "./core/ws/rx-stomp-service-factory";
import {environment} from "../environments/environment";

const allRoutes: Routes = [...routes, ...nonNavbarRoutes];

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      // Configuration details for Keycloak
      config: {
        url: environment.iss,
        realm: 'grubesic',
        clientId: 'grubesic-client',
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

const RxStompServiceProvider: Provider =  [
  {
    provide: RxStompService,
    useFactory: rxStompServiceFactory,
  },
];


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(allRoutes),
    RxStompServiceProvider,
    provideHttpClient(withInterceptorsFromDi()), // Provides HttpClient with interceptors
    KeycloakInitializerProvider, // Initializes Keycloak
    KeycloakBearerInterceptorProvider, // Provides Keycloak Bearer Interceptor
    KeycloakService, // Service for Keycloak
    provideRouter(allRoutes,withViewTransitions(),withComponentInputBinding()),
    provideAnimations(),

  ]
};
