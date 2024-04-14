import { Routes } from '@angular/router';
import {DashboardComponent} from "./modules/dashboard/dashboard.component";
import {DocumentationComponent} from "./modules/documentation/documentation.component";
import {VideoUploadComponent} from "./modules/video/video-upload/video-upload.component";
import {VideoListComponent} from "./modules/video/video-list/video-list.component";
import {VideoPlayerComponent} from "./modules/video/video-player/video-player.component";
import {authGuard} from "./core/auth/auth.guard";
import {AuthGuardService} from "./core/auth/authguard.service";
import {ChatComponent} from "./modules/chat/chat.component";
import {MapComponent} from "./modules/map/map.component";
import {WeatherComponent} from "./modules/weather/weather.component";

export const routes: Routes = [
  { path: '', component: MapComponent, canActivate: [AuthGuardService] },
  { path: 'dashboard', component: DashboardComponent, data: { icon: 'dashboard', name: 'Dashboard' }, canActivate: [AuthGuardService] },
  { path: 'map', component: MapComponent, data: { icon: 'map', name: 'Map' }, canActivate: [AuthGuardService] },
  { path: 'weather', component: WeatherComponent, data: { icon: 'wb_cloudy', name: 'Weather' }, canActivate: [AuthGuardService] },
  { path: 'documentation', component: DocumentationComponent, data: { icon: 'menu_book', name: 'Documentation' }, canActivate: [AuthGuardService] },
  { path: 'video-upload', component: VideoUploadComponent, data: { icon: 'video_call', name: 'Upload video' }, canActivate: [AuthGuardService] },
  { path: 'video-list', component: VideoListComponent, data: { icon: 'video_library', name: 'Browse videos' }, canActivate: [AuthGuardService] },
];

export const nonNavbarRoutes: Routes = [
  { path: 'video/:name', component: VideoPlayerComponent, canActivate: [AuthGuardService] },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuardService] },
];
