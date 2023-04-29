import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { Location } from '@angular/common'
import { ToastrManager } from 'ng6-toastr-notifications';
import { StatusModalComponent } from '../status-modal/status-modal.component';



@Component({
  selector: 'app-secondary-order-detail',
  templateUrl: './secondary-order-detail.component.html'
})
export class SecondaryOrderDetailComponent implements OnInit {
  orderType:any ='order';
  status:any;
  id:any;
  login_data: any = [];
  secondaryOrderDetail: any = [];
  distributorInfo: any = []
  order_logs:any=[]
  item_details:any=[]
  editqty: any = false;
  Order_Amount:any;
  login_dr_id: any;
  skLoading:boolean = false;
  
  constructor(public route:ActivatedRoute,public location: Location, public serve:DatabaseService, public dialog: MatDialog,public session:sessionStorage ,public dialogs:DialogComponent,public toast:ToastrManager) { 
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value.data;
    
    if (this.login_data.access_level != '1') {
      this.login_dr_id = this.login_data.id;
    }
    this.route.params.subscribe( params => {
      this.status = this.route.queryParams['_value']['status'];
      
    });
    
  }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.serve.currentUserID = params['id']
      if (this.id)
      {
        // this.loader = true;
        this.getSecondaryOrderDetails();
      }
    });
  }
  
  getSecondaryOrderDetails(){
    this.skLoading = true;
    setTimeout(() => {
      this.serve.post_rqst({'id':this.id}, "Order/secondaryOrderDetail")
      .subscribe((result => {
        if(result['statusCode']==200){
          this.skLoading = false;
          this.secondaryOrderDetail = result['result']
          this.distributorInfo = result['result']['distributor_info']
          this.order_logs = result['result']['order_log']
          this.item_details = result['result']['item_info'];
          this.Order_Amount = Number(this.secondaryOrderDetail.order_total) + Number(this.secondaryOrderDetail.order_discount)

        }else{
          this.toast.errorToastr(result['statusMsg']);
          this.skLoading = false;
        }
      }))
    }, 2000);
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(StatusModalComponent, {
      width: '400px', data: {
        order_status: this.secondaryOrderDetail.order_status,
        order_id: this.id,
        from: 'Secondary_order',
        reason: ''
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      this.getSecondaryOrderDetails();
    });
  }
  edit_qty() {
    this.editqty = true;
  }
  deleteOrderitem(order_id, index) {
    this.dialogs.confirm("You want to delet this item !").then((result) => {
      if (result) {
        this.serve.post_rqst({ 'id': order_id }, "Order/secondaryOrderDeleteItem")
        .subscribe((result => {
          if(result['statusCode']==200){
            this.toast.successToastr(result['statuMsg']);
            this.item_details.splice(index, 1)
            this.getSecondaryOrderDetails();
          }else{
            this.toast.errorToastr(result['statuMsg'])
          }
          
        }))
      }
    })
  }
  Update_qty(id) {
    let index = this.item_details.findIndex(row => row.id == id)
    
    let cart_data = []
    let Amount = (this.item_details[index].qty*this.item_details[index].price)
    this.item_details[index].product_price = this.item_details[index].price
    this.item_details[index].discounted_price = this.item_details[index].discount_amount
    this.item_details[index].dr_disc = this.item_details[index].discount_percent
    this.item_details[index].total_amount = Amount;
    cart_data.push(this.item_details[index])
    
    this.serve.post_rqst({ 'id': id, 'cart_data': cart_data }, "Order/secondaryOrderUpdateItem").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.editqty = false;
        this.toast.successToastr('Quantity Updated Successfully');
      }
      else {
        this.editqty = false;
        this.toast.errorToastr(result['statusMsg']);
      }
    }))
  }
  back(): void {
    this.location.back()
  }
}
