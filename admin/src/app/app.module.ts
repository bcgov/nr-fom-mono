import { ApplicationRef, APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// modules
import { AppRoutingModule } from './app-routing.module';
import { FomModule } from './foms/fom.module';
import { SharedModule } from './shared.module';

// components
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SearchComponent } from './search/search.component';

// services
import { CognitoService } from "../core/services/cognito.service";

import { retrieveApiBasePath } from '@utility/services/config.service';

import { ApiModule, Configuration } from '@api-client';
import { ErrorInterceptor } from '../core/interceptors/http-error.interceptor';
import { CognitoTokenInterceptor } from "../core/utils/cognito-token-interceptor";
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';

function cognitoFactory(cognitoService: CognitoService) {
  return () => cognitoService.init();
}

const apiConfig = new Configuration({
  basePath: retrieveApiBasePath()
})

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    HeaderComponent,
    FooterComponent,
    NotAuthorizedComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    FomModule,
    ReactiveFormsModule,
    NgbModule,
    ApiModule.forRoot(() => apiConfig),
    AppRoutingModule,
    RxReactiveFormsModule

  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: cognitoFactory,
      deps: [CognitoService],
      multi: true,
    },
    // Order of these interceptors is critical - token interceptor must be last, after error interceptor.
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CognitoTokenInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(applicationRef: ApplicationRef) {
    Object.defineProperty(applicationRef, '_rootComponents', {get: () => applicationRef.components});
  }
}