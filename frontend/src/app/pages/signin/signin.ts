import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './signin.html',
  styleUrls: ['./signin.css']
})
export class Signin {
  activeTab: 'login' | 'signup' = 'login';

  switchTab(tab: 'login' | 'signup'): void {
    this.activeTab = tab;
  }
}