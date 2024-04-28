import {computed, inject, Injectable, signal} from '@angular/core';
import {Person} from "../../core/models/interfaces";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private http = inject(HttpClient)

  private personSignal = signal<Person[]>([])
  persons = computed(() => this.personSignal())

  constructor() { this.loadPersons() }


  private loadPersons() {
    this.http.get<Person[]>(environment.apiUrl + "/api/persons-all").subscribe({
      next: (data) => {
        console.log(data)
        this.personSignal.set(data)
      },
      error: (error) => {console.log(error)}
    })

  }
}
