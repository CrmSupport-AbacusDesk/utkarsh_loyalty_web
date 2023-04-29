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
import { CheckinComponent } from '../checkin.component';
import { CheckinViewComponent } from '../../checkin-view/checkin-view.component';
import { CheckindocumentComponent } from 'src/app/checkindocument/checkindocument.component';

const checkinRoutes = [
  { path: "", component: CheckinComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
]
@NgModule({
  declarations: [CheckinComponent,CheckindocumentComponent, CheckinViewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(checkinRoutes),
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
  entryComponents:[
    CheckinViewComponent,
    CheckindocumentComponent
  ]
})
export class CheckinModule {constructor(){
  console.log('this is checkin module')
} }
