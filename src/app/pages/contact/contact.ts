import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {

}
