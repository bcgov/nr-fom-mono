import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { StateService } from '@public-core/services/state.service';
import { ModalService } from '@public-core/services/modal.service';
import { HeaderComponent } from 'app/header/header.component';
import { FooterComponent } from 'app/footer/footer.component';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    HeaderComponent,
    FooterComponent
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    isReady$: Observable<boolean>;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(public router: Router, private stateSvc: StateService, private modalSvc: ModalService) {
  }

  async ngOnInit() {
    this.router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    });

    try {
      const codeTables = await this.stateSvc.getCodeTables().toPromise();
      this.stateSvc.setCodeTables(codeTables);
      this.stateSvc.setReady();
      this.isReady$ = this.stateSvc.isReady$;
    }
    catch(err) {
      this.modalSvc.showFOMinitFailure();
      console.error(err);
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
