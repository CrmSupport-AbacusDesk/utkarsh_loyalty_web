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
import { addTravelListModal } from '../add-travel-list/add-travel-list-modal.component';
import { TravelListComponent } from '../travel-list/travel-list.component';
import { TravelPlanDetailComponent } from '../travel-plan-detail/travel-plan-detail.component';
import { TravelSubDetailComponent } from '../travel-sub-detail/travel-sub-detail.component';
import { TravelStatusModalComponent } from '../travel-status-modal/travel-status-modal.component';
const travelRoutes = [
  { path: "", children: [
  { path: "", component: TravelListComponent, canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
  {path:'add-tavel',component: addTravelListModal,canActivate:[AuthComponentGuard], data:{expectedRole:['1']}},
  {path:'travel-sub-detail/:id',children:[
    {path:'', component: TravelSubDetailComponent,canActivate:[AuthComponentGuard], data:{expectedRole:['1']}},
    {path:'travel-detail/:id',component: TravelPlanDetailComponent,canActivate:[AuthComponentGuard], data:{expectedRole:['1']}},
  ]}
  ]},
  ]

@NgModule({
  declarations: [
    addTravelListModal,
    TravelListComponent,
    TravelSubDetailComponent,
    TravelPlanDetailComponent,
    TravelStatusModalComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(travelRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MaterialModule,
    AutocompleteLibModule,
    MatIconModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    AppUtilityModule
  ],
  entryComponents:[TravelStatusModalComponent,addTravelListModal,TravelPlanDetailComponent]
})
export class TravelModule {constructor(){
  console.log('this is travel module')
} }
 