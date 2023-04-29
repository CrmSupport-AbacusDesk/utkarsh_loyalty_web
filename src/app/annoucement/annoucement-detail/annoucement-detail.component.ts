import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService'
import { MatDialog } from '@angular/material';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-annoucement-detail',
  templateUrl: './annoucement-detail.component.html',
  styleUrls: ['./annoucement-detail.component.scss']
})
export class AnnoucementDetailComponent implements OnInit {
  skLoading:boolean= false;
  noticeId:any='';
  loader:any;
  noticeDetail:any={}
  url:any=''

  constructor(public toast: ToastrManager,
              public route:ActivatedRoute,
              public serve:DatabaseService,
              public router :Router ,
              public dialog: MatDialog,
              public alert:DialogComponent) 
  { 
    this.route.params.subscribe( params => {
      
      this.noticeId = params.id;
      this.serve.currentUserID = params.id
      });
      this.url=serve.uploadUrl;
      this.getAnnouncementDetail();
  }

  ngOnInit() 
  {
  }

  getAnnouncementDetail()
  {
    this.skLoading = true;
    this.serve.post_rqst({'noticeId':this.noticeId},"Announcement/announcementDetail").subscribe(result=>
    {
      if(result['announcement_detail']['statusCode']==200){
        this.noticeDetail = result['announcement_detail']['announcemenDetail'];
      this.skLoading = false;
      }else{
      this.skLoading = false;
      this.toast.errorToastr(result['announcement_detail']['statusMsg']);
      }
      
    }, err=>{
      this.toast.errorToastr('Something went wrong');
    })
    
    
    
  }

}
