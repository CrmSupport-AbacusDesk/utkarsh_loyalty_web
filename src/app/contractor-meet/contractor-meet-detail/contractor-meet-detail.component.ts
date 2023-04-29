import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';


@Component({
  selector: 'app-contractor-meet-detail',
  templateUrl: './contractor-meet-detail.component.html'
})
export class ContractorMeetDetailComponent implements OnInit {
  meetingID :any ;
  img_url = ''
  sendData:any={};
  skLoading:boolean=false;
  contractorMeetDetail:any;
  constructor( public route:ActivatedRoute,
    public rout:Router,
    public toast:ToastrManager,
    public serve: DatabaseService,
    public alert: DialogComponent,
    public dialogs: MatDialog,
    ) { 
      this.img_url = this.serve.uploadUrl + 'event_file/';
      this.route.params.subscribe(prm=>{
        this.meetingID=prm.id;
        this.serve.currentUserID = prm.id
      })
      
      this.getMeetingDetails()
    }
    
    ngOnInit() {
    }
    
    tmparray:any=[];
    
    getMeetingDetails(){
      
      this.sendData={
        id:this.meetingID
      }
      this.skLoading=true;
      this.serve.post_rqst(this.sendData, "Event/eventDetail").subscribe((result) => {
        if(result['statusCode']==200){
          
          console.log(result);
          this.contractorMeetDetail = result['result'];
          this.skLoading=false;
        }else{
          this.toast.errorToastr(result['statusMsg']);
          this.skLoading=false;
          
        }
      },err=>{
        this.toast.errorToastr('Something went wrong');
      })
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
  