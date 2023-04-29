import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from 'src/app/localstorage.service';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-designation-modal',
  templateUrl: './designation-modal.component.html',
  styleUrls: ['./designation-modal.component.scss']
})
export class DesignationModalComponent implements OnInit {
  assign_module_data: any = [];
  savingFlag: boolean = false;
  userData: any = {};
  skLoading: boolean = false;
  infoId: any = '';
  constructor(public toast: ToastrManager, @Inject(MAT_DIALOG_DATA) public modelData, public rout: Router, public session: sessionStorage, public service: DatabaseService, public dialogRef: MatDialogRef<DesignationModalComponent>) {
    this.infoId = modelData.info.id
    this.getExpenseDetail();
  }

  ngOnInit() {
  }

  assign_module(module_name, event, index) {
    if (event.checked) {
      this.assign_module_data[index][module_name] = 'true';
    }
    else {
      this.assign_module_data[index][module_name] = 'false';
    }
  }

  getExpenseDetail() {
    this.skLoading = true;
    this.service.post_rqst({ 'id': this.infoId }, "Master/designationDetail").subscribe(result => {
      if (result['statusCode'] == 200) {
        this.skLoading = false;
        this.assign_module_data = result['designation_detail']['assign_module'];
      } else {
        this.skLoading = false;
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.skLoading = false;
      this.toast.errorToastr('Something went wrong');
    });
  }

  submitDetail() {
    this.userData.assignModule = this.assign_module_data;
    this.userData.id = this.infoId;
    this.savingFlag = true;
    this.service.post_rqst({ 'userData': this.userData }, "Master/updateDesignationRole").subscribe((response => {
      if (response['statusCode'] == "200") {
        this.toast.successToastr(response['statusMsg']);
        this.dialogRef.close(true);
        this.savingFlag = false;
      }
      else {
        this.toast.errorToastr(response['statusMsg']);
        this.savingFlag = false;
      }
    }));
  }


}
