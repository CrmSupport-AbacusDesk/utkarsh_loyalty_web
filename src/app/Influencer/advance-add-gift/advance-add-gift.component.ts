import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import {  sessionStorage} from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-advance-add-gift',
  templateUrl: './advance-add-gift.component.html'
})
export class AdvanceAddGiftComponent implements OnInit {
  data:any ={};
  savingFlag:boolean = false;
  userData: any;
  userType:any;

  constructor(@Inject(MAT_DIALOG_DATA)public modelData,public dialog:MatDialog,public serve:DatabaseService, public session: sessionStorage,public toast:ToastrManager, public dialogRef: MatDialogRef<AdvanceAddGiftComponent>) {
   console.log(modelData);


    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.data.created_by =this.userData['data']['id'];
    this.data.created_by_name =this.userData['data']['name'];
    this.userType =modelData.userType
    this.data.influencer_name = modelData.name;
    this.data.influencer_id = modelData.id;
  }

  ngOnInit() {
  }




  submitDetail(type){
    this.data.influencer_name = this.modelData.name;
    this.data.influencer_id = this.modelData.id;
    this.data.point_type  = 'Increment';

    this.savingFlag = true;
    let header

    console.log(type);


    if(type == 'gift_add'){
      header = this.serve.post_rqst({'data':this.data},"GiftGallery/manualAddGiftGallery")
    }
    if(type == 'point_transfer'){
      header = this.serve.post_rqst({'data':this.data},"GiftGallery/manualPointTransfer")
    }

    console.log('====================================');
    console.log(header);
    console.log('====================================');

    header.subscribe((result=>{
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

}
