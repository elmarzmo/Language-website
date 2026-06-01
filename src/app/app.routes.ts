import { Routes } from '@angular/router';
import { About } from './pages/about/about';
import { Contact } from './pages/contact/contact';
import { Home } from './pages/home/home';
import {English} from './pages/english/english';
import { Spanish } from './pages/spanish/spanish';
import { French } from './pages/french/french';
import { German } from './pages/German/german';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'about', component: About },
    { path: 'contact', component: Contact },
    { path: 'languages/english', component: English },
    { path: 'languages/french', component: French },
    { path: 'languages/spanish', component: Spanish },
    { path: 'languages/german', component: German }
    

];


