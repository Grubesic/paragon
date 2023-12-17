import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";

import imageData from '../model/image-settings.json';
import {ImageSettings, JobProgressStatus} from "../model/models";
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
  prompt: string = 'generate photo realistic passport image mug shot of a old man in with black hair. The background has to be white and the whole head should be visible and in the middle of the picture';
  progress: number = 0;
  jobStatus = ""
  jobStage = ""

  constructor(private generatorService: GeneratorService) { }
  generateImage(){
    this.isGenerating = true;
    console.log(this.prompt);
    const imageSettings = new ImageSettings(imageData);

    imageSettings.prompt = this.prompt;

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
