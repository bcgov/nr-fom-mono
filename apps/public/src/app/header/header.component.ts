import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@public-core/services/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(public api: ApiService, public router: Router) {}
}