import { Component, Input } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-form-group',
    template: `
  <div class="form-group" [class.invalid]="invalid">
    <label>{{label}}</label>
    <ng-content></ng-content>
  </div>
  `
})
export class FormGroupComponent {
  @Input() invalid: boolean = false;
  @Input() label: string = ''

  constructor() { 
    // Deliberately empty
  }
}
