import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { Auth } from './guards/auth';
import { Navbar } from "./component/navbar/navbar";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'language-website';
  isLoggedIn = false;

  constructor(
    private translate: TranslateService,
    private authService: Auth,
    private router: Router
  ) {
    this.translate.use('en');
    
    // Subscribe to login status
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }


}