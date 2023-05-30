import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService'
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { DatePipe, Location } from '@angular/common';
import * as moment from 'moment';
import {  sessionStorage} from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
    selector: 'app-add-influencer',
    templateUrl: './add-influencer.component.html',
    styleUrls: ['./add-influencer.component.scss']
})
export class AddInfluencerComponent implements OnInit {
    savingFlag:boolean = false;
    states:any =[];
    district_list: any = [];
    userId: any;
    userName: any;
    params_network:any;
    params_type:any;
    document_image :any;
    document_image_back :any;
    pan_img :any;
    image_id:any;
    image = new FormData();
    city_list: any = [];
    city_area_list:any=[];
    pinCode_list: any = [];
    data: any = {};
    contact_person = {};
    asmList: any = [];
    assignUserList = [];
    assignUserId = [];
    dr_type: any;
    brand_list: any = [];
    options: string[] = ['One', 'Two', 'Three'];
    filteredOptions: Observable<string[]>;
    searchMoviesCtrl = new FormControl();
    rsm: any = [];
    ass_user: any = [];
    brand: any = [];
    tmp_drlist: any = [];
    drlist: any = [];
    tmpsearchdr: any = {};

    filter_data: any;
    isLoading = false;
    errorMsg: string;
    active: any = {};
    submit: any = true;
    exist: boolean = false;
    tmp_userList: any = [];
    search: any = {};
    tmpsearch: any = {};
    ass_dist: any = [];
    myDate: Date;
    userData: any;
    params_id: any;
    front_img_id:any;
    back_img_id:any;
    pan_img_id:any;
    bank_img_id:any;
    uploadurl:any;
    panBase64:boolean = false;
    bankImgBase64:boolean = false;
    docFrontBase64:boolean = false;
    docBackBase64:boolean = false;
    architectUser:any =[];
    contractorUser:any =[];
    user_assign_detail:any=[];
    assignDrlist:any=[];

    constructor(
        public service: DatabaseService,
        public rout: Router,
        public location: Location,
        public route: ActivatedRoute,
        public toast:ToastrManager,
        public session: sessionStorage,
        private http: HttpClient) {
            this.getStateList();
            this.route.queryParams.subscribe(params => {
                this.uploadurl = this.service.uploadUrl + 'influencer_doc/'
                this.dr_type = params.type;
                if(params.type){
                    this.params_network =  params.network;
                    this.params_type =  params.type;
                    this.params_id =  params.id;
                    this.front_img_id =  params.id;
                    this.back_img_id =  params.id;
                    this.pan_img_id =  params.id;
                    this.bank_img_id =  params.id;
                    this.getRights();
                    if(this.params_id){
                        this.InfluencerDetail();
                    }
                }
                this.myDate = new Date();
                this.userData = JSON.parse(localStorage.getItem('st_user'));
                this.userId=this.userData['data']['id'];
                this.userName=this.userData['data']['name'];

            });
            this.getSalesUser('');
            this.distributorList('');
            this.dealerList('');

        }

        ngOnInit() { }



        checkRight:any ={};
        getRights(){
            this.service.post_rqst({'type_id':this.params_type},'Influencer/scanningRightsCheck').subscribe((result)=>
            {
                if (result['statusCode'] == 200) {
                    this.checkRight = result['result'];
                    this.data.scanning_rights = this.checkRight.scanning_rights;
                    this.data.point_transfer_right = this.checkRight.point_transfer_right;
                    this.data.type = this.checkRight.type;

                }
                else{
                    this.toast.errorToastr(result['statusMsg']);
                }
            })
        }

        InfluencerDetail(){
            this.service.post_rqst({'id':this.params_id},'Influencer/influencerCustomerDetail').subscribe((resp)=>
            {
                if (resp['statusCode'] == 200) {
                    this.data = resp['result'];

                    if(this.data.state){
                        this.getDistrict(1);
                    }
                    if(this.data.dob == '0000-00-00'){
                        this.data.dob = '';
                    }
                    if(this.data.doa == '0000-00-00'){
                        this.data.doa = '';
                    }
                    setTimeout(() => {

                    }, 300);

                }
                else{
                    this.toast.errorToastr(resp['statusMsg']);
                }
            })
        }

        getStateList() {
            this.service.post_rqst(0, "Influencer/getAllState").subscribe((result => {
                if (result['statusCode'] == 200) {
                    this.states = result['all_state'];
                }
                else{
                    this.toast.errorToastr(result['statusMsg']);
                }
            }));
        }


