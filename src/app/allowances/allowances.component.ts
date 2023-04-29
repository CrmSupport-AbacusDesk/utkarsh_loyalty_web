import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute,Router } from '@angular/router';
import { Location } from '@angular/common'
import { sessionStorage } from '../localstorage.service';
import { DialogComponent } from '../dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';



@Component({
  selector: 'app-allowances',
  templateUrl: './allowances.component.html',
  styleUrls: ['./allowances.component.scss']
})
export class AllowancesComponent implements OnInit {
  designation:any;
  userRoleData:any=[];
  allowanceData:any=[];
  loader:any;
  logined_user_data2:any;
  assign_login_data:any;
  logined_user_data:any
  constructor(public serve:DatabaseService, public toast:ToastrManager,public navparams: ActivatedRoute,public dialog:DialogComponent,public location: Location,public session: sessionStorage) 
  { 
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value;
    this.logined_user_data2 = this.logined_user_data.data;
    this.get_designation();
    this.get_allowance();
  }
  
  ngOnInit() 
  {
  }
  
  get_designation()
  {
    this.serve.post_rqst({'designation':this.designation},"Master/salesType").subscribe((response=>
      {
        if(response['sales']['statusCode'] == 200){
          this.userRoleData = response['sales']['result'];
          this.get_allowance();
        }
        else{
          this.toast.errorToastr(response['sales']['statusMsg']);
        }
      }));
      
      
    }
    
    get_allowance()
    {
      this.loader=1;
      
      this.serve.post_rqst({'designation':this.designation},"Master/getAllowanceData").subscribe((response=>
        {
          if(response['allowance']['statusCode'] == 200){
            this.allowanceData = response['allowance']['result'];
            for(var i=0; i<this.userRoleData.length; i++)
            {
              for(var j=0; j<this.allowanceData.length; j++)
              {
                if(this.userRoleData[i]['id'] == this.allowanceData[j]['roleId'])
                {
                  this.userRoleData[i]['flight'] = this.allowanceData[j]['flight'];
                  this.userRoleData[i]['trainSC'] = this.allowanceData[j]['trainSC'];
                  this.userRoleData[i]['train3Tier'] = this.allowanceData[j]['train3Tier'];
                  this.userRoleData[i]['train2Tier'] = this.allowanceData[j]['train2Tier'];
                  this.userRoleData[i]['busAC'] = this.allowanceData[j]['busAC'];
                  this.userRoleData[i]['busNonAC'] = this.allowanceData[j]['busNonAC'];
                  this.userRoleData[i]['auto'] = this.allowanceData[j]['auto'];
                  this.userRoleData[i]['taxi'] = this.allowanceData[j]['taxi'];
                  this.userRoleData[i]['car'] = this.allowanceData[j]['car'];
                  this.userRoleData[i]['bike'] = this.allowanceData[j]['bike'];
                  this.userRoleData[i]['hotel'] = this.allowanceData[j]['hotel'];
                  this.userRoleData[i]['metro'] = this.allowanceData[j]['metro'];
                  this.userRoleData[i]['food'] = this.allowanceData[j]['food'];
                  this.userRoleData[i]['car_outstation'] = this.allowanceData[j]['car_outstation'];
                  this.userRoleData[i]['acbus_outstation'] = this.allowanceData[j]['acbus_outstation'];
                }
              }
            }
            setTimeout (() => {
              this.loader='';
              
            }, 5000);
          }
          else{
            this.toast.errorToastr(response['allowance']['statusMsg']);
          }
          
        }));
      }
      refresh(){
        this.get_allowance();
      }
      updateAllowance()
      {
        for(var i=0; i<this.userRoleData.length; i++)
        {
          for(var j=0; j<this.allowanceData.length; j++)
          {
            if(this.userRoleData[i]['id'] == this.allowanceData[j]['roleId'])
            {
              this.userRoleData[i]['flight'] = this.allowanceData[j]['flight'];
              this.userRoleData[i]['trainSC'] = this.allowanceData[j]['trainSC'];
              this.userRoleData[i]['train3Tier'] = this.allowanceData[j]['train3Tier'];
              this.userRoleData[i]['train2Tier'] = this.allowanceData[j]['train2Tier'];
              this.userRoleData[i]['busAC'] = this.allowanceData[j]['busAC'];
              this.userRoleData[i]['busNonAC'] = this.allowanceData[j]['busNonAC'];
              this.userRoleData[i]['auto'] = this.allowanceData[j]['auto'];
              this.userRoleData[i]['taxi'] = this.allowanceData[j]['taxi'];
              this.userRoleData[i]['car'] = this.allowanceData[j]['car'];
              this.userRoleData[i]['bike'] = this.allowanceData[j]['bike'];
              this.userRoleData[i]['hotel'] = this.allowanceData[j]['hotel'];
              this.userRoleData[i]['metro'] = this.allowanceData[j]['metro'];
              this.userRoleData[i]['food'] = this.allowanceData[j]['food'];
              this.userRoleData[i]['car_outstation'] = this.allowanceData[j]['car_outstation'];
              this.userRoleData[i]['acbus_outstation'] = this.allowanceData[j]['acbus_outstation'];
            }
          }
        }

        this.dialog.confirm("Update Allowance !").then((result)=>{
          if(result){
            this.serve.post_rqst({'data':this.userRoleData},"Master/updateAllowance").subscribe((response=>
              {
                if(response['allowance']['statusCode'] == 200){
                  this.toast.successToastr(response['allowance']['statusMsg']);
                  this.get_allowance();
                }
                else{
                  this.toast.errorToastr(response['allowance']['statusMsg']);
                } 
              })); 
            }
          })
        }
      }
      