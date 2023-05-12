import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { ErrorInterceptor } from '@public-core/interceptors/http-error.interceptor';
import { AppComponent } from 'app/app.component';
import { environment } from './environments/environment';
import { ApiModule, Configuration } from '@api-client';
import { retrieveApiBasePath } from '@utility/services/config.service';
import { MatDialogModule } from '@angular/material/dialog';
import { AppRoutingModule } from 'app/app-routing.module';
import { ProjectsModule } from 'app/applications/projects.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';

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
        importProvidersFrom(MatSnackBarModule)
    ]
})