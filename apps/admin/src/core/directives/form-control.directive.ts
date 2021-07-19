import { HostBinding, Input } from '@angular/core';
import { Directive, ElementRef, HostListener } from '@angular/core';
import { AbstractControl, FormControl, NgControl } from '@angular/forms';

@Directive({
  selector: '[appFormControl]'
})
export class AppFormControlDirective {
  private _fc: AbstractControl;

  @HostBinding( 'class.is-invalid' )
  get isInvalid() {
    return this._fc.touched && this._fc.invalid;
  }

  @HostBinding( 'class.invalid' )
  get invalid() {
    return this._fc.touched && this._fc.invalid;
  }
  @Input() set appFormControl( fc: AbstractControl ) {

    this._fc = fc;
  }

  constructor() { }

}
