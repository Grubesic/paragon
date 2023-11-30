import { ApplicationConfig } from '@angular/core';
import {provideRouter, Routes} from '@angular/router';

import { routes } from './app.routes';
import { nonNavbarRoutes} from "./app.routes";
import { provideAnimations } from '@angular/platform-browser/animations';
import {provideHttpClient} from "@angular/common/http";

const allRoutes: Routes = [...routes, ...nonNavbarRoutes];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(allRoutes),
    provideAnimations(),
    provideHttpClient(),

  ]
};
