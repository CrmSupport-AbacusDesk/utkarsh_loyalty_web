import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import {  sessionStorage} from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';


@Component({
  selector: 'app-edit-survey',
  templateUrl: './edit-survey.component.html',
  styleUrls: ['./edit-survey.component.scss']
})
export class EditSurveyComponent implements OnInit {
  savingFlag:boolean = false;
  segment:any={};
  category:any={};
  login:any={};
  Edit_type:any;
  servey_detail:any=[]
  Data:any={}
  userData: any;
  userId: any;
  userName: any;
  id: any=''
  Users:any = []
  minDate:any;
  
  constructor(@Inject(MAT_DIALOG_DATA)public data,public dialog:MatDialog,public serve:DatabaseService, public session: sessionStorage,public toast:ToastrManager, public dialogRef: MatDialogRef<EditSurveyComponent>) { 
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.minDate = new Date();
    this.segment=this.data.segment;
    this.userId=this.userData['data']['id'];
    this.userName=this.userData['data']['name'];
    this.Edit_type=this.data.Edit_type;
    this.id=this.data.id;
    this.getNetworkType()
    this.getState()
    this.survey_detail()
  }
  
  ngOnInit() {
    this.login=JSON.parse(localStorage.getItem('login'));
  }
  getNetworkType() {
    this.serve.post_rqst({ 'type': 'checkin' }, "Survey/allNetworkModule").subscribe((result => {
      if(result['statusCode'] == 200){
        this.Users = result['modules']
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
      }
    }))
  }
  survey_detail(){
    this.serve.post_rqst({'id':this.id },'Survey/surveyDetail').subscribe((resp)=>
    {
      
      if(resp['statusCode'] == 200){
        this.Data = resp['data']
        setTimeout(() => {
        }, 700);
      }
      else{
        this.toast.errorToastr(resp['statusMsg']);
      }
    })
  }
  reason_reject:any
  
  Edit_survey(){
    this.savingFlag = true;
    this.Data.created_by_name = this.userName;
    this.Data.uid = this.userId;
    this.Data.survey_id = this.id;
    if (this.Data.start_date){
      
      this.Data.start_date = moment(this.Data.start_date).format('YYYY-MM-DD');
    }
    if (this.Data.end_date){
      
      this.Data.end_date = moment(this.Data.end_date).format('YYYY-MM-DD');
    }
    this.serve.post_rqst(this.Data,"Survey/updateSurveyBasicDetail").subscribe((result=>{
      if (result['statusCode'] == 200){
        this.toast.successToastr(result['statusMsg']);
        this.savingFlag = false;
        this.dialogRef.close(true)
      }else{
        this.toast.errorToastr(result['statusMsg']);
        this.savingFlag = false;
      }
      
    }))
  }
  states = []
  selState = []
  getState(){
    
    this.serve.post_rqst({},'User_new/get_all_state').subscribe((resp)=>
    {   
      this.states=resp['all_state'];
    }, error => {
    })
    
  }
  setState(e, state){
    if(e.checked == true){
      this.selState.push(state);
    }
    else{
      let removeindex = this.selState.findIndex(r=> r == state );
      this.selState.splice(removeindex, 1);
    }
  }
  allState(){
    if( !this.data.allStates ){
      this.selState= [];
      for (let i = 0; i < this.states.length; i++) {
        this.states[i].selected = false;
      }
    }else{
      this.selState= [];
      for (let i = 0; i < this.states.length; i++) {
        this.states[i].selected = true;
        this.selState.push(this.states[i].state_name);
      }
    }
  }
}
