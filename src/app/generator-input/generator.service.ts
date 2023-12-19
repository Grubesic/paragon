import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ImageData, ImageSettings, JobProgressStatus, JobStatus} from "../model/models";
import {Image2ImageSettings} from "../model/image2image";

@Injectable({
  providedIn: 'root'
})
export class GeneratorService {
  private apiUrl = 'https://minitasa.site';
  constructor(private http: HttpClient) { }

  generateImage(imageSettings: ImageSettings) {
    return this.http.post<ImageData[]>(`${this.apiUrl}/v1/generation/text-to-image`, imageSettings);
  }

  generateImage2Image(imageSettings: Image2ImageSettings) {
    return this.http.post<ImageData[]>(`${this.apiUrl}/v2/generation/image-prompt`, imageSettings);
  }

  getJobs() {
    return this.http.get<JobStatus>(`${this.apiUrl}/v1/generation/job-queue`);
  }

  getProgress(jobId: string) {
    return this.http.get<JobProgressStatus>(`${this.apiUrl}/v1/generation/query-job?job_id=${jobId}&require_step_preivew=true`);
  }

  stopJob(){
    return this.http.post(`${this.apiUrl}/v1/generation/stop`, "");
  }

}
