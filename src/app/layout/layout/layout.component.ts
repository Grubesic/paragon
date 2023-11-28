import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterOutlet} from "@angular/router";
import {ToolbarComponent} from "./toolbar/toolbar.component";
import {VerticalNavigationComponent} from "./vertical-navigation/vertical-navigation.component";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatLineModule} from "@angular/material/core";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToolbarComponent, VerticalNavigationComponent, MatSidenavModule, MatListModule, MatIconModule, MatToolbarModule, MatButtonModule, MatLineModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  isNavbarOpened = false;

  onIsNavbarOpenedChange(newValue: boolean) {
    this.isNavbarOpened = newValue;
  }
}
