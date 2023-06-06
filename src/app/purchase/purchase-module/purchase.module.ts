import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { PurchaseListComponent } from '../purchase-list/purchase-list.component';
import { RouterModule } from '@angular/router';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { MaterialModule } from 'src/app/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material';
import { ChangeStatusComponent } from '../change-status/change-status.component';
import { InfluencerDetailComponent } from 'src/app/Influencer/influencer-detail/influencer-detail.component';



const purchaseRoutes = [
  { path: "", children:[
    {path:'', component: PurchaseListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    {path:'influencer-detail/:id/:type_id', component: InfluencerDetailComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},


  ]
  }
]

@NgModule({
  declarations: [PurchaseListComponent,
    ChangeStatusComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(purchaseRoutes),
    AppUtilityModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  entryComponents:[
    ChangeStatusComponent,

  ]
})
export class PurchaseModule { }
