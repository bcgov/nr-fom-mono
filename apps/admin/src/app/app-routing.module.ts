import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {NotAuthorizedComponent} from './not-authorized/not-authorized.component';
import {SearchComponent} from './search/search.component';

const routes: Routes = [
  {
    path: 'not-authorized',
    component: NotAuthorizedComponent
  },
  {
    // default route
    path: 'admin',
    component: SearchComponent
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    // default route
    path: '',
    component: SearchComponent
  },
  {
    // wildcard route
    path: '**',
    redirectTo: '/',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}
