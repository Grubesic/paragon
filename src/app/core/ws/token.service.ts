import {inject, Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {AuthGuardService} from "../auth/authguard.service";
import {HttpClient} from "@angular/common/http";
import {Csrftoken} from "../auth/csrftoken";

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private apiUrl = 'http://localhost:8081/csrf';
  private http: HttpClient = inject(HttpClient);

  fetchCsrfToken(): Observable<Csrftoken> {
    // Implement actual fetch logic
    return this.http.get<Csrftoken>(`${this.apiUrl}`);
  }
}
