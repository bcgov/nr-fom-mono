import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../../../../libs/utility/src/services/config.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  environmentDisplay: string;

  constructor(private configService: ConfigService, public router: Router) {
    this.environmentDisplay = configService.getEnvironmentDisplay();
  }
}