import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService'
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { DatePipe, Location } from '@angular/common';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { param } from 'jquery';

@Component({
    selector: 'app-add-distribution',
    templateUrl: './add-distribution.component.html',
    animations: [slideToTop()],
    providers: [DatePipe],
})
export class AddDistributionComponent implements OnInit {
    savingFlag: boolean = false;
    states: any = [];
    district_list: any = [];
    userId: any;
    userName: any;
    params_id: any;
    params_type: any;
    brandList:any;
    city_list: any = [];
    city_area_list: any = [];
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
    pageType: any;
    
    
    
    constructor(
        public service: DatabaseService,
        public rout: Router,
        public location: Location,
        public route: ActivatedRoute,
        public toast: ToastrManager,
        public session: sessionStorage, 
        private http: HttpClient) {
            
            
            this.getSalesUser('');
            this. getBrand()
            this.getStateList();
            this.route.params.subscribe(params => {
                this.dr_type = params['id'];
                this.params_type = params['type'];
                this.pageType = params['pageType']
                
                if (params['type'] && params['id']) {
                    this.params_id = params['id'];
                    this.params_type = params['type'];
                    
                    
                    
                    if(params['pageType'] == 'edit'){
                        this.distributorDetail();
                        
                    }
                }
                this.myDate = new Date();
                this.userData = JSON.parse(localStorage.getItem('st_user'));
                this.userId = this.userData['data']['id'];
                this.userName = this.userData['data']['name'];
                
            });
        }
        
        ngOnInit() {
            this.searchMoviesCtrl.valueChanges.pipe(debounceTime(500), tap(() => {
                this.errorMsg = "";
                this.filter_data = [];
                this.isLoading = true;
            }),
            switchMap(value => this.http.post(this.service.dbUrl + "cp_suggestive/get_result", { 'value': value }).pipe(finalize(() => {
                this.isLoading = false
            })))).subscribe(data => {
                
                if (data['res'] == undefined) {
                    this.errorMsg = data['Error'];
                    this.filter_data = [];
                } else {
                    this.errorMsg = "";
                    this.filter_data = data['res'];
                }
            });
        }
        
        
        
        distributorDetail() {
            let id = { "id": this.params_type }
            this.service.post_rqst(id, "CustomerNetwork/distributorDetail").subscribe((result) => {
                if (result['statusCode'] == 200) {
                    this.data = result['distributor_detail'];
                    if(this.data.type == 3){
                        this.data.distributor_id = this.data.distributor_id.toString();
                    }
                    this.data.assigned_sales_user_name = this.data.assigned_sales_user_name.map(String);
                    this.data.credit_limit =  this.data.credit_limit.toString();
                    this.data.credit_period =  this.data.credit_period.toString();
                    this.data.id = result['distributor_detail']['id'];
                    if(this.data.distributor_id != ''){
                        this.distributorList('','');
                    }
                    if (this.data.state) {
                        this.getDistrict(1);
                    }
                    if (this.data.district != '') {
                        this.getArea(1);
                    }
                }
                else{
                    this.toast.errorToastr(result['statusMsg'])
                }
            })
        }
        
        getStateList() {
            this.service.post_rqst(0, "CustomerNetwork/getAllState").subscribe((response => {
                if(response['statusCode']==200){
                    
                    this.states = response['all_state'];
                }else{
                    this.toast.errorToastr(response['statusMsg']);
                }
            }));
        }
        
        
        
        getDistrict(val) {
            
            if (this.dr_type == 3) {
                this.distributorList('', this.data.state);
            }
            
            let st_name;
            if (val == 1) {
                st_name = this.data.state;
            }
            this.service.post_rqst({ 'state_name': st_name }, "CustomerNetwork/getAllDistrict").subscribe((response => {
                if(response['statusCode']==200){
                    
                    this.district_list = response['all_district'];
                }else{
                    this.toast.errorToastr(response['statusMsg']);
                }
            }));
        }
        
        
        getArea(val) {
            let dist_name;
            if (val == 1) {
                dist_name = this.data.district;
            }
            let value = { "state": this.data.state, "district": dist_name }
            this.service.post_rqst(value, "CustomerNetwork/getAreaData").subscribe((response => {
                if(response['statusCode'] == 200){
                    this.city_area_list = response['area'];
                }else{
                    this.toast.errorToastr(response['statusMsg']);
                }
                
            }));
        }
        
