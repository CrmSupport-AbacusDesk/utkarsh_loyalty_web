import { Component, Inject, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { sessionStorage } from 'src/app/localstorage.service';
import * as moment from 'moment';
import { Location } from '@angular/common';
import { ToastrManager } from 'ng6-toastr-notifications';
import { OrderDetailComponent } from '../order/order-detail/order-detail.component';




@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {
  userData: any = {};
  orderData: any = {};
  tabActiveType: any = {};
  state_list: any = [];
  states: any = [];
  rsm_list: any;
  report_manager: any = [];

  district_list: any = [];
  city_list: any = [];
  area_list: any = [];
  pinCode_list: any = [];
  isslected;
  user_type;
  usertype = true;
  basicdetails = false;
  userrole;
  active: any = {};
  sales_type: any = [];
  reporting_sales_type: any = [];
  rsm: any = [];
  ass_user: any = [];
  tmp_userList: any = [];
  search: any = {};
  tmpsearch: any = {};
  submit = false;
  loader: any;
  module_name: any = [];
  access: any = {};
  exist: boolean = false;
  assign_module_data: any = [];
  segmentList: any = [];
  product_price_list: any = [];
  userId: any;
  userName: any;
  savingFlag: boolean = false;
  product_resp: boolean = false;
  assign_login_data: any = {};
  logined_user_data: any = {};
  Param_data: any = {};
  type: any = ''
  company_name: any = ''
  name: any = ''
  contact_person: any = ''
  order_id: any = ''
  dr_id: any = ''


  order_item: any = [];
  order_detail: any = {};
  filter: any = {};
  lastGstPercent: any = '';
  brandList: any = [];
  colorList: any = [];
  productlist: any = [];
  product_list: any = [];
  productlist2: any = [];
  total_qty: any = 0;
  netamount: any = 0;
  product_detail: any = {};
  addToListButton: boolean = true;
  order_total: any = ''
  tempSearch: any = '';
  fixedBrand: any = [];
  user_data: any = {};

  constructor(@Inject(MAT_DIALOG_DATA) public params: any, public dialogRef: MatDialogRef<OrderDetailComponent>, public serve: DatabaseService,
    private route: ActivatedRoute, public toast: ToastrManager, public location: Location, public session: sessionStorage, public rout: Router, public dialog: DialogComponent, public model: MatDialog) {
    this.orderData.state = params.state
    this.dr_id = params.dr_id
    this.orderData.order_id = params.order_id
    this.orderData.type = params.type
    this.orderData.company_name = params.company_name
    this.orderData.name = params.name
    this.orderData.contact_person = params.contact_person
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
  }

  tabActive(tab: any) {
    this.tabActiveType = {};
    this.tabActiveType[tab] = true;
  }

  ngOnInit() {
    this.orderDetail();
    // this.getSegment()
  }

  getSegment() {
    this.serve.post_rqst({}, "Order/getProductCategoryList").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.segmentList = result['result'];
      } else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }))
  }


  getProductList(lastGst) {
    this.filter.brand = this.order_detail.brand;
    this.filter.gst = lastGst;
    this.filter.fixed_brand = this.fixedBrand;
    this.filter.dr_id = this.order_detail.dr_id;
    this.filter.order_type = 'primary';
    this.serve.post_rqst({ 'filter': this.filter }, "Order/segmentItems").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.productlist = result['result'];
        this.productlist2 = result['result'];
      } else {
        this.toast.errorToastr(result['statusMsg'])
      }
    })
  }


  get_product_details(id) {
    this.orderData.brand = '';
    this.orderData.color = '';
    this.serve.post_rqst({ 'product_id': id, 'order_type': 'primary', 'brand': this.order_detail.brand }, "Order/segmentItemsDetails")
      .subscribe(resp => {
        if (resp['statusCode'] == 200) {
          this.product_detail = resp['result'];
          this.brandList = this.product_detail['brand'];
          this.colorList = this.product_detail['color'];
          this.orderData.product_code = this.product_detail.product_code;
          if (this.brandList.length == 1) {
            this.orderData.brand = this.brandList[0];
          }
          if (this.colorList.length == 1) {
            this.orderData.color = this.colorList[0];
          }

        } else {
          this.toast.errorToastr(resp['statusMsg'])
        }
      })
  }


  get_product_Size(dr_id, product_id) {
    this.serve.post_rqst({ 'state_name': '', 'dr_id': dr_id, 'category_id': this.product_detail.category_id, 'gst_percent': this.lastGstPercent, 'product_id': product_id }, "Order/segmentItemPriceWithoutFeatures").subscribe(resp => {
      if (resp['statusCode'] == 200) {
        this.product_resp = true
        this.product_list = resp['result'];
        this.orderData.dr_disc = this.product_list[0].dr_disc
        this.orderData.product_price = this.product_list[0].product_price;
        this.orderData.product_name = this.product_list[0].product_name;

        if (this.product_list.length > 0) {
          for (let i = 0; i < this.product_list.length; i++) {
            this.product_list[i].edit_true = false;
          }
        }
      } else {
        this.toast.errorToastr(resp['statusMsg'])
        this.product_resp = false;
      }
    },
      err => {
      })
  }

  save_order() {

    this.savingFlag = true;
    this.user_data.gst_percent = this.lastGstPercent;
    this.user_data.tcs_percent = this.order_detail.tcs_percent;
    this.user_data.cash_discount_percent = this.order_detail.cash_discount_percent;

    this.serve.post_rqst({ "cart_data": this.order_item, 'user_data': this.user_data, "orderId": this.orderData.order_id, }, "Order/primaryOrderAddItem").subscribe((resp) => {
      console.log(resp);
      if (resp['statusCode'] == 200) {
        let id = this.order_id
        this.toast.successToastr(resp['statusMsg']);
        this.dialogRef.close();
        this.savingFlag = false;
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
        this.savingFlag = false;
      }
    }, err => {
      this.savingFlag = false;

    })



  }

  orderDetail() {
    this.loader = 1;
    let id = { 'id': this.orderData.order_id }
    this.serve.post_rqst(id, "Order/primaryOrderDetail").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.order_item = result['result']['item_info'];
        this.order_detail = result['result'];
        for (let i = 0; i < this.order_item.length; i++) {
          this.order_item[i].product_price = this.order_item[i]['price'];
          this.lastGstPercent = this.order_item[i]['gst_percent'];
        }
        this.fixedBrand = [this.order_item[0]['brand']];

        setTimeout(() => {
          this.getProductList(this.lastGstPercent)
        }, 100);
      } else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }))
  }


  searchItems(event) {
    let item = event.target.value.toLowerCase();
    console.log(item);
    this.tempSearch = '';
    this.productlist = [];
    for (let x = 0; x < this.productlist2.length; x++) {
      this.tempSearch = this.productlist2[x].product_name.toLowerCase();
      if (this.tempSearch.includes(item)) {
        this.productlist.push(this.productlist2[x]);
      }
    }
  }

  addToList() {
    console.log(this.product_list);
    console.log(this.orderData);
    for (let i = 0; i < this.product_list.length; i++) {
      if (this.orderData.qty && this.orderData.product_price) {
        let existIndex = this.order_item.findIndex(row => row.product_id == this.product_list[i]['product_id'] && row.brand == this.orderData.brand && row.color == this.orderData.color);
        console.log(existIndex);
        if (existIndex == -1) {
          this.product_list[i]['product_name'] = this.orderData.product_name;
          // this.product_list[i]['segment_id'] = this.orderData.segment.id;
          this.product_list[i]['product_code'] = this.orderData.product_code;
          this.product_list[i]['discount_amount'] = this.product_list[i]['discounted_price'];
          this.product_list[i]['discount_percent'] = this.product_list[i]['dr_disc'];
          this.product_list[i]['qty'] = this.orderData.qty;
          this.product_list[i]['amount'] = parseFloat(this.product_list[i]['qty']) * (this.product_list[i]['net_price']).toFixed();
          this.product_list[i]['gst_amount'] = ((parseFloat(this.product_list[i]['amount']) * parseFloat(this.product_detail.gst)) / 100).toFixed();
          this.product_list[i].gst_percent = (this.product_detail.gst);
          this.product_list[i]['brand'] = this.orderData.brand;
          this.product_list[i]['color'] = this.orderData.color;
          this.product_list[i].total_amount = parseFloat(this.product_list[i].gst_amount) + parseFloat(this.product_list[i].amount);
          this.order_item.push(this.product_list[i]);
        }
        else {
          this.product_list[i]['product_name'] = this.orderData.product_name;
          // this.product_list[i]['segment_id'] = this.orderData.segment.id;
          // this.product_list[i]['segment_name'] = this.orderData.segmentName;
          this.product_list[i]['color'] = this.orderData.color;
          this.product_list[i]['brand'] = this.orderData.brand;
          this.product_list[i]['product_code'] = this.orderData.product_code;
          this.product_list[i]['discount_amount'] = this.product_list[i]['discounted_price'];
          this.product_list[i]['qty'] = this.orderData.qty;
          this.product_list[i]['discount_percent'] = this.product_list[i]['dr_disc'];
          this.order_item[existIndex]['qty'] = parseFloat(this.order_item[existIndex]['qty']) + parseFloat(this.product_list[i]['qty']);
          this.order_item[existIndex]['amount'] = parseFloat(this.order_item[existIndex]['amount']) + parseFloat(this.product_list[i]['qty']) * parseFloat(this.product_list[i]['net_price']);
          this.order_item[existIndex]['gst_amount'] = (parseFloat(this.order_item[existIndex]['amount']) * parseFloat(this.product_detail.gst)) / 100;
          this.order_item[existIndex].gst_percent = parseFloat(this.product_detail.gst);
          this.order_item[existIndex].total_amount = parseFloat(this.order_item[existIndex].gst_amount) + parseFloat(this.order_item[existIndex].amount);
        }

        console.log(this.order_item);



      }
    }
    // this.total_qty = 0;
    // this.netamount = 0;
    // this.order_total = 0;
    // this.total_gst_amount = 0;
    // this.total_Order_amount = 0;
    // this.order_discount = 0
    // for (let i = 0; i < this.order_item.length; i++) {
    //   this.total_qty = (parseFloat(this.total_qty) + parseFloat(this.order_item[i]['qty']));
    //   this.netamount = parseFloat(this.netamount) + parseFloat(this.order_item[i]['qty']) * parseFloat(this.order_item[i]['net_price']);
    //   this.order_total = parseFloat(this.order_total) + parseFloat(this.order_item[i]['amount']);
    //   this.total_Order_amount = parseFloat(this.total_Order_amount) + (parseFloat(this.order_item[i]['product_price']) * this.order_item[i]['qty']);
    //   this.total_gst_amount = parseFloat(this.order_item[i].gst_amount) + parseFloat(this.total_gst_amount);
    //   this.order_discount = parseFloat(this.order_item[i].discount_amount) * parseFloat(this.order_item[i]['qty']) + parseFloat(this.order_discount);
    // }
    // this.total_Order_amount = parseFloat(this.total_Order_amount);
    // this.order_discount = parseFloat(this.order_discount);
    // this.sub_total_before_cd = parseFloat(this.order_total);
    // this.cash_discount_percent = parseFloat(this.order_detail.cash_discount_percent);
    // this.cd_value = parseFloat(this.sub_total_before_cd) * parseFloat(this.cash_discount_percent) / 100;
    // this.sub_total_after_cd = parseFloat(this.sub_total_before_cd) - parseFloat(this.cd_value);
    // this.ins_value = parseFloat(this.sub_total_after_cd) * 0.06 / 100;
    // this.order_total = parseFloat(this.sub_total_after_cd) + parseFloat(this.ins_value)
    // this.total_gst_amount = parseFloat(this.order_total) * this.product_detail.gst / 100;
    // this.grand_total_before_tcs = (parseFloat(this.order_total) + parseFloat(this.total_gst_amount));
    // this.tcs_value = this.grand_total_before_tcs * this.order_detail.tcs_percent / 100;
    // this.order_grand_total = (parseFloat(this.grand_total_before_tcs) + (this.tcs_value));
    this.product_list = [];
    this.orderData.brand = '';
    this.orderData.color = '';
    this.orderData.qty = '';
    this.orderData.product_id = {};
    this.addToListButton = true;
  }

  deleteItem(i) {
    this.dialog.confirm("Delete Item From List?").then((result) => {
      if (result) {
        this.listDelete(i);
      }
    })
  }

  listDelete(i) {
    this.order_item.splice(i, 1);
  }

}
