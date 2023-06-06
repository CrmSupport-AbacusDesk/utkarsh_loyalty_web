import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute } from '@angular/router';
import { DialogComponent } from '../../dialog.component';
import { Router } from '@angular/router';
// import { $ } from 'protractor';
import * as $ from 'jquery';
import { sessionStorage } from 'src/app/localstorage.service';
import { Toastr, ToastrManager } from 'ng6-toastr-notifications';



@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  animations: [slideToTop()]

})
export class AddOrderComponent implements OnInit {

  pageType: any = '';
  data: any = {};
  add_list: any = [];
  savingFlag: boolean = false;
  networkType: any = [];
  Dist_state = '';
  conditionedItemHeader: any = {};
  product_detail: any = {};
  item_list: any = [];
  brandList: any = [];
  colorList: any = [];
  product_resp: boolean;
  addToListButton: boolean = true;
  product_list: any = [];
  without_segment: boolean = false;
  drList: any = [];
  constructor(public serve: DatabaseService, public toast: ToastrManager, public route: ActivatedRoute, public rout: Router, public dialog: DialogComponent, public session: sessionStorage) {

  }

  ngOnInit() {

  }

  back() {
    window.history.go(-1);
  }

  distributors(data, event) {
    this.data.type_name = []
    this.add_list = []
    this.data.segment = {}
    this.serve.post_rqst({ 'dr_type': data, 'search': (event && event.target.value) }, 'AppOrder/followupCustomer').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.drList = result['result'];
      } else {
        this.toast.errorToastr(result['statusMsg'])
      }
    });
  }



  get_item_list(event) {
    let search = event.text
    this.conditionedItemHeader.filter = {}
    this.conditionedItemHeader.filter.order_type = 'primary';
    this.conditionedItemHeader.filter.search = search;
    if (this.add_list.length > 0) {
      this.conditionedItemHeader.filter.gst = this.product_detail.gst
    }

    if (this.drList.length > 0) {
      let newIndex = this.drList.findIndex(row => row.id == this.data.type_name.id);
      this.conditionedItemHeader.filter.brand = this.drList[newIndex]['brand'] || this.data.type_name.brand;
      this.conditionedItemHeader.filter.dr_id = this.drList[newIndex]['id'];
    }

    this.serve.post_rqst(this.conditionedItemHeader, "AppOrder/segmentItems")
      .subscribe((resp) => {
        if (resp['statusCode'] == 200) {
          this.item_list = resp['result'];
          for (let index = 0; index < this.item_list.length; index++) {
            this.item_list[index].display_name = this.item_list[index].product_code + " " + this.item_list[index].display_name
          }
        } else {
          this.toast.errorToastr(resp['statusMsg']);
        }

      }, err => {

      })
  }


  get_product_details(event) {
    this.data.brand = '';
    this.data.color = '';
    this.serve.post_rqst({ 'product_id': event.id, 'order_type': 'primary', 'brand': this.data.type_name.brand }, "AppOrder/segmentItemsDetails")
      .subscribe(resp => {
        if (resp['statusCode'] == 200) {
          this.product_detail = resp['result'];
          this.brandList = this.product_detail['brand'];
          this.colorList = this.product_detail['color'];
          if (this.brandList.length == 1) {
            this.data.brand = this.brandList[0];
          }
          if (this.colorList.length == 1) {
            this.data.color = this.colorList[0];
          }

        } else {
          this.toast.errorToastr(resp['statusMsg'])
        }
      })
  }

  get_state_list(name) {
    this.Dist_state = this.data.type_name.state
  }
  get_product_Size(dr_id, product_id) {
    let Feature_Api = ""
    let Index = this.item_list.findIndex(row => row.id == this.data.product_id.id)
    if (Index != -1) {
      this.data.product_name = this.item_list[Index].product_name
      this.data.feature_apply = this.item_list[Index].feature_apply
      this.data.product_code = this.item_list[Index].product_code
    }
    this.serve.post_rqst({ 'state_name': this.Dist_state, 'dr_id': dr_id, 'category_id': this.product_detail.category_id, 'gst_percent': this.data.product_id.gst, 'product_id': this.data.product_id.id }, "AppOrder/segmentItemPriceWithoutFeatures")
      .subscribe(resp => {
        if (resp['statusCode'] == 200) {
          this.product_resp = true
          this.product_list = resp['result'];
          if (this.product_list.length > 0) {
            for (let i = 0; i < this.product_list.length; i++) {
              this.product_list[i].edit_true = false;
            }
          }
        } else {
          this.toast.errorToastr(resp['statusMsg'])
          this.product_resp = false
        }
      },
        err => {
        })
  }


  submitOrder() {

  }





}
