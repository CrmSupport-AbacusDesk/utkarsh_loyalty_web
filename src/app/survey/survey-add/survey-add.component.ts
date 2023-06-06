import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-survey-add',
  templateUrl: './survey-add.component.html'
})
export class SurveyAddComponent implements OnInit {
  
  data:any ={};
  labelPosition = 'before';
  surveyQue:any = {};
  surveyAns:any ={};
  questionData:any =[];
  states:any =[];
  select_all:any=false;
  selState:any=[];
  savingFlag:boolean=false;
  userData: any;
  userId: any;
  userName: any;
  minDate:any;
  Users:any = []
  constructor( public toast:ToastrManager,public service:DatabaseService,public rout: Router,) {
    this.minDate = new Date();
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId=this.userData['data']['id'];
    this.userName=this.userData['data']['name'];
  }
  
  ngOnInit() {
    this.getState()
    this.getNetworkType()
    
  }
  

  getNetworkType() {
    this.service.post_rqst({ 'type': 'checkin' }, "Survey/allNetworkModule").subscribe((result => {
      if(result['statusCode'] == 200){
        this.Users = result['modules']
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
      }
    }))
  }

  checkQuestion (value){
    if(this.questionData != '')
    {
      let index = this.questionData.findIndex(row => row.ques_name == value)
      if (index != -1) {
        if(this.questionData[index].ques_name === value){
          this.toast.errorToastr('Question already exists');
          this.surveyQue.question = "";
          return
        }
        else{
          this.addQuestion();
        }
      }
      else{
        this.addQuestion();
      }
      
    }
    else{
      this.addQuestion();
    }
    
  }
  
  
  addQuestion(){
    this.questionData.push({ 'ques_name': this.surveyQue.question, 'options': [] });
    this.questionData.reverse();
    this.surveyQue.question = "";
    
  }
  
  
  addAnswer(index) {
    this.questionData[index]['options'].push(this.surveyAns.answer);
    this.questionData[index].isanswer = true;
    this.surveyAns.answer = "";
  }
  
  
  deleteQue(i)
  {
    this.questionData.splice(i,1);
    this.toast.errorToastr('Question delete successfully');
  }
  
  
  delAns(pindex, cindex){
    this.questionData[pindex]['options'].splice(cindex, 1);
    this.toast.errorToastr('Answer delete successfully');
  }
  getState(){
    
    this.service.post_rqst({},'Survey/getAllState').subscribe((resp)=>
    {   
      this.states=resp['all_state'];
    }, error => {
    })
    
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
  
  
  setState(e, state){
    if(e.checked == true){
      this.selState.push(state);
    }
    else{
      let removeindex = this.selState.findIndex(r=> r == state );
      this.selState.splice(removeindex, 1);
    }
  }
  
  submitDetail(){
    if(this.data.selState == ''){
      this.toast.errorToastr('State can not be blank');
      return
    }
    if(this.questionData == ''){
      this.toast.errorToastr('Question can not be blank');
      return
    }
    for (let i = 0; i < this.questionData.length; i++) {
      const element = this.questionData[i].options;
      if(element == ''){
        this.toast.errorToastr('Question ' + i + ' answer is blank');
        return
      }
    }
    
    if (this.data.start_date){
      
      this.data.start_date = moment(this.data.start_date).format('YYYY-MM-DD');
    }
    if (this.data.end_date){
      
      this.data.end_date = moment(this.data.end_date).format('YYYY-MM-DD');
    }
    this.data.uid=this.userId
    this.data.uname=this.userName
    this.data.state=this.selState;
    
    
    this.data.item_data=this.questionData;
    this.savingFlag = true;
    
    this.service.post_rqst(this.data,'Survey/addSurvey').subscribe((resp)=>
    {   
      if (resp['statusCode'] == 200){
        this.toast.successToastr(resp['statusMsg']);
        this.rout.navigate(['/survey-list']);
        this.savingFlag = false;
        this.service.count_list();
      }
      else{
        this.toast.errorToastr(resp['statusMsg']);
        this.savingFlag = false;
      }
      
    }, error => {
    })
  }
  
  
}
