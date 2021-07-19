import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-group',
  template: `
  <div class="form-group" [class.invalid]="invalid">
    <label>{{label}}</label>
    <ng-content></ng-content>
  </div>
  `,
  styleUrls: ['./form-group.component.scss']
})
export class FormGroupComponent implements OnInit {
  @Input() invalid: boolean = false;
  @Input() label: string = ''

  constructor() { }

  ngOnInit(): void {
  }

}
