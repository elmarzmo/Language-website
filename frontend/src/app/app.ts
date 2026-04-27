import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Navbar } from './component/navbar/navbar';
import { TranslateService } from '@ngx-translate/core';
import { Auth } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar],
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

  switchLanguage(lang: string) {
    this.translate.use(lang);

    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }
}