import { Component, Input, OnInit } from '@angular/core';
import { StateService } from '@public-core/services/state.service';

@Component({
  selector: 'app-button',
  template: `
        <div class="btn-container">

   <button
            [disabled]="disabled"
            class="btn btn-primary ms-1"
            type="button"
          >
            <i class="spinner rotating" [hidden]="!stateSvc.loading"></i>
            <ng-content></ng-content>
          </button>
          <span title="{{title}}"></span>

        </div>

  `,
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() title: string;
  @Input() disabled: boolean;

  constructor(public stateSvc: StateService) { }

  ngOnInit(): void {
    // Deliberately empty
  }

}
