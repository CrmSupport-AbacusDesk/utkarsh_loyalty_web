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
import { EditUserComponent } from '../edit-user/edit-user.component';
import { SaleUserDetailComponent } from '../sale-user-detail/sale-user-detail.component';
import { SaleUserListComponent } from '../sale-user-list/sale-user-list.component';
import { UserAddComponent } from '../user-add/user-add.component';
import { UserTargetComponent } from '../user-target/user-target.component';
import { SystemUserDetailComponent } from '../system-user-detail/system-user-detail.component';
import { SystemUserListComponent } from '../system-user-list/system-user-list.component';
import { DesignationComponent } from '../designation/designation.component';


const userRoutes = [
  { path: "", children:[
    { path: "", component: SaleUserListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: "user-add", component: UserAddComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: "sale-user-target/:id", component: UserTargetComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: "sale-user-detail/:id", children:[
      {path:'',component: SaleUserDetailComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
      { path: "user-edit/:id", component: EditUserComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    ]},
    { path: "system-user-detail/:id", component:SystemUserDetailComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
  { path: "system-user-list", component:SystemUserListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
  
  ]},
]


@NgModule({
  declarations: [
    SaleUserListComponent,
    SaleUserDetailComponent,
    UserAddComponent,
    EditUserComponent,
    UserTargetComponent,
    SystemUserDetailComponent,
    SystemUserListComponent,
   
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(userRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MaterialModule,
    AutocompleteLibModule,
    MatIconModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    AppUtilityModule
  ],entryComponents:[]
})
export class UserModule {constructor(){
} }
