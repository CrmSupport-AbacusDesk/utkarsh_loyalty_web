import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import {  sessionStorage} from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-status-modal',
  templateUrl: './status-modal.component.html'
})
export class StatusModalComponent implements OnInit {
  savingFlag:boolean = false;
  segment:any={};
  category:any={};
  login:any={};
  delivery_from:any;
  userData: any;
  userId: any;
  userName: any;
  salesUser: any = [];
  assignDistArray: any = [];
  drlist: any =[];
  segmentList: any = [];
  
  constructor(@Inject(MAT_DIALOG_DATA)public data,public dialog:MatDialog,public serve:DatabaseService, public session: sessionStorage,public toast:ToastrManager, public dialogRef: MatDialogRef<StatusModalComponent>) { 
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.segment=this.data.segment;
    this.userId=this.userData['data']['id'];
    this.userName=this.userData['data']['name'];
    this.delivery_from=this.data.delivery_from;
  }
  
  ngOnInit() {
    if(this.delivery_from=='assignDist'){
      this.distributorDetail()
    }else if(this.delivery_from=='assignSales'){
      this.distributorDetail();
      this.getSalesUser('')
    }
    else if(this.delivery_from=='subcategory-list'){
      this.data.segment_id = this.data.master_category_id.toString(); 
      this.getSegment();
    }
    this.login=JSON.parse(localStorage.getItem('login'));
  }
  reason_reject:any
  primary_order_status_change(reason,status){
    this.savingFlag = true;
    this.serve.post_rqst({'reason':reason,'status':status,'id':this.data.order_id,'action_by':this.login.data.id ,'uid':this.userId,'uname':this.userName},"Order/primaryOrderStatusChange").subscribe((result=>{
      
      
      if(result['statusCode'] == 200){
        
        this.dialog.closeAll();
        this.savingFlag = false;
        this.toast.successToastr(result['statusMsg']);
      }
      else{
        this.savingFlag = false;
        this.toast.errorToastr(result['statusMsg'])
      }
      
    }))
    
  }
  secondary_order_status_change(reason,status){
    this.savingFlag = true;
    this.serve.post_rqst({'reason':reason,'status':status,'id':this.data.order_id,'action_by':this.login.data.id ,'uid':this.userId,'uname':this.userName},"Order/secondaryOrderStatusChange").subscribe((result=>{
      if(result['statusCode'] == 200){
        this.dialog.closeAll();
        this.savingFlag = false;
        this.toast.successToastr(result['statusMsg']);
      }
      else{
        this.savingFlag = false;
        this.toast.errorToastr(result['statusMsg'])
      }
    }))
  }
  
  getSalesUser(searcValue) {
    this.serve.post_rqst({ 'search': searcValue }, "CustomerNetwork/salesUserList").subscribe((response => {
      if(response['statusCode'] == 200){
        this.salesUser = response['all_sales_user'];
      }else{
        this.toast.errorToastr(response['statusMsg']);
      }
      
    }));
  }
  distributorDetail() {
    let id = { "id": this.data.drId }
    this.serve.post_rqst(id, "CustomerNetwork/distributorDetail").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.data = result['distributor_detail'];
        this.data.id = result['distributor_detail']['id'];
        this.data.assigned_sales_user_name = this.data['assigned_sales_user_name'].map(String);
      }
      else{
        this.toast.errorToastr(result['statusMsg'])
      }
      this.distributorList('',this.data.state)
    }
    )
  }
  distributorList(searcValue, state) {
    this.serve.post_rqst({ 'search': searcValue, 'state': state }, "CustomerNetwork/distributorsList").subscribe((result => {
      if(result['statusCode'] == 200){
        this.drlist = result['distributors'];
      }else{
        this.toast.errorToastr(result['statusMsg']);
      }
    }))
  }
  
  
  
  getSegment() {
    this.serve.post_rqst({}, "Master/getProductCategoryList").subscribe((result => {
      if(result['category_list']['statusCode'] ==  200){
        this.segmentList = result['category_list']['segment_list'];
      }
      else{
        this.savingFlag = false;
        this.toast.errorToastr(result['category_list']['statusCode'])
      }
    }))
  }
  UpdateSalesUser(){
    this.savingFlag = true;
   setTimeout(() => {
    this.serve.post_rqst({'drId':this.data.id,'userArray':this.data.assigned_sales_user_name, 'company_name':this.data.company_name},"CustomerNetwork/drUserAssign").subscribe((result=>{
      if(result['statusCode'] == 200){
        this.dialog.closeAll();
        this.savingFlag = false;
        this.toast.successToastr(result['statusMsg']);
      }
      else{
        this.savingFlag = false;
        this.toast.errorToastr(result['statusMsg'])
      }
    }))
   }, 2000);
  }
  // distArray(data){
  //   this.assignDistArray = []
  //   let index = this.drlist.findIndex(row => row.id == data)
  //   if(index != -1){
  //     this.assignDistArray.push(this.drlist[index].id)
  //   }
  // }
  UpdateDistributor(){
    this.savingFlag = true;
    this.serve.post_rqst({'drId':this.data.id,'distributorId':this.data.distributor_id},"CustomerNetwork/dealerDistributorAssign").subscribe((result=>{
      if(result['statusCode'] == 200){
        this.dialog.closeAll();
        this.savingFlag = false;
        this.toast.successToastr(result['statusMsg']);
      }
      else{
        this.savingFlag = false;
        this.toast.errorToastr(result['statusMsg'])
      }
    }))
  }
  
  add_segment(){
    this.savingFlag = true;
    this.data.created_by_name = this.userName;
    this.data.created_by_id = this.userId;
    this.serve.post_rqst(this.data,"Master/addCategory").subscribe((result=>{
      if(result['statusCode'] == 200){
        this.toast.successToastr(result['statusMsg']);
        this.savingFlag = false;
        this.dialogRef.close(true)
        this.serve.count_list();
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
        this.savingFlag = false;
      }
      
    }))
    
  }
  add_subCategory(){
    this.savingFlag = true;
    this.data.created_by_name = this.userName;
    this.data.created_by_id = this.userId;
    this.serve.post_rqst(this.data,"Master/addSubCategory").subscribe((result=>{
      if(result['statusCode'] == 200){
        this.toast.successToastr(result['statusMsg']);
        this.savingFlag = false;
        this.dialogRef.close(true)
        this.serve.count_list();
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
        this.savingFlag = false;
      }
      
    }))
    
  }
}
