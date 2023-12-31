import { Routes } from '@angular/router';
import {DashboardComponent} from "./modules/dashboard/dashboard.component";
import {DocumentationComponent} from "./modules/documentation/documentation.component";
import {VideoUploadComponent} from "./modules/video/video-upload/video-upload.component";
import {VideoListComponent} from "./modules/video/video-list/video-list.component";
import {VideoPlayerComponent} from "./modules/video/video-player/video-player.component";

export const routes: Routes = [
  { path: '', component: DashboardComponent},
  { path: 'dashboard', component: DashboardComponent, data: { icon: 'dashboard', name: 'Dashboard' }},
  { path: 'documentation', component: DocumentationComponent, data: { icon: 'menu_book', name: 'Documentation' }},
  { path: 'video-upload', component: VideoUploadComponent, data: { icon: 'video_call', name: 'Upload video' }},
  { path: 'video-list', component: VideoListComponent, data: { icon: 'video_library', name: 'Browse videos' }},
];


export const nonNavbarRoutes: Routes = [
  { path: 'video/:name', component: VideoPlayerComponent },
]
