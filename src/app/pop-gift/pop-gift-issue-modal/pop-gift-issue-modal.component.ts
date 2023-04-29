import {Component,Inject,OnInit} from '@angular/core';
import {MatDialog,MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import * as moment from 'moment';
import {DialogComponent} from 'src/app/dialog.component';
import {DatabaseService} from 'src/_services/DatabaseService';
import {sessionStorage} from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';

const now = new Date();

@Component({
  selector: 'app-pop-gift-issue-modal',
  templateUrl: './pop-gift-issue-modal.component.html',
  styleUrls: ['./pop-gift-issue-modal.component.scss']
})
export class PopGiftIssueModalComponent implements OnInit {
  savingFlag:boolean = false;
  user_data: any = [];
  PopData: any = {};
  model_data: any = [];
  list: any = {};
  listarray: any = [];
  data1: any = {};
  loader: any;
  today_date: any;
  max: any;
  result: any = [];
  change: any = [];
  router: any;
  remaining_stock: any = [];
  list1: any = {};
  logIN_user: any;
  itemName: any;
  flag = 0;
  user_id:any=[];
  showItemInfo: boolean = false;
  stockData:any;
  constructor(public serve: DatabaseService,  public toast:ToastrManager,  @Inject(MAT_DIALOG_DATA) public data, public session: sessionStorage, public dialog: MatDialog, public dialogRef: MatDialogRef<PopGiftIssueModalComponent>,  public dialog1: DialogComponent) {
    
    
    if(data.type == 'Update_stock'){
      this.stockData = data.id;
      this.data1.totalAmt = this.stockData.amount
    }

    this.today_date = new Date().toISOString().slice(0, 10);
    this.get_data();
    this.logIN_user = JSON.parse(localStorage.getItem('st_user'));
    this.user_id=this.logIN_user['data']['id'];
    this.list.qty = 0;
  }
  
  ngOnInit() {
    
  }
  totalAmount(qty){
    console.log(qty)
    if((qty != undefined) && (qty != '')){
      this.data1.totalAmt = (parseInt(qty) + this.stockData.qty_stock) * this.stockData.rate;
    }else{
      this.data1.totalAmt = this.stockData.qty_stock * this.stockData.rate
    }
  }
  checkValue(){
    console.log('asdf adsf')
    if(this.list.qty>this.list.remaining_stock){
      this.toast.errorToastr('Quantity should be less then Stock Quantity');
    }
  }
  
  get_data() {
    this.serve.post_rqst({}, "PopGift/popGiftList").subscribe((result => {this.user_data = result['result']
    for(let i=0; i<this.user_data.length;i++){
      this.user_data[i].qty_stock=parseInt(this.user_data[i].qty_stock)
    }
    this.remaining_stock = this.user_data['qty_stock']
  }))
}

get_user() {
  this.serve.post_rqst({ 'user_id': this.user_id,'issue_type': this.PopData.issue_type}, "PopGift/getAllUser").subscribe((result => {
    if(result['statusCode']==200){
      this.model_data = result['result'];
    }else{
      this.toast.errorToastr(result['statusMsg']);
    }
  }))
  this.showItemInfo = false;
}

currentQty:any;
get_Stock(id) {
  this.serve.post_rqst({ 'id':id}, "PopGift/getPopStockQty").subscribe((result => {
    if(result['statusCode']==200){
      this.currentQty = result['result']['qty_stock'];
      this.list.remaining_stock = this.currentQty;
      this.list.remaining_stock  = parseInt(this.list.remaining_stock);
    }else{
      this.toast.errorToastr(result['statusMsg']);
    }
  }))
}

addtolist() {
  this.flag = 0;
  this.itemName;
  for (let i = 0; i < this.listarray.length; i++) {
    if ((this.list.item_id) == (this.listarray[i].item_id)) {
      this.flag++;
    }
  }
  
  if (this.flag == 1) {
    this.dialog1.error("Already Exist");
    
  } else {
    let index = this.user_data.findIndex(row => row.id == this.list.item_id)
    this.list.item_name = this.user_data[index].item_name;
    
    let index1 = this.listarray.findIndex(row => row.item_id == this.list.item_id);
    if (index1 == -1) {
      this.listarray.push(this.list);
    } else {
      this.listarray[index1].qty = this.listarray[index1].qty + this.list.qty;
      
      
    }
    this.list = {};
  }
}

delete(index) {
  this.listarray.splice(index, 1)
}


submit() {
  var local_data = {'issue_type': this.PopData.issue_type,'assign_id': this.PopData.user_id, 'delivery_note': this.PopData.delivery_note,
}
this.savingFlag = true;
this.serve.post_rqst({'item_list': this.listarray, 'user_data': local_data, 'created_by_name' : this.logIN_user.data.name, 'created_by_id' : this.logIN_user.data.id}, "PopGift/submitPopIssue").subscribe((result => {
  
  if(result['statusCode'] == 200){
    this.savingFlag = false;
    this.toast.successToastr(result['msg']);
    this.dialog.closeAll();
  }
  else{
    this.savingFlag = false;
    this.toast.errorToastr(result['msg']);
  }
  
  
  
}))
}

qtychange() {
  let index = this.user_data.findIndex(row => row.id == this.list.item_id);
  if (index != -1) {
    if (parseInt(this.user_data[index]['qty_stock']) < parseInt(this.list.qty)) {
      this.list.qty = parseInt(this.user_data[index]['qty_stock'])
    } else if (parseInt(this.list.qty) < 0) {
      this.list.qty = 0;
    }
  }
  
}

add_stock() {
  if(this.data1.qty == undefined){
    this.toast.errorToastr('QTY. is required');
    return;
  }
  this.data1.id = this.stockData.id
  this.data1.created_by_id = this.logIN_user.data.id;
  this.data1.created_by_name = this.logIN_user.data.name;
  
  this.savingFlag = true;
  this.serve.post_rqst({'data':this.data1}, "PopGift/submitStock").subscribe((result => {
    if(result['statusCode'] == 200){
      this.savingFlag = false;
      this.toast.successToastr(result['statusMsg']);
      this.dialog.closeAll();
    }
    
    else{
      this.dialogRef.disableClose = false;
      this.savingFlag = false;
      this.toast.errorToastr(result['statusMsg']);
    }
  }))
  
}


}
