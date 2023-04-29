import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.component.html'
})

export class TaskAddComponent implements OnInit {
  savingFlag: boolean = false;
  data: any = {};
  urls = new Array<string>();
  selectedFile = [];
  formData = new FormData();
  userData: any;
  userId: any;
  userName: any;
  assign_login_data: any = [];
  users: any = [];

  constructor(public serve: DatabaseService, public rout: Router, public toast: ToastrManager, public session: sessionStorage, public dialog: DialogComponent) {
    this.assign_login_data = this.session.getSession();
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
    this.data.created_by_type = this.userData['data']['user_type'];

    this.getUsers('')
  }

  ngOnInit() {
  }

  insertImage(data) {
    let files = data.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.urls.push(e.target.result);
        }
        reader.readAsDataURL(file);
      }
    }

    for (var i = 0; i < data.target.files.length; i++) {
      this.selectedFile.push(data.target.files[i]);
    }
  }
  fileChange(event: any) {
    for (var i = 0; i < event.target.files.length; i++) {
      this.selectedFile.push(event.target.files[i]);
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.urls.push(e.target.result);
        for (let index = 0; index < this.selectedFile.length; index++) {
          for (let urlIndex = 0; urlIndex < this.urls.length; urlIndex++) {
            if (index == urlIndex) {
              this.selectedFile[index]['path'] = this.urls[urlIndex];
            }
          }
        }
      }
      reader.readAsDataURL(event.target.files[i]);
    }
  }
  remove_image(i: any) {
    console.log(i);
    this.urls.splice(i, 1);
    this.selectedFile.splice(i, 1);
  }


  getUsers(searcValue) {
    this.serve.post_rqst({ 'search': searcValue }, "Task/getUserList").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.users = result['data']
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }));
  }

  delete_img(index: any) {
    this.urls.splice(index, 1)
  }

  getInfo(id) {
    let index = this.users.findIndex(row => row.id == id)
    if (index != -1) {
      this.data.name = this.users[index].name;
      this.data.user_type = this.users[index].user_type;
    }
  }


  submitDetail() {
    this.data.created_by_id = this.userId;
    this.data.created_by_name = this.userName;
    this.data.attachment = this.selectedFile;
    this.savingFlag = true;
    this.serve.post_rqst({ 'data': this.data }, "Task/addTask").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.toast.successToastr(result['statusMsg']);
        this.rout.navigate(['/task-list']);
        this.savingFlag = false;
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
        this.savingFlag = false;
      }
    }));
  }

  public publicDate(date): void {
    this.data.promise_date = moment(date).format('YYYY-MM-DD');
  }



}
