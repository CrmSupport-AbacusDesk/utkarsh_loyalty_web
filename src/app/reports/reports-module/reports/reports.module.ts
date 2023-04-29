import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProuctWiseSecondaryReportComponent } from '../../prouct-wise-secondary-report/prouct-wise-secondary-report.component';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MaterialModule } from 'src/app/material';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MatDialogModule, MatIconModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';


const ReportsRoutes = [
  {path:"", children:[
    { path: "product-wise-secondary-report-list", component: ProuctWiseSecondaryReportComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
  // { path: "leave-Master-add", component: LeaveMasterAddComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
  // { path: "point-add/:id", component: PointCategoryAddComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
  ]}
] 
@NgModule({
  declarations: [ProuctWiseSecondaryReportComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ReportsRoutes),
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
export class ReportsModule { }
