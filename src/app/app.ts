import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './component/navbar/navbar';
import { TranslateService } from '@ngx-translate/core';
import { Footer } from './component/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'language-website';

  constructor(private translate: TranslateService) {
    
    this.translate.use('en');
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