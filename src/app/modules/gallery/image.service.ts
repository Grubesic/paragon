import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private folderPath = 'assets/photos/';

  constructor(private http: HttpClient) {}

  getImages(): string[] {
    const imageNames: string[] = [];

    for (let i = 1; i <= 48; i++) {
      imageNames.push(`${this.folderPath}image${i}.png`);
    }

    return imageNames;
  }

  fetchImage(url: string): Promise<Blob> {
    return firstValueFrom(this.http.get(url, { responseType: 'blob' }));
  }

  convertBlobToBase64String(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64String = result.split(',')[1]; // Extract the base64 part
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob); // Read the blob as a Data URL
    });
  }

}
