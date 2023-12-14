import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-generator-input',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './generator-input.component.html',
  styleUrl: './generator-input.component.scss'
})
export class GeneratorInputComponent {

}
