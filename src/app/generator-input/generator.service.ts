import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ImageData, ImageSettings, JobProgressStatus, JobStatus} from "../model/models";

@Injectable({
  providedIn: 'root'
})
export class GeneratorService {
  private apiUrl = 'https://minitasa.site';
  constructor(private http: HttpClient) { }

  generateImage(imageSettings: ImageSettings) {
    return this.http.post<ImageData[]>(`${this.apiUrl}/v1/generation/text-to-image`, imageSettings);
  }

  getJobs() {
    return this.http.get<JobStatus>(`${this.apiUrl}/v1/generation/job-queue`);
  }

  getProgress(jobId: string) {
    return this.http.get<JobProgressStatus>(`${this.apiUrl}/v1/generation/query-job?job_id=${jobId}&require_step_preivew=true`);
  }

}
