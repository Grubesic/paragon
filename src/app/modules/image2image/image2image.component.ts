import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {ImageService} from "../gallery/image.service";
import imageData from '../../model/image2image-settings.json'
import data from '../../model/data.json'

import {Image2ImageSettings, ImagePrompt} from "../../model/image2image";
import {GeneratorService} from "../../generator-input/generator.service";
import {ImageSettings, JobProgressStatus, JobResult} from "../../model/models";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {ImageSeed} from "../../model/imagedata";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";
import {MatSliderModule} from "@angular/material/slider";

@Component({
  selector: 'app-image2image',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCardModule, MatIconModule, MatProgressBarModule, MatInputModule, MatSelectModule, MatRadioModule, MatSliderModule],
  templateUrl: './image2image.component.html',
  styleUrl: './image2image.component.scss'
})
export class Image2imageComponent implements OnInit{

  imagePath: string = ""
  prompt: string = "generate passport photo of the same man but 20 years younger"
  negative: string = "(worst quality, low quality, normal quality, lowres, low details, oversaturated, undersaturated,\n" +
    "overexposed, underexposed, grayscale, bw, bad photo, bad photography, bad art:1.4),\n" +
    "(watermark, signature, text font, username, error, logo, words, letters, digits, autograph,\n" +
    "trademark, name:1.2), (blur, blurry, grainy), morbid, ugly, symmetrical, mutated malformed,\n" +
    "mutilated, poorly lit, bad shadow, draft, cropped, out of frame, cut off, censored, jpeg artifacts,\n" +
    "out of focus, glitch, duplicate, (airbrushed, cartoon, anime, semi-realistic, cgi, render, blender,\n" +
    "digital art, manga, amateur:1.3), (3D ,3D Game, 3D Game Scene, 3D Character:1.1), (bad hands,\n" +
    "bad iris, bad eyes, bad anatomy, bad body, bad face, bad teeth, bad arms, bad legs,\n" +
    "deformities:1.3), (open mouth)"
  isGenerating: boolean = false;
  progress: number = 0;
  jobStatus = ""
  jobStage = ""
  base64GeneratedImage: string = '';
  imageSeedData: ImageSeed = new ImageSeed();

  hairColor: string = "blonde"
  age: number = 0;
  hairLength: string = "short"
  nationality: string = "swedish"
  gender: string = "man"

  uploadedImagePath: string = ''

  constructor(private route: ActivatedRoute, private imageService: ImageService, private generatorService: GeneratorService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.imagePath = params.get('path')!;
      const imageData: ImageSeed [] = JSON.parse(JSON.stringify(data))
      console.log(imageData)

      const idString = this.retainOnlyNumbers(this.imagePath)

      for (const i of imageData){
        if(i.id == idString){
          this.imageSeedData = i;
          this.prompt = this.imageSeedData.prompt
          this.negative = this.imageSeedData.negative_prompt
          console.log("Found image seed")
          console.log(this.imageSeedData)
          break;
        }
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePath = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  /*async generateImage() {
    this.isGenerating = true
    this.base64GeneratedImage = ""
    const imageSettings = new Image2ImageSettings(imageData);
    const imageRequest = JSON.parse(JSON.stringify(imageSettings));
    const blob = await this.imageService.fetchImage(this.imagePath);
    const base64String = await this.imageService.convertBlobToBase64String(blob);

    const imagePrompt = new ImagePrompt()
    imagePrompt.cn_img = base64String
    imageRequest.image_prompts.push(imagePrompt)

    console.log("Image prompts size: " + imageRequest.image_prompts.length)

    imageRequest.prompt = this.prompt
    imageRequest.negative_prompt = this.negative
    imageRequest.image_seed = this.imageSeedData.seed
    console.log(imageRequest)

    this.generatorService.getJobs().subscribe({
      next: (jobStatus) => {
        console.log(jobStatus);
        let nextJobId = jobStatus.last_job_id + 1;
        console.log("Next job id: " + nextJobId)

        const intervalId = setInterval(() => {
          this.generatorService.getProgress(nextJobId.toString()).subscribe({

            next: (jobProgressStatus: JobProgressStatus) => {
              console.log(jobProgressStatus);
              if(jobProgressStatus.job_result != null ){
                clearInterval(intervalId);
                this.progress = 0
                this.jobStatus = ""
                this.jobStage = ""
              } else {
                if(jobProgressStatus.job_step_preview != null){
                  this.base64GeneratedImage = jobProgressStatus.job_step_preview
                }
                this.progress = jobProgressStatus.job_progress
                this.jobStatus = jobProgressStatus.job_status
                this.jobStage = jobProgressStatus.job_stage
              }
            },
            error: (err) => { console.log(err); }
          });

        }, 1000);

      },
      error: (err) => { console.log(err) }

    })

    this.generatorService.generateImage2Image(imageRequest).subscribe(({
      next: (imageDataList) => {
        console.log(imageData);
        this.base64GeneratedImage = imageDataList[0].base64;
        this.isGenerating = false;
      },
      error: (err) => { console.log(err); this.isGenerating = false }
    }))
  }*/

  generateImage(){
    this.isGenerating = true;
    const imageSettings = new ImageSettings(imageData);

    imageSettings.prompt = this.prompt;
    imageSettings.negative_prompt = this.negative
    imageSettings.image_seed = this.imageSeedData.seed

    console.log(imageSettings)

    this.generatorService.getJobs().subscribe({
      next: (jobStatus) => {
        console.log(jobStatus);
        let nextJobId = jobStatus.last_job_id + 1;
        console.log("Next job id: " + nextJobId)

        const intervalId = setInterval(() => {
          this.generatorService.getProgress(nextJobId.toString()).subscribe({

            next: (jobProgressStatus: JobProgressStatus) => {
              console.log(jobProgressStatus);
              if(jobProgressStatus.job_result != null ){
                clearInterval(intervalId);
                let jobResult: JobResult = jobProgressStatus.job_result[0]
                if(jobResult != null && jobResult.finish_reason == "SUCCESS" && jobResult.base64 != null)
                  this.base64GeneratedImage = jobResult.base64
                this.progress = 0
                this.jobStatus = ""
                this.jobStage = ""
              } else {
                if(jobProgressStatus.job_step_preview != null){
                  this.base64GeneratedImage = jobProgressStatus.job_step_preview
                }
                this.progress = jobProgressStatus.job_progress
                this.jobStatus = jobProgressStatus.job_status
                this.jobStage = jobProgressStatus.job_stage
              }
            },
            error: (err) => { console.log(err); }
          });

        }, 1000);

      },
      error: (err) => { console.log(err) }

    })

    this.generatorService.generateImage(imageSettings).subscribe(({
      next: (imageDataList) => {
        console.log(imageData);
        this.base64GeneratedImage = imageDataList[0].base64;
        this.isGenerating = false;
      },
      error: (err) => { console.log(err); this.isGenerating = false }
    }))
  }

retainOnlyNumbers(inputString: string): string {
    return inputString.replace(/[^\d]/g, '');
  }

}
