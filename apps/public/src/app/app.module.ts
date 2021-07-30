import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';

// modules
import { SharedModule } from './shared.module';
import { AppRoutingModule } from './app-routing.module';
import { ProjectsModule } from './applications/projects.module'; 
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

// components
import { HomeProxyComponent } from './home-proxy.component';
import { ApplicationsProxyComponent } from './applications-proxy.component';
import { AppComponent } from './app.component';
import { CommentModalComponent } from './comment-modal/comment-modal.component';
import { ContactComponent } from './contact/contact.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { HeaderComponent } from './header/header.component';
import { AboutComponent } from './about/about.component';
import { FooterComponent } from './footer/footer.component';

// services
import { UrlService } from '../core/services/url.service';
import { ApiModule, Configuration } from '@api-client'; 
import { ErrorInterceptor } from '../core/interceptors/http-error.interceptor';
import { FOMFiltersService } from '@public-core/services/fomFilters.service';
import { ConfigService, retrieveApiBasePath } from '@utility/services/config.service';

const apiConfig = new Configuration({
  basePath: retrieveApiBasePath()
});

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    ApiModule.forRoot(() => apiConfig),
    SharedModule,
    ProjectsModule,
    AppRoutingModule,
    RxReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  declarations: [
    HomeProxyComponent,
    ApplicationsProxyComponent,
    AppComponent,
    CommentModalComponent,
    ContactComponent,
    FileUploadComponent,
    HeaderComponent,
    AboutComponent,
    FooterComponent
  ],
  providers: [
    ConfigService,
    UrlService,
    FOMFiltersService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

export function easingLogic(
  t: number,
  b: number,
  c: number,
  d: number
): number {
  // easeInOutExpo easing
  if (t === 0) {
    return b;
  }
  if (t === d) {
    return b + c;
  }
  t /= d / 2;
  if (t < 1) {
    return (c / 2) * Math.pow(2, 8 * (t - 1)) + b;
  }
  return (c / 2) * (-Math.pow(2, -8 * --t) + 2) + b;
}
