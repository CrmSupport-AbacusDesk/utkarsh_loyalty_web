import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { FollowupEditComponent } from '../followup-edit/followup-edit.component';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-followup-detail',
  templateUrl: './followup-detail.component.html',
  styleUrls: ['./followup-detail.component.scss']
})
export class FollowupDetailComponent implements OnInit {
  followup_id: any;
  followup_detail: any={};
  loader: boolean = false;

  
  constructor(public toast: ToastrManager, public dialog: MatDialog,public serve: DatabaseService,public route: ActivatedRoute,) { 
    
    this.route.params.subscribe(params => {
      this.followup_id = params.id;
      this.serve.currentUserID = params.id
      console.log(this.followup_id);
      this.get_followup_detail();
    });
    
  }
  
  ngOnInit() {
  }
  
  
  get_followup_detail() {
    this.loader = true;
    this.serve.post_rqst({'followup_id':this.followup_id}, "Followup/followupDetail").subscribe((result) => {
      if(result['statusCode']==200){
        this.followup_detail = result['followup_detail'][0];
        this.loader = false;

      }else{
        this.loader = false;
        this.toast.errorToastr(result['statusMsg']);
      }

    }, err=>{
      this.loader = false;
      this.toast.errorToastr('Something went wrong');
    })
  }
  
  
  edit_followup_modal() {
    const dialogRef = this.dialog.open(FollowupEditComponent, {
      width: '750px',
      data: {
        'followup_detail':this.followup_detail,
        'from':'followup detail page'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.get_followup_detail()
    });
  }
  
  
  
}
