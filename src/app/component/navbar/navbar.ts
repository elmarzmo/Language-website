import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  activeLang: string = 'EN';
  languages: string[] = ['EN', 'FR', 'AR'];

  setLang(lang: string): void {
    this.activeLang = lang;
  }
}