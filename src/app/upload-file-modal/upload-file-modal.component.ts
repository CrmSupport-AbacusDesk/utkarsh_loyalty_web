import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatProgressBarModule } from '@angular/material'
// import { DialogComponent } from 'src/app/dialog/dialog.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
// import { PearlService } from '';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-upload-file-modal',
  templateUrl: './upload-file-modal.component.html',
  styleUrls: ['./upload-file-modal.component.scss']
})
export class UploadFileModalComponent implements OnInit {

  url: any = ''
  excel_name: any = '';
  file: any = {};
  type: any = [];
  network_type: any;
  uploadurl: any;
  formData = new FormData();
  loader: any;
  come_from: any = ''
  payment_flag = '';
  excel_data: any = [];
  download_sample_area_excel_data: any = [];
  excel_loader: any = false;
  userData: any;
  modal_type: any;
  usersList: any = [];
  filter_data: any;
  userId: any;
  uploadError: boolean = false;
  uploadErrorMsg: any;
  uploadErrorMsgCount: any;
  userName: any;
  user_type: any
  excelLoader: boolean;
  segmentList: any;
  filter: any = {};
  savingFlag: boolean = false;


  constructor(@Inject(MAT_DIALOG_DATA) public data, public toast: ToastrManager, public serve: DatabaseService, public ActivatedRoute: ActivatedRoute, public dialog: DialogComponent, public dialogRef: MatDialogRef<UploadFileModalComponent>) {
    this.uploadurl = serve.uploadUrl + '';
    this.url = this.serve.uploadUrl;
    this.come_from = data['from'];
    this.modal_type = data['modal_type'];
    this.network_type = data['type'];
    this.filter_data = data['filter_data']
    if (data['type']) {
      this.type = data['type']
    }

    if (this.come_from == 'Travel Plan') {
      this.getSalesUserForReporting();
    }
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
  }
  ngOnInit() {
  }
  onUploadChange(evt, type) {
    this.user_type = type
    this.file = evt.target.files[0];
    this.excel_name = this.file['name'];
  }





  // Segment Update Excel Update Sample file start
  downloadUpdateSample() {
    this.serve.post_rqst({}, "Master/segmentUpdateDataDownload").subscribe((result) => {
      if (result['statusCode'] == 200) {
        document.location.replace(this.uploadurl + 'update_sample_file/updateCategory.csv');
        this.toast.successToastr(result['statusMsg']);
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    })
  }

  // Segment Update Excel Update Sample file end


  upload_user_data_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.loader = 1;
    this.serve.FileData(this.formData, 'Import/import_visiting_target_excel')
      .subscribe(d => {

        this.dialogRef.disableClose = false;
        this.formData = new FormData();
        if (d['msg'] == 'Data Imported successfully') {
          this.dialog.success("Excel Uploaded", " Successfully");
          this.dialogRef.close();
          setTimeout(() => {
            this.loader = '';
          }, 700);
          return;
        }
        else {
          setTimeout(() => {
            this.loader = '';
          }, 700);
          this.dialog.error(d['msg']);
          return;
        }

      }, err => { });
  }


