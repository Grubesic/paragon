import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";

import imageData from '../model/image-settings.json';
import {ImageSettings, JobProgressStatus, JobResult} from "../model/models";
import {GeneratorService} from "./generator.service";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FormsModule} from "@angular/forms";
import {MatProgressBarModule} from "@angular/material/progress-bar";

@Component({
  selector: 'app-generator-input',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatDividerModule, MatProgressSpinnerModule, FormsModule, MatProgressBarModule],
  templateUrl: './generator-input.component.html',
  styleUrl: './generator-input.component.scss'
})
export class GeneratorInputComponent {

  base64GeneratedImage: string = '';
  isGenerating: boolean = false;
  prompt: string = "studio frontal portrait photo of a 45 year old portugise male, no smile, rosacea skin, natural hair,\n" +
    "portrait light, film still, white background, 2,5 meter distance";
  negative: string = "(worst quality, low quality, normal quality, lowres, low details, oversaturated, undersaturated,\n" +
    "overexposed, underexposed, grayscale, bw, bad photo, bad photography, bad art:1.4),\n" +
    "(watermark, signature, text font, username, error, logo, words, letters, digits, autograph,\n" +
    "trademark, name:1.2), (blur, blurry, grainy), morbid, ugly, asymmetrical, mutated malformed,\n" +
    "mutilated, poorly lit, bad shadow, draft, cropped, out of frame, cut off, censored, jpeg artifacts,\n" +
    "out of focus, glitch, duplicate, (airbrushed, cartoon, anime, semi-realistic, cgi, render, blender,\n" +
    "digital art, manga, amateur:1.3), (3D ,3D Game, 3D Game Scene, 3D Character:1.1), (bad hands,\n" +
    "bad iris, bad eyes, bad anatomy, bad body, bad face, bad teeth, bad arms, bad legs,\n" +
    "deformities:1.3), (open mouth)"
  progress: number = 0;
  jobStatus = ""
  jobStage = ""

  constructor(private generatorService: GeneratorService) { }
  generateImage(){
    this.isGenerating = true;
    console.log(this.prompt);
    const imageSettings = new ImageSettings(imageData);

    imageSettings.prompt = this.prompt;
    imageSettings.negative_prompt = this.negative

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
  stopJob(){
    this.generatorService.stopJob();
    this.isGenerating = false
  }
}
