import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-spanish',
  imports: [TranslateModule, RouterLink],
  templateUrl: './spanish.html',
  styleUrl: './spanish.css',
})
export class Spanish {

}
