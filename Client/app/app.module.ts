import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import './shared/rxjs-extensions';
import { AppRoutingModule, RoutableComponents } from './app.routes';
import { AppComponent } from './app.component';
import { EmployeeService } from './services/employee.service';
import { HttpService } from './services/http.service';
import { CONFIG } from './constants/config';
import { AgGridModule } from 'ag-grid-angular/main';
import { AppCommonModule } from './components/common/common.module';
import { ErrorService } from './shared/error.service';
@NgModule({
    declarations: [
        AppComponent,
        RoutableComponents,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        RouterModule,
        AppRoutingModule,
        AppCommonModule,
        AgGridModule.withComponents([]),        
    ],
    providers: [
        EmployeeService,
        HttpService,
        ErrorService,
        CONFIG,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
