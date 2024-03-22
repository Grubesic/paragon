import {computed, Injectable, signal} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {KeycloakAuthGuard, KeycloakEventType, KeycloakService} from 'keycloak-angular';
import {KeycloakProfile} from "keycloak-js";
import {from, map, Observable} from "rxjs";
import {resolve} from "@angular/compiler-cli";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService extends KeycloakAuthGuard {

  private account = signal<KeycloakProfile | null>(null)

  private authToken = signal<string>("")

  user = computed(() => this.account());

  token = computed(() => this.authToken());

  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
    keycloak.keycloakEvents$.subscribe({
      next(event) {
        console.log(event)
        if (event.type == KeycloakEventType.OnTokenExpired) {
          keycloak.updateToken(20);
        }
        if (event.type == KeycloakEventType.OnAuthSuccess) {
          console.log("Auth success")
        }
        console.log("keycloak event:" + event)
      }
    });
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    // Force the user to log in if currently unauthenticated.
    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin + state.url
      });
    }

    this.getAccount().subscribe({
      next: data => {
        if(data){
          this.account.set(data)
        }
      }
    })

    await this.getToken()

    // Get the roles required from the route.
    const requiredRoles = route.data['roles'];

    // Allow the user to proceed if no additional roles are required to access the route.
    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
      return true;
    }

    // Allow the user to proceed if all the required roles are present.
    return requiredRoles.every((role) => this.roles.includes(role));
  }

  // Retrieve the logged-in user's details
  public async getLoggedInUser(): Promise<KeycloakProfile | null> {
    try {
      if (this.authenticated) {
        // Retrieve the user's profile
        return await this.keycloak.loadUserProfile();
      }
      return null; // User is not authenticated
    } catch (error) {
      console.error('Failed to load user profile', error);
      return null;
    }
  }


  getAccount(): Observable<KeycloakProfile | null> {
    // Convert the Promise returned by getLoggedInUser() into an Observable
    return from(this.getLoggedInUser());
  }

  async getToken() {
   let token = await this.keycloak.getToken()
    this.authToken.set(token)
  }


  logout(){
    this.keycloak.logout()
  }
}
