import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AngularSplitModule } from 'angular-split';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { QuillModule } from 'ngx-quill';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ArticlesComponent } from './articles/articles.component';
import { CommentsComponent } from './comments/comments.component';
import {
  ComposeArticleComponent
} from './compose-article/compose-article.component';
import { LoggingComponent } from './logging/logging.component';
import { MaterialUiModule } from './material-ui/material-ui.module';
import { LoginComponent } from './login/login.component';
import { LoginGql, AuthService, AuthMiddleware } from './auth.service';
import { LoggingService } from './logging.service';
import { PagesComponent } from './pages/pages.component';
import { UsersComponent } from './users/users.component';
import { ComposePageComponent } from './compose-page/compose-page.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ArticlesComponent,
    CommentsComponent,
    ComposeArticleComponent,
    LoggingComponent,
    LoginComponent,
    PagesComponent,
    UsersComponent,
    ComposePageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    AngularSplitModule.forRoot(),
    HttpClientModule,
    ApolloModule,
    HttpLinkModule,
    QuillModule,
    MaterialUiModule
  ],
  providers: [
    {
      provide: AuthService,
      useFactory: (logger: LoggingService, loginGql: LoginGql) => {
        return new AuthService(logger, loginGql);
      },
      deps: [LoggingService, LoginGql]
    },
    {
      provide: AuthMiddleware,
      useFactory: (authService: AuthService) => new AuthMiddleware(authService),
      deps: [AuthService]
    },
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink, authMiddleware: AuthMiddleware) => {
        const http = httpLink.create({
          uri: "http://localhost:4000"
        });

        return {
          cache: new InMemoryCache(),
          link: authMiddleware.concat(http)
        }
      },
      deps: [HttpLink, AuthMiddleware]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
