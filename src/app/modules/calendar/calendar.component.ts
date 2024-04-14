import {Component, effect, inject} from '@angular/core';
import {FullCalendarModule} from "@fullcalendar/angular";
import {CalendarOptions} from "@fullcalendar/core";
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';  // Import for day and month views
import interactionPlugin from '@fullcalendar/interaction';
import {CalendarService} from "./calendar.service"; // For clickable dates


@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {

  private calendarService = inject(CalendarService)

  constructor() {
    this.handlePersons()
  }

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [timeGridPlugin, dayGridPlugin, interactionPlugin], // Added necessary plugins
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'  // Added buttons for different views
    },
    dateClick: this.handleDateClick.bind(this),
    events: [
      { title: 'event 1', date: '2024-04-14' },
      { title: 'event 2', date: '2024-04-14' }
    ]
  };

  handleDateClick(arg: { dateStr: string; }) {
    alert('Date clicked: ' + arg.dateStr);
  }

  private handlePersons() {
    effect(() => {
      const currentYear = new Date().getFullYear();
      let events = this.calendarService.persons().map(person => {
        const birthDate = new Date(person.birthdate);
        const eventDate = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
        console.log(`${person.firstName} ${person.lastName}'s Birthday ${currentYear}-${birthDate.getMonth()}-${birthDate.getDay()}`)
        return {
          title: `${person.firstName} ${person.lastName}'s Birthday`,
          date: this.formatDate(eventDate),  // Format as YYYY-MM-DD

        };
      }

     )

      this.calendarOptions = { ...this.calendarOptions, events: events };

    })

  }

  formatDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

}
