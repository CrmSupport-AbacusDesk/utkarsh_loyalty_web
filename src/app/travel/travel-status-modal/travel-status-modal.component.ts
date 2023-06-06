import { Component, OnInit,Inject } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute,Router } from '@angular/router';



@Component({
  selector: 'app-travel-status-modal',
  templateUrl: './travel-status-modal.component.html'
})
export class TravelStatusModalComponent implements OnInit {
  resetform:any;
  locationAssign:boolean = false;
  arealist: any =[];
  userData: any;
  userId: any;
  userName: any;
  
  constructor(@Inject(MAT_DIALOG_DATA)public data,
  public dialog:MatDialog,
  public serve:DatabaseService,
  public alert:DialogComponent,
  public navparams: ActivatedRoute,
  public toast:ToastrManager) {
    
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId=this.userData['data']['id'];
    this.userName=this.userData['data']['name'];
    console.log(this.data);
    if(this.data['deleteAreaId'] && this.data['deleteAreaName'] && this.data['from'] == 'location-master'){
      this.locationAssign = true;
      this.area_list();
    }
    else{
      this.locationAssign = false;
    }
    
  }
  
  ngOnInit() {
  }
  
  update_status()
  {
    console.log(this.data);
    this.serve.post_rqst(this.data,"Travel/updateStatusNew").subscribe((result)=>{
      console.log(result);
      if(result)
      {
        this.toast.successToastr("success");
        this.dialog.closeAll();
        
      }
    })
  }
  
  deleteUser()
  {
    this.alert.delete('User Data !').then((result) => {
      if(result){
        let value= {};
        this.serve.post_rqst(value,"User/delete_user").subscribe((result)=>{
          console.log(result);
        })
      }
    });
  }
  
  
  area_list() {
    
    this.serve.post_rqst(this.data, "User/area_list").subscribe((response => {
      console.log(response);
      console.log(this.data['deleteAreaId']);
      console.log(response['area_list'][0]['id']);

      
      
      for(let i = 0;i<response['area_list'].length;i++){
        
        if(parseInt(this.data['deleteAreaId']) == parseInt(response['area_list'][i]['id']))
        {
          console.log("in if");   
        }
        else{
          console.log("in else");
          this.arealist.push(response['area_list'][i]);
        }
      }      
      console.log(this.arealist);
      
    }))
    
  }
  
  
  
  assign_area(){
    console.log("assign area method calls");
    console.log(this.data.area);
    console.log(this.data['deleteAreaId']);
    console.log(this.data['deleteAreaName']);
    
    this.serve.post_rqst({ 'id': this.data['deleteAreaId'],'delarea': this.data['deleteAreaName'],'updateArea': this.data.area }, "User/delete_area").subscribe((response => {
      console.log(response);
      this.dialog.closeAll();

      if (response['msg'] == 'Deleted') {
        this.alert.success("Location", "Deleted");
        this.dialog.closeAll();
      
      }
      else{
        this.alert.error("Something went wrong");
        this.dialog.closeAll();
      }
    }))
  }


}
