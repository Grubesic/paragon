import { Routes } from '@angular/router';
import {DashboardComponent} from "./modules/dashboard/dashboard.component";
import {DocumentationComponent} from "./modules/documentation/documentation.component";

export const routes: Routes = [
  { path: '', component: DashboardComponent},
  { path: 'dashboard', component: DashboardComponent, data: { icon: 'dashboard', name: 'Dashboard' }},
  { path: 'documentation', component: DocumentationComponent, data: { icon: 'menu_book', name: 'Documentation' }},
];
