import { Component, Input } from '@angular/core';
import { StateService } from '@admin-core/services/state.service';

@Component({
    standalone: true,
    selector: 'app-button',
    template: `
        <div class="btn-container">

   <button
            [disabled]="disabled"
            class="btn btn-primary ml-1"
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
export class ButtonComponent {
  @Input() title: string;
  @Input() disabled: boolean;

  constructor(public stateSvc: StateService) { }

}
