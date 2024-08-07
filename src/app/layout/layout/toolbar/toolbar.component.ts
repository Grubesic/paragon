import {Component, inject, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import { version} from '../../../../../package.json';
import {RouterLink} from "@angular/router";
import {AuthGuardService} from "../../../core/auth/authguard.service";

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  @Input() isNavbarOpened = false;
  private authService: AuthGuardService = inject(AuthGuardService);
  appVersion = version;

  logout() {
    this.authService.logout()
  }
}
