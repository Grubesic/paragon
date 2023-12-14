import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";

import imageData from '../model/image-settings.json';
import {ImageSettings} from "../model/models";
import {GeneratorService} from "./generator.service";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-generator-input',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatDividerModule, MatProgressSpinnerModule, FormsModule],
  templateUrl: './generator-input.component.html',
  styleUrl: './generator-input.component.scss'
})
export class GeneratorInputComponent {

  base64GeneratedImage: string = '';
  isGenerating: boolean = false;
  prompt: string = 'generate photo realistic passport image of a young man in mid twenties with red hair, red beard. the background has to be white and the whole head should be visible and in the middle of the picture';

  constructor(private generatorService: GeneratorService) { }
  generateImage(){
    this.isGenerating = true;
    console.log(this.prompt);
    const imageSettings = new ImageSettings(imageData);

    imageSettings.prompt = this.prompt;

    this.generatorService.generateImage(imageSettings).subscribe(({
      next: (imageDataList) => {
        console.log(imageData);
        this.base64GeneratedImage = imageDataList[0].base64;
        console.log(this.base64GeneratedImage)
        this.isGenerating = false;
      },
      error: (err) => { console.log(err); this.isGenerating = false }
    }))

  }

}
