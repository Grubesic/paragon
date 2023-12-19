import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {ImageService} from "../gallery/image.service";
import imageData from '../../model/image2image-settings.json'
import {ImageSettings} from "../../model/models";
import {Image2ImageSettings, ImagePrompt} from "../../model/image2image";
import {GeneratorService} from "../../generator-input/generator.service";

@Component({
  selector: 'app-image2image',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './image2image.component.html',
  styleUrl: './image2image.component.scss'
})
export class Image2imageComponent implements OnInit{

  imagePath: string = ""
  prompt: string = "generate passport photo of the same man but 20 years younger"
  negative: string = "no other background than white"
  isGenerating: boolean = false;
  progress: number = 0;
  jobStatus = ""
  jobStage = ""
  base64GeneratedImage: string = '';

  constructor(private route: ActivatedRoute, private imageService: ImageService, private generatorService: GeneratorService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.imagePath = params.get('path')!;
    });
  }

  async generateImage() {
    this.isGenerating = true
    const imageRequest = new Image2ImageSettings(imageData);
    const blob = await this.imageService.fetchImage(this.imagePath);
    const base64String = await this.imageService.convertBlobToBase64String(blob);

    const imagePrompt = new ImagePrompt()
    imagePrompt.cn_img = base64String
    imageRequest.image_prompts.push(imagePrompt)

    console.log("Image prompts size: " + imageRequest.image_prompts.length)

    imageRequest.prompt = this.prompt
    imageRequest.negative_prompt = this.negative
    console.log(imageRequest)

    this.generatorService.generateImage2Image(imageRequest).subscribe(({
      next: (imageDataList) => {
        console.log(imageData);
        this.base64GeneratedImage = imageDataList[0].base64;
        this.isGenerating = false;
      },
      error: (err) => { console.log(err); this.isGenerating = false }
    }))
  }

}
