import { APP_INITIALIZER, ApplicationRef, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

// modules
import { SharedModule } from "./shared.module";
import { FomModule } from "./foms/fom.module";
import { AppRoutingModule } from "./app-routing.module";

// components
import { AppComponent } from "./app.component";
import { SearchComponent } from "./search/search.component";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";

// // services
// import { KeycloakService } from "../core/services/keycloak.service";
import { CognitoService } from "../core/services/cognito.service";

import {
  ConfigService,
  retrieveApiBasePath,
} from "@utility/services/config.service";

// import { TokenInterceptor } from "../core/utils/token-interceptor";
import { CognitoTokenInterceptor } from "../core/utils/cognito-token-interceptor";
import { NotAuthorizedComponent } from "./not-authorized/not-authorized.component";
import { ApiModule, Configuration } from "@api-client";
import { ErrorInterceptor } from "../core/interceptors/http-error.interceptor";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";

// export function kcFactory(keycloakService: KeycloakService) {
//   return () => keycloakService.init();
// }

export function cogFactory(cognitoService: CognitoService) {
  return () => cognitoService.init();
}

const apiConfig = new Configuration({
  basePath: retrieveApiBasePath(),
});

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    HeaderComponent,
    FooterComponent,
    NotAuthorizedComponent,
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
    // NgxPaginationModule,
    AppRoutingModule,
    RxReactiveFormsModule,
    // LeafletModule
  ],
  providers: [
    // KeycloakService,
    CognitoService,
    {
      provide: APP_INITIALIZER,
      useFactory: cogFactory,
      deps: [CognitoService],
      multi: true,
    },
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: kcFactory,
    //   deps: [KeycloakService],
    //   multi: true,
    // },
    // Order of these interceptors is critical - token interceptor must be last, after error interceptor.
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CognitoTokenInterceptor,
      multi: true,
    },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: TokenInterceptor,
    //   multi: true,
    // },
    ConfigService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(applicationRef: ApplicationRef) {
    Object.defineProperty(applicationRef, "_rootComponents", {
      get: () => applicationRef.components,
    });
  }
}
