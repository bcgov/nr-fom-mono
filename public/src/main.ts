import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { bootstrapApplication } from '@angular/platform-browser';
import { ApiModule, Configuration } from '@api-client';
import { ErrorInterceptor } from '@public-core/interceptors/http-error.interceptor';
import { retrieveApiBasePath } from '@utility/services/config.service';
import { AppRoutingModule } from 'app/app-routing.module';
import { AppComponent } from 'app/app.component';
import { ProjectsModule } from 'app/applications/projects.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}
const apiConfig = new Configuration({
    basePath: retrieveApiBasePath()
});

// Bootstrap standalone root AppComponent.
bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true
        },
        importProvidersFrom(AppRoutingModule),
        importProvidersFrom(ProjectsModule),
        importProvidersFrom(ApiModule.forRoot(() => apiConfig)),
        importProvidersFrom(MatDialogModule),
        importProvidersFrom(MatSnackBarModule),
        importProvidersFrom(BsDatepickerModule.forRoot())
    ]
})