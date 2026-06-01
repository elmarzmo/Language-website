import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-english',
  imports: [TranslateModule, RouterLink],
  templateUrl: './english.html',
  styleUrl: './english.css',
})
export class English {

}
