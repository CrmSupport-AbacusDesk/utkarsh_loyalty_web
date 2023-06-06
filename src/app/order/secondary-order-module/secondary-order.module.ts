import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { MaterialModule } from 'src/app/material';
import { SecondaryOrderListComponent } from '../secondary-order-list/secondary-order-list.component';
import { SecondaryOrderDetailComponent } from '../secondary-order-detail/secondary-order-detail.component';

const secondaryOrdersRoutes = [
  { path: "", children:[
    { path: "", component:SecondaryOrderListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: "secondary-order-detail/:id", component:SecondaryOrderDetailComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
  ]},
]
@NgModule({
  declarations: [
    SecondaryOrderListComponent,
    // SecondaryOrderDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(secondaryOrdersRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MaterialModule,
    AutocompleteLibModule,
    MatIconModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    AppUtilityModule
  ]
})
export class SecondaryOrderModule {constructor(){
  console.log('this is secondary order module')
} }
