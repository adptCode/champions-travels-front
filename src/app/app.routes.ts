import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { EventsPageComponent } from './pages/events-page/events-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';

export const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'profile', component: ProfilePageComponent},
  {path: 'events', component: EventsPageComponent},
  {path: 'register', component: RegisterPageComponent},
  {path: 'login', component: LoginPageComponent}
];
