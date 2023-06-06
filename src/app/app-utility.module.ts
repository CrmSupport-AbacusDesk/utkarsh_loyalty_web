import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { LoaderComponent } from './loader/loader.component';
import { MasterTabListComponent } from './master-tab-list/master-tab-list/master-tab-list.component';
import { MasterTabComponent } from './master-tab/master-tab/master-tab.component';
import { NotResultFoundComponent } from './not-result-found/not-result-found.component';
import { MyFilterPipe } from './shared/pipes/my-filter.pipe';
import { StatusModalComponent } from './order/status-modal/status-modal.component';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MaterialModule } from './material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatDialogModule } from '@angular/material';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { RedeemStatusModalComponent } from './redeem-status-modal/redeem-status-modal.component';
import { ImageModuleComponent } from './image-module/image-module.component';
import { OrderDetailComponent } from './order/order-detail/order-detail.component';
import { AgmCoreModule } from '@agm/core';
import { DistributionDetailComponent } from './distribution/distribution-detail/distribution-detail.component';
import { RouterModule } from '@angular/router';
import { RedeemRequestDetailComponent } from './redeem/redeem-request-detail/redeem-request-detail.component';
import { InfluencerDetailComponent } from './Influencer/influencer-detail/influencer-detail.component';
import { BillingDetailComponent } from './billing-detail/billing-detail.component';
// import { SalesReturnListComponent } from './sales-return/sales-return-list/sales-return-list.component';
import { CouponCodeAddComponent } from './coupon/coupon-code-add/coupon-code-add.component';
import { CouponCodeDetailComponent } from './coupon/coupon-code-detail/coupon-code-detail.component';
import { ReplacementComponent } from './coupon/replacement/replacement.component';

import { NgxBarcodeModule } from 'ngx-barcode';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { GatepassAddComponent } from './company-dispatch/gatepass-add/gatepass-add.component';
import { SecondaryOrderDetailComponent } from './order/secondary-order-detail/secondary-order-detail.component';
import { DesignationComponent } from './user/designation/designation.component';
import { AddDistributionComponent } from './distribution/add-distribution/add-distribution.component';
import { BottomSheetComponent } from './bottom-sheet/bottom-sheet.component';


@NgModule({
  declarations: [
    NotResultFoundComponent,
    LoaderComponent,
    AddDistributionComponent,
    MyFilterPipe,
    MasterTabComponent,
    MasterTabListComponent,
    StatusModalComponent,
    DesignationComponent,
    RedeemStatusModalComponent,
    ImageModuleComponent,
    DistributionDetailComponent,
    RedeemRequestDetailComponent,
    InfluencerDetailComponent,
    OrderDetailComponent,
    SecondaryOrderDetailComponent,
    BillingDetailComponent,
    CouponCodeAddComponent,
    // SalesReturnListComponent,
    GatepassAddComponent,
    CouponCodeDetailComponent,
    ReplacementComponent,
    BottomSheetComponent

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
    FilterPipeModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MaterialModule,
    AutocompleteLibModule,
    MatIconModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    NgxBarcodeModule,
    NgxQRCodeModule,
  ],
  exports:[
    NotResultFoundComponent,
    LoaderComponent,
    MyFilterPipe,
    FilterPipeModule,
    MasterTabComponent,
    MasterTabListComponent,
    DistributionDetailComponent,
    InfluencerDetailComponent,
    OrderDetailComponent,
  ],
  entryComponents:[StatusModalComponent, RedeemStatusModalComponent, ImageModuleComponent,DesignationComponent, BottomSheetComponent]

})
export class AppUtilityModule { }
