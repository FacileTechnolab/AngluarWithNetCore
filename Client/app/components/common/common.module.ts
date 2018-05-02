import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import '../../shared/rxjs-extensions';
import { PagerComponent } from './pager.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        AngularFontAwesomeModule
    ],
    declarations: [
        PagerComponent,        
    ],
    exports: [
        PagerComponent,
        AngularFontAwesomeModule
    ]
})
export class AppCommonModule { }
