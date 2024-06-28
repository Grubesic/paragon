import {Component, OnInit, OnDestroy, ViewChild, ElementRef, inject} from '@angular/core';
import * as d3 from 'd3';
import {
  Simulation,
  SimulationNodeDatum,
  SimulationLinkDatum,
  ForceLink,
  Selection,
  DragBehavior,
  SubjectPosition
} from 'd3';
import {NgForOf} from "@angular/common";
import {SystemOverviewService} from "./system-overview.service";


@Component({
  selector: 'app-system-overview',
  standalone: true,
  templateUrl: './system-overview.component.html',
  imports: [
    NgForOf
  ],
  styleUrl: './system-overview.component.scss'
})
export class SystemOverviewComponent {

  monitorService = inject(SystemOverviewService)
  constructor() {}

}
