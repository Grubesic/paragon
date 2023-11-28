import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {RouterLinkActive, RouterModule} from "@angular/router";
import {MatLineModule} from "@angular/material/core";
import {MatButtonModule} from "@angular/material/button";
import {routes} from "../../../app.routes";

@Component({
  selector: 'app-vertical-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule, MatTooltipModule, MatLineModule, MatButtonModule],
  templateUrl: './vertical-navigation.component.html',
  styleUrl: './vertical-navigation.component.scss'
})
export class VerticalNavigationComponent {
  @Input() isNavbarOpened = false;
  @Output() isNavbarOpenedChange = new EventEmitter<boolean>();
  public routeLinks = routes;

  toggleNavbar() {
    this.isNavbarOpened = !this.isNavbarOpened;
    this.isNavbarOpenedChange.emit(this.isNavbarOpened);
  }
}
