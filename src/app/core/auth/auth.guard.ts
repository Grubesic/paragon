import { CanActivateFn } from '@angular/router';
import {inject} from "@angular/core";
import {AuthGuardService} from "./authguard.service";

export const authGuard: CanActivateFn = (route, state) => {
  // Use inject() to get an instance of AuthGuardService
  const authService = inject(AuthGuardService);
  // Await the decision of isAccessAllowed
  return authService.isAccessAllowed(route, state);
};
