import {Component, OnInit} from '@angular/core';
import {StateService} from '../core/services/state.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isReady$: Observable<boolean>;

  constructor(private stateSvc: StateService) {
  }

  async ngOnInit() {
    const codeTables = await this.stateSvc.getCodeTables().toPromise();
    this.stateSvc.setCodeTables(codeTables);
    this.stateSvc.setReady();
    this.isReady$ = this.stateSvc.isReady$;
  }
}