import {Component,Inject,OnInit} from '@angular/core';
import {MatDialog,MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DatabaseService} from 'src/_services/DatabaseService';
import {sessionStorage} from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import {DialogComponent} from 'src/app/dialog.component';


@Component({
  selector: 'app-gatepass-add',
  templateUrl: './gatepass-add.component.html'
})
export class GatepassAddComponent implements OnInit {
  skLoading:boolean = false;
  savingFlag:boolean = false;
  gatePassAssign:any =[];
  data:any ={};
  assign_login_data:any={};
  logined_user_data:any={};
  driver:any =[];
  modalData:any ={};
  branchData:any =[];
  itemData:any =[];
  
  
  constructor(public service: DatabaseService, public toast:ToastrManager,  @Inject(MAT_DIALOG_DATA) public modal_data, public session: sessionStorage, public dialog: MatDialog, public dialogRef: MatDialogRef<GatepassAddComponent>,  public dialog1: DialogComponent) {
    this.modalData = modal_data;
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    if(this.logined_user_data.id != '1'){
      this.driverInfo();
    }
    // if(this.logined_user_data.id == '1'){
    //   this.branchInfo();
    // }
    
    
    if(this.modalData.model_type == 'add'){
      this.gatePassAssign = modal_data.gatePassAssign;
    }
    if(this.modalData.model_type == 'sales_return'){
      this.getSaleReturn()
    }
    if(this.modalData.gatepass_id){
      this.getDetails();
    }
  }
  ngOnInit() {
  }
  
  
  
  
  
  findInfo(id){
    let index=  this.driver.findIndex(row=>row.id==id);
    if(index!= -1){
      this.data.mobile_number= this.driver[index].mobile_number;
      this.data.vehicle_number= this.driver[index].vehicle_number;
      this.data.transportation_mode= this.driver[index].transportation_mode;
      this.data.delivery_boy_name= this.driver[index].delivery_boy_name;
    }
  }
  
  
  submitDetail() {
    let alertText
    
    if(this.data.id){
      alertText = "You want to update gatepass?"
    }
    else{
      alertText = "You want to genrate gatepass?"
    }
    
    this.dialog1.confirm(alertText).then((result)=>{
      if(result){
        if(this.logined_user_data.id == '1'){
          this.data.branch_code = this.data.branch_code
        }
        else{
          this.data.branch_code = this.logined_user_data.branch_code;
        }
        this.data.created_by_name=this.logined_user_data.name;
        this.data.created_by_id=this.logined_user_data.id;
        this.savingFlag = true;
        this.dialogRef.disableClose = true;
        let header
        if(this.data.id){
          header =  this.service.post_rqst({'data':this.data}, "Dispatch/updateGatePass")
        }
        else{
          this.data.invoice_data = this.gatePassAssign;
          header =  this.service.post_rqst({'data':this.data}, "Dispatch/generateGatePass")
        }
        
        header.subscribe((response => {
          if(response['statusCode']=="200"){
            this.toast.successToastr(response['statusMsg']);
            this.dialogRef.close();
            this.savingFlag = false;
          }
          else{
            this.toast.errorToastr(response['statusMsg']);
            this.savingFlag = false;
          }
        }));
      }
    });
  }
  
  getSaleReturn() {
    this.skLoading = true;
      this.service.post_rqst({'invoice_number':this.modal_data.invoice_number}, "Dispatch/getSalesReturnDetails").subscribe((result => {
        if(result['statusCode']==200){
          this.itemData = result['result'];
          this.skLoading = false;
        }else{
          this.toast.errorToastr(result['statusMsg']);
          this.skLoading = false;
        }
      }))
  }
  
  
  
  gatePassDetail :any ={};
  getDetails() {
    this.skLoading = true;
    this.service.post_rqst({ 'id': this.modalData.gatepass_id}, "Dispatch/getGatePassDetail").subscribe((result => {
      if(result['statusCode']==200){
        this.gatePassDetail = result['result'];
        
        if(this.modalData.model_type == 'update'){
          this.data = this.gatePassDetail;
          this.data.delivery_boy_id = this.data.delivery_boy_id.toString();
          this.gatePassAssign = this.data.invoice;
          // if(this.logined_user_data.id == '1'){
          //   this.branchInfo();
          // }
          this.driverInfo();
          
        }
        this.skLoading = false;
      }else{
        this.toast.errorToastr(result['statusMsg']);
        this.skLoading = false;
        
      }
    }))
  }
  
  branchInfo() {
    if( this.logined_user_data.id == '1'){
      this.data.branch_code = this.data.branch_code
    }
    else{
      this.data.branch_code = this.logined_user_data.branch_code;
    }
    this.service.post_rqst({'branch_code':this.data.branch_code}, "Dispatch/branchCodes").subscribe((result => {
      if(result['statusCode']==200){
        this.branchData = result['result']
      }else{
        this.toast.errorToastr(result['statusMsg']);
      }
    }))
  }
  
  driverInfo() {
    if(this.logined_user_data.id == '1'){
      this.data.branch_code = this.data.branch_code;
    }
    else{
      this.data.branch_code = this.logined_user_data.branch_code;
    }
    this.service.post_rqst({ 'branch_code':this.data.branch_code}, "Dispatch/getDeliveryBoyInfo").subscribe((result => {
      if(result['statusCode']==200){
        this.driver = result['result']
      }else{
        this.toast.errorToastr(result['statusMsg']);
      }
    }))
  }
  
  
  printData(): void
  {
    let printContents, popupWin;
    printContents = document.getElementById('print_card').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    
    popupWin.document.write(`
    <html>
    <head>
    <title>Print tab</title>
    <style>
    @media print {
      #qr_code_container  {
        page-break-inside: always;
        margin-bottom: 0px
      }
      @page { 
        // margin: 0.07in 0.1in 0.00in;  
      }
      
      
      
      body
      {
        font-family: 'arial';
      }
      </style>
      </head>
      <body onload="window.print();window.close()">${printContents}</body>
      </html>`
      );
      
      popupWin.document.close();
    }
    
    
  }
  
  