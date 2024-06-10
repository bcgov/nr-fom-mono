import { Component } from '@angular/core';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  public faArrowUpRightFromSquare = faArrowUpRightFromSquare;
  constructor() {
    // Deliberately empty
  }
}
