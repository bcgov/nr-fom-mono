import { Component } from '@angular/core';

/*
  This component intends to hold useful references/links for users.
  Currently it only holds two training (how-to) links for reviewer/submitter.
*/
@Component({
  standalone: true,
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  constructor() {
    // Deliberately empty
  }
}