        getDistrict(val) {
            let st_name;
            if(val == 1)
            {
                st_name = this.data.state;
            }
            this.service.post_rqst({'state_name':st_name}, "Influencer/getAllDistrict").subscribe((result => {

                if (result['statusCode'] == 200) {
                    this.district_list = result['all_district'];
                }
                else{
                    this.toast.errorToastr(result['statusMsg']);
                }
            }));

        }


        distributorList(searcValue) {
            this.service.post_rqst({'search':searcValue}, "Influencer/distributors_List").subscribe((result => {
                if (result['statusCode'] == 200) {
                    this.drlist = result['distributors'];
                }
                else{
                    this.toast.errorToastr(result['statusMsg']);
                }

            }))
        }

        dealerList(searcValue) {
          this.service.post_rqst({'search':searcValue}, "Influencer/dealer_List").subscribe((result => {
              if (result['statusCode'] == 200) {
                  this.assignDrlist = result['dealer'];
              }
              else{
                  this.toast.errorToastr(result['statusMsg']);
              }

          }))
      }


        salesUser:any =[];
        getSalesUser(searcValue) {
            this.service.post_rqst({'search':searcValue}, "Influencer/salesUserList").subscribe((result => {
                if (result['statusCode'] == 200) {
                    this.salesUser = result['all_sales_user'];
                }
                else{
                    this.toast.errorToastr(result['statusMsg']);
                }
            }));
        }

        architectData:any ={};
        findArchitect(id){
            let index=  this.architectUser.findIndex(row=>row.id==id)
            if(index!= -1){
                let id= this.architectUser[index].id;
                let name= this.architectUser[index].name;
                let mobile_no= this.architectUser[index].mobile_no;
                this.architectData = {'id':id, 'name':name, 'mobile_no':mobile_no };
            }
        }



        contractorData:any ={};
        findContractor(id){
            let index=  this.contractorUser.findIndex(row=>row.id==id)
            if(index!= -1){
                let id = this.contractorUser[index].id;
                let name = this.contractorUser[index].name;
                let mobile_no= this.contractorUser[index].mobile_no;
                this.contractorData = {'id':id, 'name':name, 'mobile_no':mobile_no};
            }
        }



