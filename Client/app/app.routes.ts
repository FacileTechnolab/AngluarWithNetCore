import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component';

const appRoutes: Routes = [
    { path: '', component: DashboardComponent},       
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule {
};

export const RoutableComponents = [
    DashboardComponent,    
];
