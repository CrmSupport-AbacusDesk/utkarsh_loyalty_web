import {  Component,  Inject,  OnInit} from '@angular/core';
import {  MatDialog,  MAT_DIALOG_DATA} from '@angular/material';
import {  FormControl } from '@angular/forms';
import {  DialogComponent} from 'src/app/dialog.component';
import {  DatabaseService} from 'src/_services/DatabaseService';
import {  sessionStorage} from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';



const now = new Date();

@Component({
  selector: 'add-travel-list-modal',
  templateUrl: './add-travel-list-modal.component.html',

})
export class addTravelListModal implements OnInit {


  travel_type_data: any = [];
  data1: any = {};
  loader: any;
  today_date: any;
  lists: any;
  max: any;
  result: any = [];
  logIN_user: any;
  showSave: boolean = true;
  state_list: any = [];
  district_list: any = [];
  city_list: any = [];
  drlist: any = [];
  salesUserList: any = [];
  searchText;
  search: any = {};
  city_list2: any = [];
  tmpsearch: any = {};
  salesUserList2: any=[];
  state_list2:any=[];
  district_list2:any=[];
  drlist2:any=[];
  today:Date;
  selectedArea: any;
  userData: any;
  userId: any;
  userName: any;
  assign: any;



  constructor(public serve: DatabaseService, @Inject(MAT_DIALOG_DATA) public data, public Toastr: ToastrManager, public session: sessionStorage, public dialog: MatDialog, public dialog1: DialogComponent, public toast: ToastrManager,) {
// console.log(this.data.travel.id)
console.log(this.data)
// console.log(this.data.travel.city)
this.data1.route_name=this.data.row.city
this.data1.status_remark=this.data.row.status_remark
this.data1.date_from=this.data.row.date_from
this.data1.sales_user_id=this.data.row.assign_to
this.data1.beat_code=this.data.row.beat_code
this.data1.state=this.data.row.state
this.data1.district=this.data.row.district
// this.data1.user_id=this.data.row.id



this.getbeatcode()

console.log(this.data1.route_name)

// this.data.state==[]
// this.data.district==[]

    this.today_date = new Date().toISOString().slice(0, 10);
    console.log(this.today_date);
    this.logIN_user = JSON.parse(localStorage.getItem('st_user'));
    // this.data1.select_provision="testProvision";
    this.lists = new FormControl();
    console.log(this.lists);
    this.today=new Date();
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId=this.userData['data']['id'];
    this.userName=this.userData['data']['name'];

  }
distributor:any=[]
district:any=[]
city:any=[]
state:any=[]


  ngOnInit() {
    this.data1.date_to = '';
    this.data1.date_from = '';

console.log(this.data.sales_user_id)

  
  }



 
  // get_types() {
  //   this.serve.post_rqst({'travel_type': this.data1.travel_type}, "API").subscribe((result => {
  //     console.log(result);
  //     this.travel_type_data = result;
  //     console.log(this.travel_type_data);
  //   }))
  // }

  

  searchDistributor(search) {
    this.tmpsearch='';
    this.drlist = [];
    for (var i = 0; i < this.drlist2.length; i++) {
      search = search.toLowerCase();
      this.tmpsearch = this.drlist2[i]['company_name'].toLowerCase();
      if (this.tmpsearch.includes(search)) {
        this.drlist.push(this.drlist2[i]);
      }
    }
    this.search.sales_user='';
  }


  datavar: any = [];
id:any
  add_travel_plan() {
    // this.data1.id = this.data.id
    console.log(this.data1.date_from);
    console.log(this.data1.date_to);

    this.data1.created_by = this.logIN_user.data.id;
    // console.log(this.data1.uid);
    this.data1.date_from = moment(this.data1.date_from).format('YYYY-MM-DD');
    this.data1.date_to = moment(this.data1.date_to).format('YYYY-MM-DD');
    console.log(this.data1);

    if (this.data1.travel_type == 'Area Visit') {
      console.log(this.lists);
      this.data1.date_created = this.today_date;
      this.data1.travel_list = this.lists['value'];


    }
    // this.data1.area = this.lists['value'].area;
    // this.data1.id='';
    console.log(this.data1);
 this.data1.uid=this.userId;
 this.data1.uname=this.userName;

    // -------------


    this.serve.post_rqst(this.data1, "Travel/add_travelPlan").subscribe((result => {
      console.log(result);
      if ((result['msg']) == "exist") {
        this.Toastr.errorToastr("Travel Plan already exist to selected date");
      }
      else{
        console.log("close dialog box");

        this.dialog.closeAll();
      }
      if(result['msg']=="success"){

        this.dialog1.success("Travel Plan", "Added");
        this.loader = false;
      }
      else{

        this.dialog1.error("Something Went Wrong Please try again !");
        this.loader = false;
        this.dialog.closeAll();

      }
      setTimeout(() => {
        this.loader = '';
      }, 100);
  }))
  }
  update_travel_plan() {


    

 this.data1.uid=this.userId;
 this.data1.uname=this.userName;

    // -------------


  this.serve.post_rqst({'id':this.data1.user_id,'city':this.data1.route_name,'beat_code':this.data1.beat_code,'remarks':this.data1.status_remark,'user_id':this.data1.sales_user_id}, "Travel/update_travelPlan").subscribe((result => {
    console.log(result);

    if ((result) == "exist") {
      this.Toastr.errorToastr("Travel Plan already exist to selected date");
    }
    else(result== "success")
    {
      this.toast.successToastr("Travel Plan Updated");

      console.log("close dialog box");

      this.dialog.closeAll();
    }
    setTimeout(() => {
      this.loader = '';
    }, 100);
}))
// }

  }


 

 


  getCityList(data1,data2) {
    console.log(data2);

    let value = { "state": this.data1.state, "district": this.data1.district }
    this.serve.post_rqst(value, "Travel/cityList").subscribe((response => {
      console.log(response);
      this.city_list = response;
      this.city_list2 = this.city_list;
      console.log(this.city_list);

    }));
    console.log("list in get city list");
    console.log(this.lists);
    this.lists['value']='';
    this.search.district_search='';


    // this.lists['_pendingValue']='';
    // this.lists='';
    this.search.district_search='';

  }
  getbeatcode() {

    this.serve.post_rqst({'id':this.data1.sales_user_id,'state':this.data1.state,'district':this.data1.district}, "Travel/beat_code_list_according_to_city").subscribe((response => {
      console.log(response);
      this.city_list = response['beat_code_list'];
      console.log(this.city_list);

    }));
    console.log("list in get city list");
    console.log(this.lists);
    this.search.district_search='';


    // this.lists['_pendingValue']='';
    // this.lists='';
    this.search.district_search='';

  }


  // ----------------------



}
