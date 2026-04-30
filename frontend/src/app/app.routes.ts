import { Routes } from '@angular/router';
import { About } from './public/about/about';
import { Contact } from './public/contact/contact';
import { Home } from './public/home/home';
import { Dashboard } from './private/dashboard/dashboard';
import { Signin } from './public/signin/signin';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'about', component: About },
    { path: 'contact', component: Contact },
    { path: 'signin', component: Signin },
    { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
    

];


