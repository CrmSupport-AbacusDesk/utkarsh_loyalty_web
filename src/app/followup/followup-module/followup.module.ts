import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { MaterialModule } from 'src/app/material';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { FollowupDetailComponent } from '../followup-detail/followup-detail.component';
import { FollowupListComponent } from '../followup-list/followup-list.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FollowupEditComponent } from '../followup-edit/followup-edit.component';
import { DistributionDetailComponent } from 'src/app/distribution/distribution-detail/distribution-detail.component';
import { AgmCoreModule } from '@agm/core';
import { OrderDetailComponent } from 'src/app/order/order-detail/order-detail.component';
import { AddDistributionComponent } from 'src/app/distribution/add-distribution/add-distribution.component';
import { SecondaryOrderDetailComponent } from 'src/app/order/secondary-order-detail/secondary-order-detail.component';
const followupRoutes = [
  { path: "", children:[
    { path: "", component: FollowupListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: "followup-detail/:id", component: FollowupDetailComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1','2']}},
    { path: "distribution-detail/:id", children:[
      {path:"", component: DistributionDetailComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1','2']}},
      {path:'order-detail/:id', component:OrderDetailComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1','2']}},
      {path:'secondary-order-detail/:id', component:SecondaryOrderDetailComponent ,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1','2']}},
      { path: "edit-distribution/:type/:id/:pageType", component: AddDistributionComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},

    ]},

  ]},
]
@NgModule({
  declarations: [
    FollowupListComponent,
    FollowupDetailComponent,
    FollowupEditComponent,
    
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAZ-kqYo3DslRI2VIuvP5GIK7OK-U9n3AQ'
      /* apiKey is required, unless you are a
      premium customer, in which case you can
      use clientId
      */
  }),
    CommonModule,
    RouterModule.forChild(followupRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MaterialModule,
    AutocompleteLibModule,
    MatIconModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    AppUtilityModule,
    InfiniteScrollModule,
  ],
  entryComponents:[FollowupEditComponent]
})
export class FollowupModule {constructor(){
  console.log('followup module')
} }