  userUpdateSample() {
    this.serve.post_rqst({}, "Master/generateExcelForUpdateUser").subscribe((result) => {
      if (result['statusCode'] == 200) {
        document.location.replace(this.uploadurl + 'update_sample_file/updateUser.csv');
        this.toast.successToastr(result['statusMsg']);
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    })

  }
  download_sample_excel() {
    this.serve.post_rqst({}, "Master/generateExcelForUser").subscribe((result) => {
      if (result['statusCode'] == 200) {
        document.location.replace(this.uploadurl + 'update_sample_file/User.csv');
        this.toast.successToastr(result['statusMsg']);
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    })

  }


  upload_salesUser_data_excel(type) {
    this.formData.append('category', this.file, this.file.name);
    this.formData.append('created_by_id', this.userId)
    this.formData.append('created_by_name', this.userName)
    this.dialogRef.disableClose = true;
    this.excel_loader = true;
    let header
    if (type == 'insert') {
      header = this.serve.FileData(this.formData, 'Master/uploadUserInBulkByCsv');
    }
    else {
      header = this.serve.FileData(this.formData, 'Master/updateUserInBulkByCsv');
    }

    header.subscribe(result => {
      this.dialogRef.disableClose = false;
      this.formData = new FormData();
      if (result['statusCode'] == 200) {
        this.toast.successToastr(result['statusMsg']);
        this.excel_loader = false;
        this.dialogRef.close();
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
        this.excel_loader = false;
      }
    }, err => { });
  }


  upload_segment_data_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.formData.append('created_by_id', this.userId)
    this.formData.append('created_by_name', this.userName)
    this.formData.append('operation_type', this.modal_type)
    this.excel_loader = true
    this.serve.FileData(this.formData, 'Master/uploadSegmentInBulkByCsv').subscribe(d => {

      this.dialogRef.disableClose = false;
      this.formData = new FormData();
      if (d['statusCode'] == 200) {
        this.toast.successToastr(d['statusMsg']);
        this.dialogRef.close();
        setTimeout(() => {
          this.excel_loader = false;
        }, 700);
        return;
      }
      else {
        setTimeout(() => {
          this.excel_loader = false;
        }, 700);
        this.toast.errorToastr(d['statusMsg']);
        return;
      }

    }, err => { });
  }

  upload_customer_data_excel() {
    this.dialogRef.disableClose = true;

    this.formData.append('category', this.file, this.file.name);
    this.formData.append('created_by_id', this.userId)
    this.formData.append('created_by_name', this.userName)
    this.formData.append('operation_type', this.modal_type)
    this.loader = 1;
    this.serve.FileData(this.formData, 'demoapi/demoapi').subscribe(d => {

      this.dialogRef.disableClose = false;
      this.formData = new FormData();
      if (d['msg'] == 'Data Imported successfully') {
        this.dialog.success("Excel Uploaded", " Successfully");
        this.dialogRef.close();
        setTimeout(() => {
          this.loader = '';
        }, 700);
        return;
      }
      else {
        setTimeout(() => {
          this.loader = '';
        }, 700);
        this.dialog.error(d['msg']);
        return;
      }

    }, err => { });
  }


  distributorSample() {
    if (this.network_type == 1) {
      document.location.replace(this.uploadurl + 'sample_file/DistributorUpload.csv');
    }
    else if (this.network_type == 3) {
      document.location.replace(this.uploadurl + 'sample_file/RetailerUpload.csv');
    }

    else {
      document.location.replace(this.uploadurl + 'sample_file/DirectDealerUpload.csv');
    }
  }

  otherSample(type) {
    let CsvName
    if (this.network_type == '1') {
      CsvName = 'Distributor'
    }
    else if (this.network_type == '3') {
      CsvName = 'Retailer'
    }
    else {
      CsvName = 'DirectDealer'
    }

    if (type == 'geo_location') {
      this.serve.post_rqst({ 'type': this.network_type, 'type_name': CsvName }, "CustomerNetwork/generateExcelForLatLngUpdate").subscribe((result) => {
        if (result['statusCode'] == 200) {
          document.location.replace(this.uploadurl + 'update_sample_file/' + CsvName + 'geoLocationUpdate.csv');
        }
      })
    }
    else if (type == 'credit_limit') {
      this.serve.post_rqst({ 'type': this.network_type, 'type_name': CsvName }, "CustomerNetwork/generateExcelForCreditLimitUpdate").subscribe((result) => {
        if (result['statusCode'] == 200) {
          document.location.replace(this.uploadurl + 'update_sample_file/' + CsvName + 'CreditLimitUpdate.csv');
        }
      })
    }
    else {
      this.serve.post_rqst({ 'type': this.network_type, 'type_name': CsvName }, "CustomerNetwork/generateExcelForbasicUpdate").subscribe((result) => {
        if (result['statusCode'] == 200) {
          document.location.replace(this.uploadurl + 'update_sample_file/' + result['response']);
        }
        else {
          this.toast.errorToastr(result['statusMsg']);
        }
      })
    }

  }



  upload_distribution_excel(type) {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.formData.append('created_by_id', this.userId);
    this.formData.append('created_by_name', this.userName);
    this.formData.append('type', this.type);

    this.excel_loader = true;
    let header

    if ((this.network_type == 1 || this.network_type == 7) && type == 'credit_limit') {
      header = this.serve.FileData(this.formData, 'CustomerNetwork/updateCreditLimit')
    }

    else if ((this.network_type == 1 || this.network_type == 3 || this.network_type == 7) && type == 'geo_location') {
      header = this.serve.FileData(this.formData, 'CustomerNetwork/updateGeoLocation')
    }

    else if (type == 'update') {
      header = this.serve.FileData(this.formData, 'CustomerNetwork/updateCustomerBasicDetails')
    }


    else if (this.network_type == 3 && type == 'insert') {
      header = this.serve.FileData(this.formData, 'CustomerNetwork/importRetailerExcel')
    }

    else {
      header = this.serve.FileData(this.formData, 'CustomerNetwork/importDistributorExcel')

    }
    header.subscribe(d => {
      this.dialogRef.disableClose = false;
      this.formData = new FormData();
      if (d['statusCode'] == 200) {
        this.toast.successToastr(d['statusMsg']);
        this.dialogRef.close();
        this.excel_loader = false;
        this.serve.dr_list();

        return;
      }



    }, () => {
      this.toast.errorToastr('Something went wrong');
      this.excel_loader = false;
    });




  }


  upload_lead_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.formData.append('id', this.userId);
    this.formData.append('created_by_id', this.userId)
    this.formData.append('created_by_name', this.userName)
    this.excel_loader = true;
    this.serve.FileData(this.formData, 'Enquiry/add_enquiry_by_csv')
      .subscribe(d => {
        this.dialogRef.disableClose = false;
        this.formData = new FormData();
        if (d['msg'] == 'Data Imported successfully') {
          this.dialog.success("Excel Uploaded", " Successfully");
          this.dialogRef.close();
          setTimeout(() => {
            this.excel_loader = false;
          }, 700);
          return;
        }
        else {
          setTimeout(() => {
            this.excel_loader = false;
          }, 700);
          this.dialog.error(d['msg']);
          return;
        }

      }, err => { });
  }
  upload_travel_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('file', this.file, this.file.name);
    this.formData.append('id', this.userId);
    this.loader = 1;
    this.serve.FileData(this.formData, 'Travel/import_travel_excel')
      .subscribe(d => {

        this.dialogRef.disableClose = false;
        this.formData = new FormData();
        if (d['msg'] == 'Data Imported successfully') {
          this.dialog.success("Excel Uploaded", " Successfully");
          this.dialogRef.close();
          setTimeout(() => {
            this.loader = '';
          }, 700);
          return;
        }
        else {
          setTimeout(() => {
            this.loader = '';
          }, 700);
          this.dialog.error(d['msg']);
          return;
        }

      }, err => { });
  }
  upload_beat_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('file', this.file, this.file.name);
    this.formData.append('id', this.userId);
    this.loader = 1;
    this.serve.FileData(this.formData, 'Import/importBeatCode_excel')
      .subscribe(d => {

        this.dialogRef.disableClose = false;
        this.formData = new FormData();
        if (d['msg'] == 'Data Imported successfully') {
          this.dialog.success("Excel Uploaded", " Successfully");
          this.dialogRef.close();
          setTimeout(() => {
            this.loader = '';
          }, 700);
          return;
        }
        else {
          setTimeout(() => {
            this.loader = '';
          }, 700);
          this.dialog.error(d['msg']);
          return;
        }

      }, err => { });
  }



  targetSample() {

    if (this.modal_type == 'add new' && this.come_from == 'distributor_target') {
      this.serve.post_rqst({ 'type': this.network_type }, "Target/generateExcelForDistributorTargetUpload").subscribe((result) => {
        if (result['statusCode'] == 200) {
          document.location.replace(this.uploadurl + 'sample_file/DistributorTargetUpload.csv');
        }
        else {
          this.toast.errorToastr(result['statusMsg']);
        }
      })
    }
    if (this.modal_type == 'update' && this.come_from == 'distributor_target') {

      if (!this.filter.month) {
        this.toast.errorToastr("Please select month!");
        return;
      }

      if (!this.filter.year) {
        this.toast.errorToastr("Please enter year!");
        return;
      }

      if (this.filter.year.length < 4) {
        this.toast.errorToastr("Year is not valid");
        return;
      }

      this.serve.post_rqst({ 'type': this.network_type, 'month': this.filter.month, 'year': this.filter.year }, "Target/generateExcelForDistributorTargetUpdate").subscribe((result) => {
        if (result['statusCode'] == 200) {
          document.location.replace(this.uploadurl + 'update_sample_file/DistributorTargetUpdate.csv');
        }
        else {
          this.toast.errorToastr(result['statusMsg']);
        }
      })
    }



  }
  upload_distributor_data_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.excel_loader = true;

    let header

    if (this.modal_type == 'add new') {
      header = this.serve.FileData(this.formData, 'Target/importDistributorTargetexcel')
    }
    else {
      header = this.serve.FileData(this.formData, 'Target/importDistributorTargetexcel')
    }



    header.subscribe(result => {
      this.dialogRef.disableClose = false;
      this.formData = new FormData();

      if (result['statusCode'] == 200) {
        this.toast.successToastr(result['statusMsg']);
        this.excel_loader = false;
        this.dialogRef.close();
      }

      else {
        // this.toast.errorToastr(d['statusMsg']);
        this.excel_loader = false;
        this.uploadError = true;
        this.uploadErrorMsg = result['statusMsg'];
        this.uploadErrorMsgCount = result['response'];
        this.excel_loader = false;

      }

    }, err => {
      this.toast.errorToastr('Something went wrong');
      this.excel_loader = false;
    });
  }

  secondaryTargetSample() {
    if (this.modal_type == 'secondary sale' && this.come_from == 'secondary_target') {
      this.serve.post_rqst({ 'type': this.network_type }, "Target/generateExcelForEmpSecTargetupload").subscribe((result) => {
        if (result['statusCode'] == 200) {
          document.location.replace(this.uploadurl + 'sample_file/EmployeeSecondaryTargetUpload.csv');
        }
        else {
          this.toast.errorToastr(result['statusMsg']);
        }
      })
    }
    if (this.modal_type == 'secondary sale Update' && this.come_from == 'secondary_target') {

      if (!this.filter.month) {
        this.toast.errorToastr("Please select month!");
        return;
      }

      if (!this.filter.year) {
        this.toast.errorToastr("Please enter year!");
        return;
      }

      if (this.filter.year.length < 4) {
        this.toast.errorToastr("Year is not valid");
        return;
      }

      this.serve.post_rqst({ 'type': this.network_type, 'month': this.filter.month, 'year': this.filter.year }, "Target/generateExcelForEmpSecTargetupdate").subscribe((result) => {
        if (result['statusCode'] == 200) {
          document.location.replace(this.uploadurl + 'update_sample_file/EmployeeSecondaryTargetUpdate.csv');
        }
        else {
          this.toast.errorToastr(result['statusMsg']);
        }
      })
    }
  }


  upload_secondary_data_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.excel_loader = true;

    let header

    if (this.modal_type == 'secondary sale') {
      header = this.serve.FileData(this.formData, 'Target/importUserTargetexcel')
    }
    else {
      header = this.serve.FileData(this.formData, 'Target/importUserTargetexcel')
    }
    header.subscribe(result => {
      this.dialogRef.disableClose = false;
      this.formData = new FormData();
      if (result['statusCode'] == 200) {
        this.toast.successToastr(result['statusMsg']);
        this.excel_loader = false;
        this.dialogRef.close();
      }
      else {
        // this.toast.errorToastr(d['statusMsg']);
        this.excel_loader = false;
        this.uploadError = true;
        this.uploadErrorMsg = result['statusMsg'];
        this.uploadErrorMsgCount = result['response'];
        this.excel_loader = false;

      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
      this.excel_loader = false;
    });
  }


  visitSample() {

    if (this.modal_type == 'visit add' && this.come_from == 'user_visit_target') {
      this.serve.post_rqst({ 'type': this.network_type }, "Target/generateExcelForEmpvisitTargetupload").subscribe((result) => {
        if (result['statusCode'] == 200) {
          document.location.replace(this.uploadurl + 'sample_file/EmployeeVisitTargetUpload.csv');
        }
        else {
          this.toast.errorToastr(result['statusMsg']);
        }
      })
    }
    if (this.modal_type == 'visit update' && this.come_from == 'user_visit_target') {

      if (!this.filter.month) {
        this.toast.errorToastr("Please select month!");
        return;
      }

      if (!this.filter.year) {
        this.toast.errorToastr("Please enter year!");
        return;
      }

      if (this.filter.year.length < 4) {
        this.toast.errorToastr("Year is not valid");
        return;
      }

      this.serve.post_rqst({ 'type': this.network_type, 'month': this.filter.month, 'year': this.filter.year }, "Target/generateExcelForEmpvisitTargetupdate").subscribe((result) => {
        if (result['statusCode'] == 200) {
          document.location.replace(this.uploadurl + 'update_sample_file/EmployeeVisitTargetUpdate.csv');
        }
        else {
          this.toast.errorToastr(result['statusMsg']);
        }
      })
    }
  }


  upload_user_visit_data_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.excel_loader = true;
    let header;
    if (this.modal_type == 'visit update' && this.come_from == 'user_visit_target') {
      header = this.serve.FileData(this.formData, 'Target/importVisitingTargetExcel')
    }

    else {
      header = this.serve.FileData(this.formData, 'Target/importVisitingTargetExcel')
    }
    header.subscribe(result => {
      this.dialogRef.disableClose = false;
      this.formData = new FormData();
      if (result['statusCode'] == 200) {
        this.toast.successToastr(result['statusMsg'])
        this.dialogRef.close();
        this.excel_loader = false;
      }
      else {
        // this.toast.errorToastr(d['statusMsg']);
        this.excel_loader = false;
        this.uploadError = true;
        this.uploadErrorMsg = result['statusMsg'];
        this.uploadErrorMsgCount = result['response'];
        this.excel_loader = false;

      }
    }, err => { });
  }




  upload_billing_data_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.loader = 1;
    this.serve.FileData(this.formData, 'Excel_import_data/import_tally_bill_data_by_excel')
      .subscribe(d => {

        this.dialogRef.disableClose = false;
        this.formData = new FormData();
        if (d['msg'] == 'Data Imported successfully') {
          this.dialog.success("Excel Uploaded", " Successfully");
          this.dialogRef.close();
          setTimeout(() => {
            this.loader = '';
          }, 700);


          return;
        }
        else {
          this.dialog.error(d['msg']);
          setTimeout(() => {
            this.loader = '';
          }, 700);
          return;

        }

      }, err => { });
  }
  upload_invoice_excel() {
    this.dialogRef.disableClose = true;

    this.formData.append('category', this.file, this.file.name);
    this.loader = 1;
    this.serve.FileData(this.formData, 'Account/bulkUploadOfInvoiceByCsv')

      .subscribe(d => {

        this.dialogRef.disableClose = false;
        this.formData = new FormData();
        if (d['status'] == 200) {
          this.dialog.success("Excel Uploaded", d['statusMsg']);
          this.dialogRef.close();
          setTimeout(() => {
            this.loader = '';
          }, 700);


          return;
        }
        else {
          this.dialog.error(d['statusMsg']);
          setTimeout(() => {
            this.loader = '';
          }, 700);
          return;

        }

      }, err => { });
  }
  upload_payment_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.loader = 1;

    this.serve.FileData(this.formData, 'Account/bulkUploadPaymentByCsv')


      .subscribe(d => {

        this.dialogRef.disableClose = false;
        this.formData = new FormData();
        if (d['statusCode'] == 200) {
          this.dialog.success("Excel Uploaded", d['statusMsg']);
          this.dialogRef.close();
          setTimeout(() => {
            this.loader = '';
          }, 700);


          return;
        }
        else {
          this.dialog.error(d['statusMsg']);
          setTimeout(() => {
            this.loader = '';
          }, 700);
          return;

        }

      }, err => { });
  }
  upload_payment_data_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.loader = 1;
    this.serve.FileData(this.formData, 'Excel_import_data/tally_payment_receipt_by_excel')

      .subscribe(d => {

        this.dialogRef.disableClose = false;
        this.formData = new FormData();
        if (d['msg'] == 'Data Imported successfully') {
          this.dialog.success("Excel Uploaded", " Successfully");
          this.dialogRef.close();
          setTimeout(() => {
            this.loader = '';
          }, 700);


          return;
        }
        else {
          this.dialog.error(d['msg']);
          setTimeout(() => {
            this.loader = '';
          }, 700);
          return;

        }

      }, err => { });
  }
  upload_credit_note_data_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.loader = 1;
    this.serve.FileData(this.formData, 'Account/bulkUploadCreditNoteByCsv')

      .subscribe(d => {

        this.dialogRef.disableClose = false;
        this.formData = new FormData();
        if (d['statusCode'] == 200) {
          this.dialog.success("Excel Uploaded", d['statusMsg']);
          this.dialogRef.close();
          setTimeout(() => {
            this.loader = '';
          }, 700);


          return;
        }
        else {
          this.dialog.error(d['statusMsg']);
          setTimeout(() => {
            this.loader = '';
          }, 700);
          return;

        }

      }, err => { });
  }

  bonusSample(type) {
    document.location.replace(this.uploadurl + 'sample_file/Assign Influencer Sample File.csv');
  }

  upload_bonus_user_data_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.formData.append('district', this.data['district'])
    this.formData.append('userType', this.data['user_type'])
    this.formData.append('bonus_id', this.data['bonus_id'])
    this.formData.append('influencerType', this.data['influencer_type'])
    this.excel_loader = true;
    this.serve.FileData(this.formData, 'Bonus/uploadBonusInfluencerInBulk')

      .subscribe(d => {

        this.dialogRef.disableClose = false;
        this.formData = new FormData();
        if (d['statusCode'] == 200) {
          this.dialog.success("Excel Uploaded", d['statusMsg']);
          this.dialogRef.close();
          setTimeout(() => {
            this.excel_loader = false;

          }, 700);


          return;
        }
        else {
          this.dialog.error(d['statusMsg']);
          setTimeout(() => {
            this.loader = '';
          }, 700);
          return;

        }

      }, err => { });
  }


  upload_travel_plan_data_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.excel_loader = true;
    this.serve.FileData(this.formData, 'Travel/importUserTravelExcel')
      .subscribe(d => {
        this.dialogRef.disableClose = false;
        this.formData = new FormData();
        if (d['statusCode'] == 200) {
          this.dialog.success("Excel Uploaded", d['statusMsg']);
          this.dialogRef.close();
          setTimeout(() => {
            this.excel_loader = false;
          }, 700);
          return;
        }
        else {
          this.uploadError = true;
          this.uploadErrorMsg = d['statusMsg'];
          this.uploadErrorMsgCount = d['response'];
          setTimeout(() => {
            this.loader = '';
            this.excel_loader = false;


          }, 700);
          return;
        }

      }, err => {
        this.excel_loader = false;

      });
  }

  getSalesUserForReporting() {
    this.serve.post_rqst({}, 'Travel/getSalesUserForReporting').subscribe((r) => {
      if (r['all_sales_user']['statusCode'] == 200) {
        this.usersList = r['all_sales_user']['all_sales_user'];
      }
      else {
        this.toast.errorToastr(r['statusMsg']);
      }
    }, err => {

    })

  }

  downloadSampleFile() {
    this.serve.post_rqst({ 'filter': this.filter }, 'Travel/exportTravelPlanUpload').subscribe((r) => {
      if (r['statusCode'] == 200) {
        document.location.replace(this.url + 'update_sample_file/' + r['filename']);
      }
      else {
        this.toast.errorToastr(r['statusMsg']);
      }
    }, err => {

    })

  }

}
