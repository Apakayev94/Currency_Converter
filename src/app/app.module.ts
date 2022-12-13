import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { headerComponents } from './header/header.component';
import { navComponents } from './nav/nav.component';
import { mainComponents } from './main/main.component';
import { footerComponents } from './footer/footer.component';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    headerComponents,
    navComponents,
    mainComponents,
    footerComponents
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
