import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { AuthGuard } from './auth.guard';
import { CommonService } from '../services/commonService';
import { TranslationLoaderService } from '../services/translationLoader.service';
import { ApiManager } from '../services/api-manager.service';
import { SecurityAccessDirective } from '../services/security-access.directive';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { SharedModule } from './common/common.module';
import { LoaderComponent } from './admin/loader/loader.component';
import { CookieService, CookieModule } from 'ngx-cookie';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

export function HttpLoaderFactory(http: HttpClient) {
  // return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    SecurityAccessDirective,
    LoaderComponent
  ],
  imports: [
    BrowserAnimationsModule ,
    FormsModule,
    RouterModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    CookieModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClientModule]
      }
  }),
  NgbModule.forRoot(),
  AppRoutingModule
  ],
  providers: [AuthGuard, CommonService, TranslationLoaderService, ApiManager, CookieService,BsDatepickerConfig],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }

