import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';

import { Auth } from './guards/auth';
import { Navbar } from "./component/navbar/navbar";
import { Footer } from './component/footer/footer';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, CommonModule, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Voixa-English';
  isLoggedIn = false;

  constructor(
    
    private authService: Auth,
    private router: Router
  ) {
    
    
    // Subscribe to login status
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
    )
    .subscribe(() => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      window.scrollTo(0, 0);
    }
      );
  }


}