        salesUser: any = [];
        getSalesUser(searcValue) {
            this.service.post_rqst({ 'search': searcValue }, "CustomerNetwork/salesUserList").subscribe((response => {
                if(response['statusCode'] == 200){
                    this.salesUser = response['all_sales_user'];
                }else{
                    this.toast.errorToastr(response['statusMsg']);
                }
                
            }));
        }
        
        MobileNumber(event: any) {
            const pattern = /[0-9\+\-\ ]/;
            let inputChar = String.fromCharCode(event.charCode);
            if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
            
        }
        
        check_number() {
            if (this.data.mobile.length == 10) {
                this.service.post_rqst({ "mobile": this.data.mobile }, "CustomerNetwork/checkDrMobile").subscribe((result => {
                    if (result['statusCode']==200) {
                        this.exist = false;
                    }
                    else {
                        this.toast.errorToastr(result['statusMsg']);
                        this.exist = true;
                    }
                }))
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
               
    getBrand() {
            this.service.post_rqst({}, "CustomerNetwork/brandList").subscribe((result => {
                if(result['statusCode'] ==  200){
                  this.brandList = result['result'];
                }
                else{
                  this.toast.errorToastr(result['statusMsg'])
                }
              }))
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
        
        distributorList(searcValue, state) {
            this.service.post_rqst({ 'search': searcValue, 'state': state }, "CustomerNetwork/distributorsList").subscribe((result => {
                if(result['statusCode'] == 200){
                    this.drlist = result['distributors'];
                }else{
                    this.toast.errorToastr(result['statusMsg']);
                }
            }))
        }
        
        back(): void {
            this.location.back()
        }
        
        
        DOBError: boolean = false;
        DOAError: boolean = false;
        submitDetail() {
            
            if (this.userId != '1') {
                this.ass_user[0] = this.userId;
                this.data.sales_executive = this.ass_user;
            }
            
            if (this.data.dob) {
                this.data.dob = moment(this.data.dob).format('YYYY-MM-DD');
                this.data.dob = this.data.dob;
            }
            if (this.data.doa) {
                this.data.doa = moment(this.data.doa).format('YYYY-MM-DD');
                this.data.doa = this.data.doa;
            }
            this.data.created_by_name = this.userName
            this.data.created_by_id = this.userId;
            this.savingFlag = true;
            
            let header
            if (this.pageType == 'edit') {
                header = this.service.post_rqst({ "data": this.data, 'type': this.dr_type }, "CustomerNetwork/updateDistributors")
            }
            else {
                header = this.service.post_rqst({ "data": this.data, 'type': this.dr_type }, "CustomerNetwork/distributorsAdd")
            }
            header.subscribe((result => {
                
                if (result['statusCode'] == 200) {
                    this.rout.navigate(['distribution-list/params_id/params_type/distribution-detail/' + result['last_id']]);
                    this.toast.successToastr(result['statusMsg']);
                    this.service.dr_list();
                    
                }
                else if (result['statusCode'] == 200 && this.params_id) {
                    let state = this.data.state;
                    let id = this.data.id;
                    let type = this.params_type;
                    
                    this.rout.navigate(['distribution-list/params_id/params_type/distribution-detail/' + result['last_id']], { queryParams: { state, id, type } });
                    
                    this.toast.successToastr(result['statusMsg']);
                }
                else {
                    this.toast.errorToastr(result['statusMsg']);
                    this.savingFlag = false;
                }
                
            }));
        }
        
    }
    