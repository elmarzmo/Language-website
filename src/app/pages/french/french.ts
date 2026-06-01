import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-french',
  imports: [TranslateModule, RouterLink],
  templateUrl: './french.html',
  styleUrl: './french.css',
})
export class French {

}
