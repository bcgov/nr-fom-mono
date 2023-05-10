import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';

// modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AppRoutingModule } from './app-routing.module';
import { ProjectsModule } from './applications/projects.module';
import { SharedModule } from './shared.module';

// components
import { AppComponent } from './app.component';
import { CommentModalComponent } from './comment-modal/comment-modal.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

// services
import { ApiModule, Configuration } from '@api-client';
import { ErrorInterceptor } from '@public-core/interceptors/http-error.interceptor';
import { FOMFiltersService } from '@public-core/services/fomFilters.service';
import { UrlService } from '@public-core/services/url.service';
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
    MatFormFieldModule,

    HeaderComponent,
    FooterComponent
  ],
  declarations: [
    AppComponent
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

