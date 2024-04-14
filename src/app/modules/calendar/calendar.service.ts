import {computed, inject, Injectable, signal} from '@angular/core';
import {Person} from "../../core/models/interfaces";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private http = inject(HttpClient)

  private personSignal = signal<Person[]>([])
  persons = computed(() => this.personSignal())

  constructor() { this.loadPersons() }


  private loadPersons() {
    this.http.get<Person[]>("http://localhost:8081/api/persons-all").subscribe({
      next: (data) => {
        console.log(data)
        this.personSignal.set(data)
      },
      error: (error) => {console.log(error)}
    })

  }
}
