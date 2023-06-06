import { Component, OnInit } from '@angular/core';
import { slideToRight } from '../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { Router, ActivatedRoute } from '@angular/router';
import { sessionStorage } from '../localstorage.service';
import { DialogComponent } from '../dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  animations: [slideToRight()]
})
export class LoginComponent implements OnInit {

  data: any = [];
  peraluser: any = {};
  st_user: any = {};
  nexturl: any;
  channel_partner: boolean = false;
  cp_otp: any;
  edit_view:boolean=false;
  tokenInfo: any = '';

  constructor(public serve: DatabaseService, public rout: Router, public session: sessionStorage, public dialog: DialogComponent, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  }

  login() {
    // this.session.setSession(this.data['username'],this.data['password']);

    let value = { "username": this.data['username'], "password": this.data['password'] }
    this.serve.auth_rqust(value, "login/submitnew").subscribe((data: any) => {


      if (data['data']['id'] != '1' && data['data']['id'] != '432' && data['data']['id'] != '433' && data['data']['id'] != '434' && data['data']['id'] != '435') {
        for (let i = 0; i < data['assignModule'].length; i++) {
          if ((data['assignModule'][i]['module_name'] == 'Enquiry' && data['assignModule'][i]['view'] == 'true')) {
            data['data']['view_enquiry'] = 1;
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_enquiry'] = 1
            }
            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_enquiry'] = 1;
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_enquiry'] = 1;
            }
            if (data['assignModule'][i]['import'] == 'true') {
              data['data']['import_enquiry'] = 1;
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Dashboard' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_dashboard'] = 1
          }
          else if (data['assignModule'][i]['module_name'] == 'Enquiry' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_enquiry'] = 1
          }
          else if (data['assignModule'][i]['module_name'] == 'Influencer Network' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_influencer_network'] = 1
            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_influencer'] = 1;
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_influencer'] = 1;
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_influencer'] = 1;
            }
            if (data['assignModule'][i]['delete'] == 'true') {
              data['data']['delete_influencer'] = 1;
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Customer Network' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_customer_network'] = 1
            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_customer_network'] = 1;
            }
            if (data['assignModule'][i]['import'] == 'true') {
              data['data']['import_customer_network'] = 1;
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_customer_network'] = 1;
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_customer_network'] = 1;
            }

          }

          else if (data['assignModule'][i]['module_name'] == 'Channel Partner' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_customer_network'] = 1
            data['data']['view_channel_partner'] = 1
            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_channel_partner'] = 1;
            }
            if (data['assignModule'][i]['import'] == 'true') {
              data['data']['import_channel_partner'] = 1;
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_channel_partner'] = 1;
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_channel_partner'] = 1;
            }

          }

