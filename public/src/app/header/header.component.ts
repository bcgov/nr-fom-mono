import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ConfigService } from '@utility/services/config.service';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  environmentDisplay: string;

  constructor(private configService: ConfigService, public router: Router) {
    this.environmentDisplay = configService.getEnvironmentDisplay();
  }
}