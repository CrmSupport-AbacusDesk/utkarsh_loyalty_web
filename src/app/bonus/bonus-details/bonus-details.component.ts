import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { UploadFileModalComponent } from 'src/app/upload-file-modal/upload-file-modal.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { BonusUpdateComponent } from '../bonus-update/bonus-update.component';

@Component({
  selector: 'app-bonus-details',
  templateUrl: './bonus-details.component.html'
})
export class BonusDetailsComponent implements OnInit {
  id: any;
  data:any ={};
  skLoading:boolean = false;
  savingFlag:boolean = false;
  bonusdetail_data:any={};
  districts:any=[];
  State_list:any=[];
  form_statelist: any = [];
  form_districtlist:any =[];
  assign_login_data:any={};
  logined_user_data:any={};
  runningScheme:any =[];
  filter: any;
  
  
  
  constructor(public route: ActivatedRoute, public toast:ToastrManager, public dialog: MatDialog,  public dialogs:DialogComponent, public session: sessionStorage, public rout: Router,public service:DatabaseService, public alrt: MatDialog) {
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.service.currentUserID = params.id
      this.bonus_detail();
    });
  }
  
  ngOnInit() {
  }
  
  bonus_detail(){
    this.skLoading = true;
    this.service.post_rqst({'id':this.id },'Bonus/bonusDetail').subscribe((resp)=>
    {
      
      if (resp['statusCode'] == 200){
        this.bonusdetail_data = resp['data'];
        this.runningScheme = resp['data']['influencer_ids'];
        
        
        
        
        this.getState();
        var statearrey = (this.bonusdetail_data['state']).split(",");
        var len=statearrey.length;
        for(var i=0;i<len-1;i++){
          if(statearrey[i]){
            this.getDistrictList(statearrey[i],true);
          }
        }
        this.skLoading = false;
        
        var distarrey = (this.bonusdetail_data['district']).split(",");
        
        var len1 = distarrey.length;
        for(var i=0;i<len1-1;i++){
          if(distarrey[i]){
            this.getSelDistrict(statearrey[0],distarrey[i],true);
            this.storedistrict(statearrey[0],distarrey[i]);
          }
        }
        if(this.bonusdetail_data.types=='Influencer'){
          this.getAreaInfluencer();
        }
        
        
        setTimeout(() => {
          this.skLoading = false;
        }, 700);
      }
      else{
        this.toast.errorToastr(resp['statusMsg']);
      }
    })
  }
  
  states:any=[];
  getState(){
  setTimeout(() => {
    this.service.post_rqst({},'Bonus/getAllState').subscribe((result)=>
    {   
      if (result['statusCode'] == 200){
        this.states=result['all_state'];
        this.datastateupdate();
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
      }
    }, error => {
    })
  }, 2000);
    
  }
  
  
  datastateupdate(){
    for(var i=0;i<this.form_statelist.length;i++){
      for(var ji=0;ji<this.states.length;ji++){
        if(this.form_statelist[i].state_name== this.states[ji].state_name){
          this.states[ji].state_value=true;
        }
      }
    }
  }
  
  dataupdatedistrict(){
    for(var i=0;i<this.form_districtlist.length;i++){
      for(var ji=0;ji<this.districts.length;ji++){
        for(var ki=0;ki<this.districts[ji].district.length;ki++){
          if(this.form_districtlist[i].district_name== this.districts[ji].district[ki].district_name){
            this.districts[ji].district[ki].district_value=true;
          }
        }
      }
    }
  }
  
  
  newDistrict:any= []
  districtList(stateinput) {
    setTimeout(() => {
      this.service.post_rqst({'state_name':stateinput}, "Bonus/getAllDistrict").subscribe((result => {
        if (result['statusCode'] == 200){
          this.newDistrict = result['all_district'];
          this.districts.push(  { 'state_name':stateinput, 'district': this.newDistrict } );
          this.dataupdatedistrict();
        }
        else{
          this.toast.errorToastr(result['statusMsg']);
        }
        
        
      }));
    }, 3000);
    
  }
  
  storestate(state_name) {
    if(state_name) {
      this.form_statelist.push({state_name: state_name});
    }
  }
  removeStateListData(state_name) {
    var x = this.form_statelist.findIndex(items => items.state_name === state_name);
    if(x  != '-1')this.form_statelist.splice(x, 1);
  }
  
  storedistrict(stateinp,district_name) {
    if(district_name) {
      this.form_districtlist.push({'state_name':stateinp,'district_name':district_name});
    }
  }
  
  removeDistrictListData(district_name) {
    var x = this.form_districtlist.findIndex(items => items.district_name === district_name);
    if(x  != '-1')this.form_districtlist.splice(x, 1);
  }
  
  removeDist(stateinput){
    var x = this.districts.findIndex(items => items.state_name === stateinput);
    if(x  != '-1')this.districts.splice(x, 1);
    
  }
  
  getDistrictList(stateinput,e){
    if(e){
      this.districtList(stateinput);
      this.storestate(stateinput);
    }else{
      this.removeDist(stateinput);
      this.removeStateListData(stateinput);
    }
  }
  all_dis_check:any=false;
  sel_all_dis(e)
  {
    if(e.checked)
    {
      this.all_dis_check = true;
      for(let i=0;i<this.districts.length;i++)
      {
        for(let j=0;j<this.districts[i]['district'].length;j++)
        {
          this.storedistrict(this.districts[i]['state_name'],this.districts[i]['district'][j]['district_name']);
        }
      }
    }
    else
    {
      this.all_dis_check = false;
      for(let k=0;k<this.districts.length;k++)
      {
        for(let l=0;l<this.districts[k]['district'].length;l++)
        {
          this.removeDistrictListData(this.districts[k]['district'][l]['district_name']);
        }
      }
    }
  }
  
  
  getSelDistrict(stateinp,districtinput,e){
    if(e){
      this.storedistrict(stateinp,districtinput);
    }else{
      this.removeDistrictListData(districtinput);
    }
  }
  
  
  
  areaInfluencer:any =[];
  getAreaInfluencer(){
   setTimeout(() => {
    this.service.post_rqst({'user_type':this.bonusdetail_data.types, 'scheme_id':this.id, 'influencer_type':this.bonusdetail_data.influencer_type, 'state':this.form_statelist,'district':this.form_districtlist},'Bonus/influencerList').subscribe((result)=>
    {   
      if (result['data']['statusCode'] == 200){
        this.areaInfluencer = result['data']['result'];
        setTimeout(() => {
          this.compareArray();
        }, 300);
      }
      else{
        this.toast.errorToastr(result['data']['statusMsg']);
      }
    }, error => {
    })
   }, 5000);
    
  }
  
  
  allInfluncerData:any =[];
  compareArray(){
    
    for (let i = 0; i < this.areaInfluencer.length; i++) {
      for (let j = 0; j < this.runningScheme.length; j++) {
        if(parseInt(this.areaInfluencer[i]['id']) == parseInt(this.runningScheme[j]['id'])){
          
          this.areaInfluencer[i]['selected'] = true;   
          this.selInfluncer.push({'id':this.areaInfluencer[i]['id']});
          
          
          }
        else{
          // this.areaInfluencer[i]['selected'] = false;
        }
      }
      
    }
    
    this.allInfluncerData.push(this.areaInfluencer);
    
    
    
  }
  
  
  selInfluncer:any =[];
  setInfluencer(e, id){
    if(e.checked == true){
    

      this.selInfluncer.push({'id':id});
    }
    else{
      let removeindex = this.areaInfluencer.findIndex(row=> row.id == id );
      this.selInfluncer.splice(removeindex, 1);
    }
    
    
  }
  
  allInfluncer(){
    if( !this.data.Influencer ){
      this.selInfluncer= [];
      for (let i = 0; i < this.areaInfluencer.length; i++) {
        this.areaInfluencer[i].selected = false;
      }
    }else{
      this.selInfluncer= [];
      for (let i = 0; i < this.areaInfluencer.length; i++) {
        this.areaInfluencer[i].selected = true;
        this.selInfluncer.push({'id': this.areaInfluencer[i].id});
        
      }
    }
    
    
  }
  
  
  
  edit(){
    this.rout.navigate(['/bonus-edit/' + this.id]);
  }
  
  
  
  
  
  areaUpdate() {
    
    this.savingFlag = true;
    this.data.state = this.form_statelist;
    this.data.district = this.form_districtlist;
    this.data.update_id =  this.id;
    this.data.created_by_id = this.logined_user_data.id;
    this.data.created_by_name = this.logined_user_data.name;
    
    this.data.influencer_ids = this.selInfluncer;
    
    
    this.service.post_rqst( {'scheme':this.data,  'action':'area'}, 'Bonus/updateBonus').subscribe((resp)=>
    {
      if(resp['statusCode'] == 200){
        this.toast.successToastr(resp['statusMsg']);
        this.savingFlag = false;
      }
      else{
        this.toast.errorToastr(resp['statusMsg']);
        this.savingFlag = false;
      }
    });
  }
  
  
  
  update(data, type): void {  
    const dialogRef = this.dialog.open(BonusUpdateComponent, {
      width: '1024',
      panelClass:'cs-modal',
      data:{
        data: data,
        type: type,
      }
      
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if(result == true){
        this.bonus_detail();
      }
    });
  }
  
  upload_excel(type, id, district, userType, influencerType) {
    const dialogRef = this.alrt.open(UploadFileModalComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      data: {
        'from': 'Bonus',
        'modal_type': type,
        'district': district,
        'user_type':userType,
        'influencer_type':influencerType,
        'bonus_id':id

      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
      this.bonus_detail();
      }

    });
  }
  
}