          else if (data['assignModule'][i]['module_name'] == 'Dealer' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_customer_network'] = 1
            data['data']['view_dealer'] = 1
            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_dealer'] = 1;
            }
            if (data['assignModule'][i]['import'] == 'true') {
              data['data']['import_dealer'] = 1;
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_dealer'] = 1;
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_dealer'] = 1;
            }
          }

          else if (data['assignModule'][i]['module_name'] == 'Direct Dealers' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_customer_network'] = 1
            data['data']['view_direct_dealers'] = 1
            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_direct_dealers'] = 1;
            }
            if (data['assignModule'][i]['import'] == 'true') {
              data['data']['import_direct_dealers'] = 1;
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_direct_dealers'] = 1;
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_direct_dealers'] = 1;
            }
          }

          else if (data['assignModule'][i]['module_name'] == 'Primary Orders' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_orders'] = 1
            data['data']['view_primary_orders'] = 1

            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_primary_order'] = 1;
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_primary_order'] = 1;
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_primary_order'] = 1;
            }
            if (data['assignModule'][i]['delete'] == 'true') {
              data['data']['delete_primary_order'] = 1;
            }
          }

          else if (data['assignModule'][i]['module_name'] == 'Secondary Orders' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_orders'] = 1
            data['data']['view_secondary_orders'] = 1

            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_secondary_orders'] = 1;
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_secondary_orders'] = 1;
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_secondary_orders'] = 1;
            }
            if (data['assignModule'][i]['delete'] == 'true') {
              data['data']['delete_secondary_orders'] = 1;
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Invoice' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_accounts'] = 1
            data['data']['view_invoice'] = 1

            if (data['assignModule'][i]['import'] == 'true') {
              data['data']['import_invoice'] = 1;
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_invoice'] = 1;
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Payment' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_accounts'] = 1
            data['data']['view_payment'] = 1

            if (data['assignModule'][i]['import'] == 'true') {
              data['data']['import_payment'] = 1;
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_payment'] = 1;
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Attendance' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_attendence'] = 1
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_attendence'] = 1
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_attendence'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Check In' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_check_in'] = 1;
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_checkin'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Leave' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_leaves'] = 1
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_leaves'] = 1
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_leaves'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Travel Plan' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_travel_plan'] = 1
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_travel_list'] = 1
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_travel_list'] = 1
            }
            if (data['assignModule'][i]['delete'] == 'true') {
              data['data']['delete_travel_list'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Follow Up' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_follow_up'] = 1
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_follow_up'] = 1
            }
            if (data['assignModule'][i]['delete'] == 'true') {
              data['data']['delete_follow_up'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Announcement' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_announcement'] = 1
            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_announcement'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Expense' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_expense'] = 1
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_expense'] = 1
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_expense'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Event Plan' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_event_plan'] = 1
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_event_plan'] = 1
            }
          }

          else if (data['assignModule'][i]['module_name'] == 'Pop & Gift' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_pop_gift'] = 1
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_pop_gift'] = 1
            }
            if (data['assignModule'][i]['delete'] == 'true') {
              data['data']['delete_pop_gift'] = 1
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_pop_gift'] = 1
            }
            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_pop_gift'] = 1
            }

          }
          else if (data['assignModule'][i]['module_name'] == 'Survey' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_survey'] = 1

            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_survey'] = 1
            }
            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_survey'] = 1
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_survey'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Gift Gallery' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_gift'] = 1
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_gift_gallery'] = 1
            }
            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_gift_gallery'] = 1
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_gift_gallery'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Bonus Points' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_bonus_points'] = 1
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_bonus_points'] = 1
            }
            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_bonus_points'] = 1
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_bonus_points'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Coupon Codes') {
            if (data['assignModule'][i]['view'] == 'true') {
              data['data']['view_coupon_code'] = 1
            }

            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_coupon_code'] = 1
            }
            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_coupon_code'] = 1
            }
            if (data['assignModule'][i]['delete'] == 'true') {
              data['data']['delete_coupon_code'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Dispatch' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_dispatch'] = 1
            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_dispatch'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Redeem Request' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_redeem_request'] = 1
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_redeem_request'] = 1
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_redeem_request'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Employee Target' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_target'] = 1
            data['data']['view_employee_target'] = 1
            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_employee_target'] = 1
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_employee_target'] = 1
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_employee_target'] = 1
            }
            if (data['assignModule'][i]['delete'] == 'true') {
              data['data']['delete_employee_target'] = 1
            }
            if (data['assignModule'][i]['import'] == 'true') {
              data['data']['import_employee_target'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Distributor Target' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_target'] = 1
            data['data']['view_distributor_target'] = 1

            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_distributor_target'] = 1
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_distributor_target'] = 1
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_distributor_target'] = 1
            }
            if (data['assignModule'][i]['delete'] == 'true') {
              data['data']['delete_distributor_target'] = 1
            }
            if (data['assignModule'][i]['import'] == 'true') {
              data['data']['import_distributor_target'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Category') && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_master'] = 1
            data['data']['view_category'] = 1

            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_category_master'] = 1
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_category_master'] = 1
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_category_master'] = 1
            }
            if (data['assignModule'][i]['delete'] == 'true') {
              data['data']['delete_category_master'] = 1
            }
            if (data['assignModule'][i]['import'] == 'true') {
              data['data']['import_category_master'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Sub Category') && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_master'] = 1
            data['data']['view_sub_category'] = 1

            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_sub_category_master'] = 1
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_sub_category_master'] = 1
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_sub_category_master'] = 1
            }
            if (data['assignModule'][i]['delete'] == 'true') {
              data['data']['delete_sub_category_master'] = 1
            }
            if (data['assignModule'][i]['import'] == 'true') {
              data['data']['import_sub_category_master'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Products') && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_master'] = 1
            data['data']['view_products'] = 1

            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_products_master'] = 1
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_products_master'] = 1
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_products_master'] = 1
            }
            if (data['assignModule'][i]['delete'] == 'true') {
              data['data']['delete_products_master'] = 1
            }
            if (data['assignModule'][i]['import'] == 'true') {
              data['data']['import_products_master'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'PDF') && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_master'] = 1
            data['data']['view_pdf'] = 1


            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_pdf_master'] = 1
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_pdf_master'] = 1
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_pdf_master'] = 1
            }
            if (data['assignModule'][i]['delete'] == 'true') {
              data['data']['delete_pdf_master'] = 1
            }
            if (data['assignModule'][i]['import'] == 'true') {
              data['data']['import_pdf_master'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Leave Master') && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_master'] = 1
            data['data']['view_leave_master'] = 1

            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_leave_master'] = 1
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_leave_master'] = 1
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_leave_master'] = 1
            }
            if (data['assignModule'][i]['delete'] == 'true') {
              data['data']['delete_leave_master'] = 1
            }
            if (data['assignModule'][i]['import'] == 'true') {
              data['data']['import_leave_master'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Users') && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_master'] = 1
            data['data']['view_users'] = 1
            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_users_master'] = 1
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_users_master'] = 1
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_users_master'] = 1
            }
            if (data['assignModule'][i]['delete'] == 'true') {
              data['data']['delete_users_master'] = 1
            }
            if (data['assignModule'][i]['import'] == 'true') {
              data['data']['import_users_master'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Designation') && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_master'] = 1
            data['data']['view_designation'] = 1
            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_users_designation'] = 1
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_users_designation'] = 1
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_users_designation'] = 1
            }
            if (data['assignModule'][i]['delete'] == 'true') {
              data['data']['delete_users_designation'] = 1
            }
            if (data['assignModule'][i]['import'] == 'true') {
              data['data']['import_users_designation'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Customer Category') && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_master'] = 1
            data['data']['view_customer_category'] = 1

            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_customer_master'] = 1
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_customer_master'] = 1
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_customer_master'] = 1
            }
            if (data['assignModule'][i]['delete'] == 'true') {
              data['data']['delete_customer_master'] = 1
            }
            if (data['assignModule'][i]['import'] == 'true') {
              data['data']['import_customer_master'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Influencer Category') && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_master'] = 1
            data['data']['view_infulencer_category'] = 1

            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_infulencer_master'] = 1
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_infulencer_master'] = 1
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_infulencer_master'] = 1
            }
            if (data['assignModule'][i]['delete'] == 'true') {
              data['data']['delete_infulencer_master'] = 1
            }
            if (data['assignModule'][i]['import'] == 'true') {
              data['data']['import_infulencer_master'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Point Category') && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_master'] = 1
            data['data']['view_point_category'] = 1


            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_point_master'] = 1
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_point_master'] = 1
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_point_master'] = 1
            }
            if (data['assignModule'][i]['delete'] == 'true') {
              data['data']['delete_point_master'] = 1
            }
            if (data['assignModule'][i]['import'] == 'true') {
              data['data']['import_point_master'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Holiday') && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_master'] = 1
            data['data']['view_holiday'] = 1


            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_holiday_master'] = 1
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_holiday_master'] = 1
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_holiday_master'] = 1
            }
            if (data['assignModule'][i]['delete'] == 'true') {
              data['data']['delete_holiday_master'] = 1
            }
            if (data['assignModule'][i]['import'] == 'true') {
              data['data']['import_holiday_master'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Gallery') && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_master'] = 1
            data['data']['view_gallery'] = 1

            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_gallery_master'] = 1
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_gallery_master'] = 1
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_gallery_master'] = 1
            }
            if (data['assignModule'][i]['delete'] == 'true') {
              data['data']['delete_gallery_master'] = 1
            }
            if (data['assignModule'][i]['import'] == 'true') {
              data['data']['import_gallery_master'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Referral Points Master') && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_master'] = 1
            data['data']['view_referral_point_master'] = 1

            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_referral_point_master'] = 1
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_referral_point_master'] = 1
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_referral_point_master'] = 1
            }
            if (data['assignModule'][i]['delete'] == 'true') {
              data['data']['delete_referral_point_master'] = 1
            }
            if (data['assignModule'][i]['import'] == 'true') {
              data['data']['import_referral_point_master'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Allowance Master') && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_master'] = 1
            data['data']['view_allowance_master'] = 1

            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_allowance_master'] = 1
            }
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_allowance_master'] = 1
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_allowance_master'] = 1
            }
            if (data['assignModule'][i]['delete'] == 'true') {
              data['data']['delete_allowance_master'] = 1
            }
            if (data['assignModule'][i]['import'] == 'true') {
              data['data']['import_allowance_master'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Support' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_support'] = 1
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_support'] = 1
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_support'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Task' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_task'] = 1
            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_task'] = 1
            }
            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['export_task'] = 1
            }
          }

          else if (data['assignModule'][i]['module_name'] == 'Sales Return' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_sales_return'] = 1
            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_sales_return'] = 1
            }
            if (data['assignModule'][i]['delete'] == 'true') {
              data['data']['delete_sales_return'] = 1
            }
            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_sales_return'] = 1
            }

            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['download_sales_return'] = 1
            }

            if (data['assignModule'][i]['import'] == 'true') {
              data['data']['upload_sales_return'] = 1
            }
          }

          else if (data['assignModule'][i]['module_name'] == 'Manual Dispatch' && data['assignModule'][i]['view'] == 'true') {
            data['data']['view_manual_dispatch'] = 1

            if (data['assignModule'][i]['edit'] == 'true') {
              data['data']['edit_manual_dispatch'] = 1
            }
            if (data['assignModule'][i]['delete'] == 'true') {
              data['data']['delete_manual_dispatch'] = 1
            }
            if (data['assignModule'][i]['add'] == 'true') {
              data['data']['add_manual_dispatch'] = 1
            }

            if (data['assignModule'][i]['export'] == 'true') {
              data['data']['download_manual_dispatch'] = 1
            }

            if (data['assignModule'][i]['import'] == 'true') {
              data['data']['upload_manual_dispatch'] = 1
            }

          }
        }
      }

      else if (data['data']['id'] == '1') { //if admin logged in

        data['data']['view_enquiry'] = 1;
        data['data']['edit_enquiry'] = 1;
        data['data']['add_enquiry'] = 1;
        data['data']['delete_enquiry'] = 1;
        data['data']['export_enquiry'] = 1;
        data['data']['import_enquiry'] = 1;

        data['data']['view_dashboard'] = 1

        data['data']['view_influencer_network'] = 1
        data['data']['add_influencer'] = 1;
        data['data']['export_influencer'] = 1;
        data['data']['edit_influencer'] = 1;

        data['data']['view_customer_network'] = 1;
        data['data']['view_channel_partner'] = 1;
        data['data']['view_dealer'] = 1;
        data['data']['view_direct_dealers'] = 1;
        data['data']['add_customer_network'] = 1;
        data['data']['edit_customer_network'] = 1;
        data['data']['export_customer_network'] = 1;
        data['data']['import_customer_network'] = 1;


        data['data']['view_orders'] = 1
        data['data']['add_order'] = 1;
        data['data']['export_order'] = 1;
        data['data']['edit_order'] = 1;
        data['data']['delete_order'] = 1;

        data['data']['view_primary_orders'] = 1
        data['data']['add_primary_order'] = 1;
        data['data']['export_primary_order'] = 1;
        data['data']['edit_primary_order'] = 1;
        data['data']['delete_primary_order'] = 1;

        data['data']['view_secondary_orders'] = 1;
        data['data']['add_secondary_orders'] = 1;
        data['data']['export_secondary_orders'] = 1;
        data['data']['edit_secondary_orders'] = 1;
        data['data']['delete_secondary_orders'] = 1;

        

        data['data']['view_accounts'] = 1
        data['data']['view_invoice'] = 1
        data['data']['view_payment'] = 1
        data['data']['import_accounts'] = 1
        data['data']['export_accounts'] = 1 

        data['data']['view_attendence'] = 1
        data['data']['export_attendence'] = 1
        data['data']['edit_attendence'] = 1

        data['data']['view_check_in'] = 1
        data['data']['export_checkin'] = 1

        data['data']['view_leaves'] = 1
        data['data']['export_leaves'] = 1
        data['data']['edit_leaves'] = 1

        data['data']['view_travel_plan'] = 1
        data['data']['delete_travel_list'] = 1
        data['data']['export_travel_list'] = 1
        data['data']['edit_travel_list'] = 1


        data['data']['view_follow_up'] = 1
        data['data']['export_follow_up'] = 1
        data['data']['delete_follow_up'] = 1

        data['data']['view_announcement'] = 1
        data['data']['add_announcement'] = 1

        data['data']['view_expense'] = 1
        data['data']['export_expense'] = 1
        data['data']['edit_expense'] = 1

        data['data']['view_event_plan'] = 1
        data['data']['edit_event_plan'] = 1

        data['data']['view_dispatch'] = 1
        data['data']['add_dispatch'] = 1


        data['data']['view_pop_gift'] = 1
        data['data']['edit_pop_gift'] = 1
        data['data']['delete_pop_gift'] = 1
        data['data']['export_pop_gift'] = 1
        data['data']['add_pop_gift'] = 1

        data['data']['view_survey'] = 1
        data['data']['add_survey'] = 1
        data['data']['edit_survey'] = 1
        data['data']['export_survey'] = 1

        data['data']['view_gift'] = 1
        data['data']['edit_gift_gallery'] = 1
        data['data']['export_gift_gallery'] = 1
        data['data']['add_gift_gallery'] = 1


        data['data']['view_bonus_points'] = 1
        data['data']['add_bonus_points'] = 1
        data['data']['edit_bonus_points'] = 1
        data['data']['export_bonus_points'] = 1


        data['data']['view_coupon_code'] = 1
        data['data']['export_coupon_code'] = 1
        data['data']['add_coupon_code'] = 1
        data['data']['delete_coupon_code'] = 1

        data['data']['view_redeem_request'] = 1
        data['data']['export_redeem_request'] = 1
        data['data']['edit_redeem_request'] = 1

        data['data']['view_target'] = 1
        data['data']['view_employee_target'] = 1
        data['data']['add_employee_target'] = 1
        data['data']['edit_employee_target'] = 1
        data['data']['export_employee_target'] = 1
        data['data']['delete_employee_target'] = 1
        data['data']['import_employee_target'] = 1
        
        data['data']['view_distributor_target'] = 1
        data['data']['add_distributor_target'] = 1
        data['data']['edit_distributor_target'] = 1
        data['data']['export_distributor_target'] = 1
        data['data']['delete_distributor_target'] = 1
        data['data']['import_distributor_target'] = 1


        data['data']['view_master'] = 1

        data['data']['view_designation'] = 1
        data['data']['add_users_designation'] = 1
        data['data']['edit_users_designation'] = 1
        data['data']['export_users_designation'] = 1
        data['data']['delete_users_designation'] = 1
        data['data']['import_users_designation'] = 1

        data['data']['view_category'] = 1
        data['data']['view_sub_category'] = 1
        data['data']['view_products'] = 1
        data['data']['view_pdf'] = 1
        data['data']['view_users'] = 1
        data['data']['view_customer_category'] = 1
        data['data']['view_infulencer_category'] = 1
        data['data']['view_point_category'] = 1
        data['data']['view_holiday'] = 1
        data['data']['view_gallery'] = 1
        data['data']['view_leave_master'] = 1
        data['data']['view_referral_point_master'] = 1

        data['data']['edit_master'] = 1
        data['data']['add_master'] = 1
        data['data']['delete_master'] = 1
        data['data']['export_master'] = 1
        data['data']['import_master'] = 1
        data['data']['edit_gallery_master'] = 1

        data['data']['import_customer_master'] = 1
        data['data']['delete_customer_master'] = 1
        data['data']['export_customer_master'] = 1
        data['data']['add_customer_master'] = 1
        data['data']['edit_customer_master'] = 1
        
        data['data']['add_infulencer_master'] = 1
        data['data']['edit_infulencer_master'] = 1
        data['data']['export_infulencer_master'] = 1
        data['data']['delete_infulencer_master'] = 1
        data['data']['import_infulencer_master'] = 1

        data['data']['add_holiday_master'] = 1
        data['data']['edit_holiday_master'] = 1
        data['data']['export_holiday_master'] = 1
        data['data']['delete_holiday_master'] = 1
        data['data']['import_holiday_master'] = 1


        data['data']['add_point_master'] = 1
        data['data']['edit_point_master'] = 1
        data['data']['export_point_master'] = 1
        data['data']['delete_point_master'] = 1
        data['data']['import_point_master'] = 1

        data['data']['view_allowance_master'] = 1
        data['data']['add_allowance_master'] = 1
        data['data']['edit_allowance_master'] = 1
        data['data']['export_allowance_master'] = 1
        data['data']['delete_allowance_master'] = 1
        data['data']['import_allowance_master'] = 1



        data['data']['view_support'] = 1
        data['data']['export_support'] = 1
        data['data']['edit_support'] = 1

        data['data']['view_task'] = 1
        data['data']['add_task'] = 1
        data['data']['export_task'] = 1

        data['data']['view_sales_return'] = 1
        data['data']['add_sales_return'] = 1
        data['data']['edit_sales_return'] = 1
        data['data']['delete_sales_return'] = 1
        data['data']['download_sales_return'] = 1
        data['data']['upload_sales_return'] = 1



        data['data']['view_manual_dispatch'] = 1
        data['data']['edit_manual_dispatch'] = 1
        data['data']['delete_manual_dispatch'] = 1
        data['data']['add_manual_dispatch'] = 1
        data['data']['download_manual_dispatch'] = 1
        data['data']['upload_manual_dispatch'] = 1



      }
      else if (data['data']['id'] == '432') { //if sub admin staticlogged in

        data['data']['view_enquiry'] = 1;
        data['data']['edit_enquiry'] = 1;
        data['data']['add_enquiry'] = 1;
        data['data']['delete_enquiry'] = 1;
        data['data']['export_enquiry'] = 1;
        data['data']['import_enquiry'] = 1;

        data['data']['view_dashboard'] = 1

        data['data']['view_customer_network'] = 1
        data['data']['add_customer_network'] = 1;
        data['data']['edit_customer_network'] = 1;
        data['data']['export_customer_network'] = 1;
        data['data']['import_customer_network'] = 1;


        data['data']['view_orders'] = 1
        data['data']['add_order'] = 1;
        data['data']['export_order'] = 1;
        data['data']['edit_order'] = 1;
        data['data']['delete_order'] = 1;


        data['data']['view_attendence'] = 1
        data['data']['export_attendence'] = 1

        data['data']['view_check_in'] = 1
        data['data']['export_checkin'] = 1

        data['data']['view_leaves'] = 1
        data['data']['export_leaves'] = 1
        data['data']['edit_leaves'] = 1

        data['data']['view_travel_plan'] = 1
        data['data']['delete_travel_list'] = 1
        data['data']['export_travel_list'] = 1
        data['data']['edit_travel_list'] = 1


        data['data']['view_follow_up'] = 1
        data['data']['export_follow_up'] = 1
        data['data']['delete_follow_up'] = 1

        data['data']['view_announcement'] = 1
        data['data']['add_announcement'] = 1

        data['data']['view_expense'] = 1
        data['data']['export_expense'] = 1
        data['data']['edit_expense'] = 1

        data['data']['view_event_plan'] = 1
        data['data']['edit_event_plan'] = 1

        data['data']['view_pop_gift'] = 1
        data['data']['edit_pop_gift'] = 1
        data['data']['delete_pop_gift'] = 1
        data['data']['export_pop_gift'] = 1
        data['data']['add_pop_gift'] = 1

        data['data']['view_target'] = 1


        data['data']['view_support'] = 1
        data['data']['export_support'] = 1
        data['data']['edit_support'] = 1

        data['data']['view_task'] = 1
        data['data']['add_task'] = 1
        data['data']['export_task'] = 1
      }

      else if (data['data']['id'] == '433') { //if sub admin logged in
        data['data']['view_dashboard'] = 1

        data['data']['view_customer_network'] = 1
        data['data']['add_customer_network'] = 1;
        data['data']['edit_customer_network'] = 1;
        data['data']['export_customer_network'] = 1;
        data['data']['import_customer_network'] = 1;

        data['data']['view_orders'] = 1
        data['data']['add_order'] = 1;
        data['data']['export_order'] = 1;
        data['data']['edit_order'] = 1;
        data['data']['delete_order'] = 1;

        data['data']['view_accounts'] = 1
        data['data']['import_accounts'] = 1
        data['data']['export_accounts'] = 1

        data['data']['view_announcement'] = 1
        data['data']['add_announcement'] = 1

        data['data']['view_survey'] = 1
        data['data']['add_survey'] = 1
        data['data']['edit_survey'] = 1
        data['data']['export_survey'] = 1

        data['data']['view_target'] = 1

        data['data']['view_support'] = 1
        data['data']['export_support'] = 1
        data['data']['edit_support'] = 1
      }
      else if (data['data']['id'] == '434') { //if sub admin logged in

        data['data']['view_dashboard'] = 1

        data['data']['view_influencer_network'] = 1
        data['data']['add_influencer'] = 1;
        data['data']['export_influencer'] = 1;
        data['data']['edit_influencer'] = 1;

        data['data']['view_survey'] = 1
        data['data']['add_survey'] = 1
        data['data']['edit_survey'] = 1
        data['data']['export_survey'] = 1

        data['data']['view_gift'] = 1
        data['data']['edit_gift_gallery'] = 1
        data['data']['export_gift_gallery'] = 1
        data['data']['add_gift_gallery'] = 1


        data['data']['view_bonus_points'] = 1
        data['data']['add_bonus_points'] = 1
        data['data']['edit_bonus_points'] = 1
        data['data']['export_bonus_points'] = 1


        data['data']['view_coupon_code'] = 1
        data['data']['export_coupon_code'] = 1
        data['data']['add_coupon_code'] = 1
        data['data']['delete_coupon_code'] = 1

        data['data']['view_redeem_request'] = 1
        data['data']['export_redeem_request'] = 1
        data['data']['edit_redeem_request'] = 1

        data['data']['view_master'] = 1
        data['data']['edit_master'] = 1
        data['data']['add_master'] = 1
        data['data']['delete_master'] = 1
        data['data']['export_master'] = 1
        data['data']['import_master'] = 1

        data['data']['view_support'] = 1
        data['data']['export_support'] = 1
        data['data']['edit_support'] = 1
      }
      else if (data['data']['id'] == '435') { //if admin logged in
        data['data']['view_dashboard'] = 1

        data['data']['view_dispatch'] = 1
        data['data']['add_dispatch'] = 1

        data['data']['view_coupon_code'] = 1
        data['data']['export_coupon_code'] = 1
        data['data']['add_coupon_code'] = 1
        data['data']['delete_coupon_code'] = 1


        data['data']['view_sales_return'] = 1
        data['data']['add_sales_return'] = 1
        data['data']['edit_sales_return'] = 1
        data['data']['delete_sales_return'] = 1
        data['data']['download_sales_return'] = 1
        data['data']['upload_sales_return'] = 1

        data['data']['view_manual_dispatch'] = 1
        data['data']['edit_manual_dispatch'] = 1
        data['data']['delete_manual_dispatch'] = 1
        data['data']['add_manual_dispatch'] = 1
        data['data']['download_manual_dispatch'] = 1
        data['data']['upload_manual_dispatch'] = 1
      }


      if (data.data.type == '1' && data.data.lead_type == 'Dr') {
        this.channel_partner = true;

        this.st_user = data;

        this.cp_otp = Math.floor(100000 + Math.random() * 900000);

        let value = { "mobile": this.st_user.data.mobile, "otp": this.cp_otp }

        this.serve.auth_rqust(value, "login/verify_otp").subscribe((data: any) => {

        });

      }
      else {
        this.channel_partner = false;

        if (data['message'] == 'Success') {
          this.dialog.success("LogIn", "Success");
          this.st_user = data;
          console.log(this.st_user.data);
          this.st_user.data.access_level = "1";
          this.st_user.st_log = true;
          localStorage.setItem('st_user', JSON.stringify(this.st_user));

          if (this.st_user.data.view_dashboard == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_enquiry == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/lead-list';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_lead_direct_dealer == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/lead-list';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_lead_end_user == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/lead-list';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_lead_others == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/lead-list';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_lead_project == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/lead-list';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_dist_n_w_channel_partner == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/distribution-list';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_dist_n_w_direct_dealer == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/direct-dealer';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_dist_n_w_dealer == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/dealer';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_orders == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/order-list';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_orders_primary == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/order-list';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_orders_secondary == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/secondary-order-list';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_dist_n_w_channel_partner == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/distribution-list';
            this.router.navigate([this.nexturl]);

          }
          else if (this.st_user.data.view_check_in == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/checkin';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_leaves == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/leave-list';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_travel_plan == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/travel-list';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_products == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/product-list';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_users == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/sale-user-list';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_quotation == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/quotation';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_follow_up == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/followup-list';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_announcement == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/announcement-list';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_expense == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/expense-list';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_event == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/contractor-meet';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_pop_gift == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/pop-gift-list';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_location_master == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/location-Master';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_dispatch == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/company-dispatch';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_attendence == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/attendance';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_manual_dispatch == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/manual-dispatch';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_sales_return == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/sales-return';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_category == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/segment-list';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_sub_category == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/subcategory';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_products == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/product-list';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_pdf == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/catalogue';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_users == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/sale-user-list';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_customer_category == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/customer-category';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_infulencer_category == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/influencer-user-list';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_point_category == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/point-list';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_holiday == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/holiday-list';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_gallery == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/banner-list';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_referral_point_master == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/point-master';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_leave_master == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/leave-master-list';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_allowance_master == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/allowances';
            this.router.navigate([this.nexturl]);
          }

          else if (this.st_user.data.view_distributor_target == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/distributor-target';
            this.router.navigate([this.nexturl]);
          }
          else if (this.st_user.data.view_employee_target == '1') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/userview-target';
            this.router.navigate([this.nexturl]);
          }
        }
        else {
          this.dialog.error("Incorrect UserName or Password");
        }
      }

    }, error => {
    });
  }


  submit_otp() {
    if (this.cp_otp == this.data.otp) {
      this.dialog.success("LogIn", "Success");
      this.st_user.data.access_level = "2";
      this.st_user.st_log = true;
      localStorage.setItem('st_user', JSON.stringify(this.st_user));
      this.router.navigate(['/distribution-detail/' + this.st_user['data'].id]);
    }
    else {
      this.dialog.error("Incorrect Otp");
    }
  }

  visible_password(){
    this.edit_view =true
  }
  not_visible_password(){
    this.edit_view =false
  }

}
