import {inject, Injectable} from '@angular/core';
import { RxStompService } from './rx-stomp.service';
import { TokenService } from './token.service';
import {BehaviorSubject, Observable, of, take} from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {myRxStompConfig} from "./rx-stomp.config";
import {AuthGuardService} from "../auth/authguard.service";

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private isActivated$ = new BehaviorSubject<boolean>(false);
  private authService: AuthGuardService = inject(AuthGuardService);

  constructor(private tokenService: TokenService, private rxStompService: RxStompService) {}

  activateWebSocket(): Observable<boolean> {
    // If already activated, immediately return true
    if (this.isActivated$.value) {
      return of(true);
    }

    // Fetch the CSRF token
    return this.tokenService.fetchCsrfToken().pipe(
      tap(csrfToken => {
        // Use the Keycloak token from authService
        const keycloakToken = this.authService.token();

        // Configure RxStompService with the CSRF and Keycloak tokens
        this.rxStompService.configure({
          ...myRxStompConfig,
          connectHeaders: {
            //'X-CSRF-TOKEN': csrfToken.token, // Adjust according to the actual structure of csrfToken
            'Authorization': `Bearer ${keycloakToken}`
          }
        });
        this.rxStompService.activate();
        console.log("WebSocket service activated");
        this.isActivated$.next(true);
      }),
      map(() => true), // Map to true upon successful activation
      catchError(error => {
        console.error('Error activating WebSocket:', error);
        return of(false); // In case of error, emit false
      }),
      take(1) // Ensure the observable completes
    );
  }
}
