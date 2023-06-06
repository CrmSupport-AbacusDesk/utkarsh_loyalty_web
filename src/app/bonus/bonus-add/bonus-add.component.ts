import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from 'src/app/localstorage.service';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-bonus-add',
  templateUrl: './bonus-add.component.html'
})
export class BonusAddComponent implements OnInit {
  data:any ={};
  states:any=[];
  districts:any=[];
  temp_state_name:any=[];
  final_state_name:any=[];
  minDate:any;
  pointCategories_data:any=[];
  savingFlag = false;
  assign_login_data:any={};
  logined_user_data:any={};
  filter:any ={};
  influencerUser:any =[];
  labelPosition = 'before';
  form_statelist: any = [];
  form_districtlist:any =[];
  areaInfluencer:any=[];
  
  constructor(public service:DatabaseService, public session: sessionStorage, public rout: Router, public toast:ToastrManager) { 
    this.minDate = new Date();
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    this.getInfluencer();
  }
  
  ngOnInit() {
  }
  
  getState(){
    
    this.service.post_rqst({},'Bonus/getAllState').subscribe((result)=>
    {   
      if (result['statusCode'] == 200){
        this.states=result['all_state'];
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
      }
    }, error => {
    })
    
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
  
  
  newDistrict:any= []
  districtList(stateinput) {
    this.service.post_rqst({'state_name':stateinput}, "Bonus/getAllDistrict").subscribe((result => {
      if (result['statusCode'] == 200){
        this.newDistrict = result['all_district'];
        this.districts.push(  { 'state_name':stateinput, 'district': this.newDistrict } );
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
      }
      
      
    }));
    
  }
  
  
  getSelDistrict(stateinp,districtinput,e){
    if(e){
      this.storedistrict(stateinp,districtinput);
    }else{
      this.removeDistrictListData(districtinput);
    }
  }
  
  
  
  
  
  
  pointCategory_data(status)
  {
    this.filter.point_type = status; 
    this.service.post_rqst({'filter':this.filter},'Bonus/pointCategoryMasterList').subscribe((result)=>
    {
      if (result['statusCode'] == 200){
        this.pointCategories_data=result['point_category_list'];
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
      }
    })
  }
  
  
  getInfluencer()
  {
    this.filter.scanning_rights = 'Yes'; 
    this.service.post_rqst({'filter':this.filter},'Bonus/influencerMasterList').subscribe((result)=>
    {
      if (result['statusCode'] == 200){
        this.influencerUser=result['result'];
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
      }
    })
  }
  
  
  getAreaInfluencer(search){
    if(this.form_districtlist.length == 0){
      return;
    }
    else{
      this.service.post_rqst({'user_type':this.data.types, 'search':search, 'influencer_type':this.data.influencer_type,'state':this.form_statelist,'district':this.form_districtlist},'Bonus/influencerList').subscribe((result)=>
      {   
        if (result['data']['statusCode'] == 200){
          this.areaInfluencer = result['data']['result'];
        }
        else{
          this.toast.errorToastr(result['data']['statusMsg']);
        }
      }, error => {
      })
    }
    
  }
  
  selInfluncer:any =[];
  selState:any =[];
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
      for (let i = 0; i < this.states.length; i++) {
        this.areaInfluencer[i].selected = true;
        this.selInfluncer.push({'id': this.areaInfluencer[i].id});
        
      }
    }
  }
  
  
  submitDetail() {
    
    let productPoint =[]
    for (let i = 0; i < this.pointCategories_data.length; i++) {
      const element = this.pointCategories_data[i];
      productPoint.push({'product_id':element.id, 'product_name':element.point_category_name, 'influencer_point':element.scheme_influencer_point})
    }
    this.data.start_date = this.data.start_date  ? this.service.pickerFormat(this.data.start_date) : '';
    this.data.end_date = this.data.end_date  ? this.service.pickerFormat(this.data.end_date) : '';
    this.data.created_by = this.service.datauser.id;
    this.data.created_by_name=this.logined_user_data.name;
    this.data.created_by_id=this.logined_user_data.id;
    this.savingFlag = true;
    this.data.state = this.form_statelist;
    this.data.district = this.form_districtlist;
    this.data.influencer_ids = this.selInfluncer;
    this.service.post_rqst( {'scheme':this.data,  'productPoint':productPoint,}, 'Bonus/addBonus').subscribe((resp)=>
    {
      if(resp['statusCode'] == 200){
        this.toast.successToastr(resp['statusMsg']);
        this.rout.navigate(['/bonus-list']);
        this.savingFlag = false;
      }
      else{
        this.toast.errorToastr(resp['statusMsg']);
        this.savingFlag = false;
      }
    });
  }
  
  
}
