import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { EventsPageComponent } from './pages/events-page/events-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { AdminEventListComponent } from './components/admin/admin-event-list/admin-event-list.component';
import { AdminEventFormComponent } from './components/admin/admin-event-form/admin-event-form.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';

export const routes: Routes = [
  {path: 'home', component: HomePageComponent},
  {path: 'profile', component: ProfilePageComponent, canActivate: [authGuard]},
  {path: 'events', component: EventsPageComponent, canActivate: [authGuard]},
  { path: 'events/:id', component: EventDetailsComponent, canActivate: [authGuard]},
  {path: 'admin', component: AdminPageComponent, canActivate: [authGuard, adminGuard]},
  {path: 'admin/events', component: AdminEventListComponent, canActivate: [authGuard, adminGuard]},
  { path: 'admin/event-add', component: AdminEventFormComponent, canActivate: [authGuard, adminGuard] },
  {path: 'admin/event-edit/:id', component: AdminEventFormComponent, canActivate: [authGuard, adminGuard]},
  {path: 'register', component: RegisterPageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'}
];