        MobileNumber(event: any) {
            const pattern = /[0-9\+\-\ ]/;
            let inputChar = String.fromCharCode(event.charCode);
            if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }

        }
        AdhaarNumber(event: any) {
            const pattern = /^[2-9]{1}[0-9]{3}\s{1}[0-9]{4}\s{1}[0-9]{4}$/;
            let inputChar = String.fromCharCode(event.charCode);
            if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }

        }
        Adhr_frnt_Upload(data: any)
        {
            for(let i=0;i<data.target.files.length;i++)
            {
                let files = data.target.files[i];
                if (files)
                {
                    let reader = new FileReader();
                    this.docFrontBase64 = true;
                    reader.onload = (e: any) => {
                        this.front_img_id = '';
                        this.data.document_image = e.target.result
                    }
                    reader.readAsDataURL(files);
                }
                else{
                    this.docFrontBase64 = false;
                }
                this.image.append(""+i,data.target.files[i],data.target.files[i].name);
            }
        }
        Adhr_bck_Upload(data: any)
        {
            for(let i=0;i<data.target.files.length;i++)
            {
                let files = data.target.files[i];
                if (files)
                {
                    this.back_img_id = '';
                    this.docBackBase64 = true;
                    let reader = new FileReader();
                    reader.onload = (e: any) => {
                        this.data.document_image_back = e.target.result
                    }
                    reader.readAsDataURL(files);
                }
                else{
                    this.docBackBase64 = false;
                }
                this.image.append(""+i,data.target.files[i],data.target.files[i].name);
            }
        }
        Pan_Upload(data: any)
        {
            for(let i=0;i<data.target.files.length;i++)
            {

                let files = data.target.files[i];
                if (files)
                {
                    this.pan_img_id = '';
                    this.panBase64 = true;
                    let reader = new FileReader();
                    reader.onload = (e: any) => {
                        this.data.pan_img = e.target.result
                    }
                    reader.readAsDataURL(files);
                }
                else{
                    this.panBase64 = false;
                }
                this.image.append(""+i,data.target.files[i],data.target.files[i].name);
            }
        }
        bankImg_Upload(data: any)
        {
            for(let i=0;i<data.target.files.length;i++)
            {

                let files = data.target.files[i];
                if (files)
                {
                    this.bank_img_id = '';
                    this.bankImgBase64 = true;
                    let reader = new FileReader();
                    reader.onload = (e: any) => {
                        this.data.bank_img = e.target.result
                    }
                    reader.readAsDataURL(files);
                }
                else{
                    this.bankImgBase64 = false;
                }
                this.image.append(""+i,data.target.files[i],data.target.files[i].name);
            }
        }

        getItemsList(search) {
            this.asmList = [];
            for (var i = 0; i < this.tmp_userList.length; i++) {
                search = search.toLowerCase();
                this.tmpsearch = this.tmp_userList[i]['name'].toLowerCase();
                if (this.tmpsearch.includes(search)) {
                    this.asmList.push(this.tmp_userList[i]);
                }
            }
        }

        assign_to_distributor(id, index, e) {
            if (e.checked) {
                this.assignUserId.push(id);
                this.assignUserList.push(this.asmList[index]);
            }
            else {
                var index_val = index;
                for (var j = 0; j < this.assignUserId.length; j++) {
                    if (this.asmList[index].id == this.assignUserId[j]) {
                        this.assignUserId.splice(j, 1);
                        this.removeUser(j);
                    }
                }
            }
        }

        removeUser(index) {
            this.assignUserList.splice(index, 1);
        }


        user_assign_check(value, index, event) {

            if (event.checked) {
                if (this.rsm.indexOf(this.asmList[index]['id']) === -1) {
                    this.rsm.push(value);
                }
            }
            else {
                for (var j = 0; j < this.asmList.length; j++) {
                    if (this.asmList[index]['id'] == this.rsm[j]) {
                        this.rsm.splice(j, 1);
                    }
                }
            }

            this.ass_user = this.rsm
        }

        product_Brand(value, index, event) {
            if (event.checked) {
                this.brand.push(value);
            }
            else {
                for (var j = 0; j < this.brand_list.length; j++) {
                    if (this.brand_list[index]['brand_name'] == this.brand[j]) {
                        this.brand.splice(j, 1);
                    }
                }
            }
        }



        back(): void {
            this.location.back()
        }


        DOBError: boolean = false;
        DOAError: boolean = false;

        assignUserName(userid){
            let Index = this.salesUser.findIndex(row => row.id == userid)
            if(Index != -1){
                this.data.user_assined_name = this.salesUser[Index].name;
            }else {
            }
        }

        submitDetail()
        {

          if( (this.data.type==2 || this.data.type==4) && (!this.data.document_image || !this.data.document_image_back)){
            this.toast.warningToastr('Upload Aadhar Image is Required!')
          return;

          }

          if( (this.data.type==2 || this.data.type==4) && !this.data.pan_img){
            this.toast.warningToastr('Upload PAN Image is Required!')
          return;

          }

            if(this.data.dob){
                this.data.dob = moment(this.data.dob).format('YYYY-MM-DD');
                this.data.dob=this.data.dob;
            }
            if(this.data.doa){
                this.data.doa = moment(this.data.doa).format('YYYY-MM-DD');
                this.data.doa=this.data.doa;
            }


            if(this.checkRight.scanning_rights == 'No' && this.checkRight.point_transfer_right == 'No'){
                this.data.architect_assign =  this.architectData;
                this.data.contractor_assign =  this.contractorData;

            }

            this.data.created_by_name=this.userName
            this.data.created_by_id=this.userId;
            this.savingFlag = true;
            let header
            if(this.params_id){
                this.data.update_id = this.params_id;
                this.data.panBase64 = this.panBase64;
                this.data.bankImgBase64 = this.bankImgBase64;
                this.data.docFrontBase64 = this.docFrontBase64;
                this.data.docBackBase64 = this.docBackBase64;
                header =this.service.post_rqst({"data":this.data,'type':Number(this.params_type),'influencer_type':this.params_network},"Influencer/updateInfluencer")
            }
            else
            {
                header =this.service.post_rqst({"data":this.data,'type':Number(this.params_type),'influencer_type':this.params_network},"Influencer/addInfluencer")
            }
            header.subscribe((result=>
                {
                    if (result['statusCode'] == 200) {
                      if(result['statusMsg']=='Success'){

                        this.rout.navigate(['/influencer/'+this.params_type+'/'+this.params_network+'/']);
                        this.toast.successToastr(result['statusMsg']);
                        this.savingFlag = false;

                      }
                      else{
                        this.toast.errorToastr(result['statusMsg']);
                        this.savingFlag = false;

                      }
                    }
                    else{
                        this.toast.errorToastr(result['statusMsg']);
                        this.savingFlag = false;
                    }

                }));
            }

        }

