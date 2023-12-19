import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ImageService} from "./image.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements OnInit{
  images: string[] = [];

  constructor(private imageService: ImageService, private router: Router) {}

  ngOnInit(): void {
    this.images = this.imageService.getImages();
  }

  onImageClick(image: string) {
    console.log('Clicked image:', image);
    this.router.navigate(['/image2image', image]);

  }

}
