import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-german',
  imports: [TranslateModule, RouterLink],
  templateUrl: './german.html',
  styleUrl: './german.css',
})
export class German {

}
