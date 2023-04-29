import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute ,Router} from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from 'src/app/localstorage.service';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';

@Component({
  selector: 'app-update-kyc',
  templateUrl: './update-kyc.component.html'
})
export class UpdateKycComponent implements OnInit {
  userData: any;
  userId: any;
  userName: any;
  data:any ={};
  savingFlag:boolean = false;
  assign_login_data:any={};
  logined_user_data:any={};
  kyc_id:any;
  ItemData:any=[];
  imgUrl:any='';

  constructor(@Inject(MAT_DIALOG_DATA)public modelData, public dialogs: MatDialog, public toast:ToastrManager,  public session: sessionStorage, public ActivatedRoute : ActivatedRoute , public service : DatabaseService , public route :  Router, public dialogRef: MatDialogRef<UpdateKycComponent>) {
   this.kyc_id = modelData.kyc_id;
   this.imgUrl = service.purchaseUrl

    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    if(modelData.from_Item){
      this.ItemData=modelData.itemData;
      }
  }


  ngOnInit() {
  }




  submitDetail() {
    this.savingFlag = true;
    this.data.created_by_id = this.logined_user_data.id;
    this.data.created_by_name = this.logined_user_data.name;
    this.data.id = this.kyc_id;
    this.service.post_rqst( {'data':this.data,}, 'Influencer/updateKycStatus').subscribe((resp)=>
    {
      if (resp['statusCode'] == 200) {
        this.toast.successToastr('KYC Successfully Updated');
        this.savingFlag = false;
        this.dialogRef.close(true);
      }
      else{
        this.toast.errorToastr(resp['statusMsg']);
        this.savingFlag = false;
      }
    });
  }

  close(){
    this.dialogRef.close(true);

  }

  goToImage(image) {
    const dialogRef = this.dialogs.open(ImageModuleComponent, {
      panelClass: 'Image-modal',
      data: {
        'image': image,
        'type': 'base64'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });

  }

}
