import { Component, OnInit, } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { Router, ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { StatusModalComponent } from '../status-modal/status-modal.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { splitClasses } from '@angular/compiler';
import { sessionStorage } from 'src/app/localstorage.service';
import { OrderEditModalComponent } from '../order-edit-modal/order-edit-modal.component';
import { OrderDispatchComponent } from '../order-dispatch/order-dispatch.component';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AddItemComponent } from 'src/app/add-item/add-item.component';

import * as $ from "jquery";


@Component({
    selector: 'app-order-detail',
    templateUrl: './order-detail.component.html',
    animations: [slideToTop()]
})
export class OrderDetailComponent implements OnInit {
    orderType: any = 'order';
    status: any;
    skLoading: boolean = false;

    data: any = {};
    login_data: any = [];
    order_id: any;
    order_item: any = [];
    invoice_bill_item: any = [];
    order_logs: any = [];
    order_detail: any = [];
    login_dr_id: any;
    editqty: any = false;
    distrbutorId: any;
    constructor(public route: ActivatedRoute, public serve: DatabaseService, public toast: ToastrManager, public dialog: MatDialog, public session: sessionStorage, public dialogs: DialogComponent, public router: Router, public alert: DialogComponent) {

        this.login_data = this.session.getSession();
        this.login_data = this.login_data.value.data;

        if (this.login_data.access_level != '1') {
            this.login_dr_id = this.login_data.id;
        }

        this.route.params.subscribe(params => {
            this.order_id = params.id;
            this.serve.currentUserID = params.id
            this.status = this.route.queryParams['_value']['status'];

        });
        this.orderDetail();
    }

    ngOnInit() {


    }



    open_dipatch_model(): void {
        const dialogRef = this.dialog.open(OrderDispatchComponent, {
            width: '1000px', data: {
                order_status: this.order_detail.order_status,
                order_id: this.order_id,
                reason: '',
                drId: this.distrbutorId,
                from: 'order_detail_page'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == true) {
                this.orderDetail();
            }
        });
    }

    openEditDialog(user_id, type): void {
        const dialogRef = this.dialog.open(OrderEditModalComponent, {
            width: '400px', data: {
                order_id: this.order_id,
                type: type,
                user_id: user_id
            }

        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != false) {
                this.orderDetail();
            }
        });
    }

    loader: any;
    edit_cash_discount: any = false;
    Order_Amount: any;
    orderDetail() {
        this.loader = 1;
        this.skLoading = true;
        let id = { 'id': this.order_id }

        setTimeout(() => {
            this.serve.post_rqst(id, "Order/primaryOrderDetail").subscribe((result => {
                if (result['statusCode'] == 200) {
                    this.skLoading = false;
                    this.order_detail = result['result'];
                    this.distrbutorId = this.order_detail['dr_id'];

                    this.order_item = result['result']['item_info'];
                    this.invoice_bill_item = result['invoice_bill'];
                    this.order_logs = result['result']['order_log'];
                    this.order_detail.order_cgst = this.order_detail.order_gst / 2;
                    this.order_detail.order_cgst = parseFloat(this.order_detail.order_cgst).toFixed(2);
                    this.order_detail.netBreakup = (parseFloat(this.order_detail.order_grand_total) / 1.18)
                    this.order_detail.gstBreakup = parseFloat(this.order_detail.order_grand_total) - parseFloat(this.order_detail.netBreakup)
                    this.order_detail.gstBreakup = this.order_detail.gstBreakup.toFixed(2)
                    this.order_detail.netBreakup = this.order_detail.netBreakup.toFixed(2)
                    this.Order_Amount = Number(this.order_detail.order_total) + Number(this.order_detail.order_discount)
                    this.order_item.map((row) => {
                        row.editqty = false

                    })
                    setTimeout(() => {
                        this.loader = '';

                    }, 700);
                } else {
                    setTimeout(() => {
                        this.loader = '';

                    }, 700);
                    this.skLoading = false;
                    this.toast.errorToastr(result['statusMsg'])
                }
            }))
        }, 2000);
    }
    goTODetail(id) {
        this.router.navigate(['/billing-details/' + id], { queryParams: { id } });
    }
    openDialog(): void {
        const dialogRef = this.dialog.open(StatusModalComponent, {
            width: '400px',
            panelClass: 'cs-model',
            data: {
                order_status: this.order_detail.order_status,
                order_id: this.order_id,
                from: 'primary_order',
                reason: ''
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != false) {
                this.orderDetail();
            }
        });
    }

    deleteOrderitem(order_id, index) {
        this.alert.confirm("You want to delet this item !").then((result) => {
            if (result) {
                this.serve.post_rqst({ 'id': order_id }, "Order/primaryOrderDeleteItem")
                    .subscribe((result => {
                        if (result['status'] == 200) {
                            this.toast.successToastr('Item Deleted Successfully');
                            this.order_item.splice(index, 1)
                            this.orderDetail();
                        } else {
                            this.orderDetail();
                            this.toast.errorToastr(result['status'])
                        }
                    }))
            }
        })
    }

    // }
    order_detail1: any = {}
    edit_qty() {
        this.editqty = true;
    }
    Update_qty(id) {
        let index = this.order_item.findIndex(row => row.id == id)
        let cart_data = []
        let Amount = (this.order_item[index].qty * this.order_item[index].net_price)
        this.order_item[index].product_price = this.order_item[index].price
        this.order_item[index].discounted_price = this.order_item[index].discount_amount
        this.order_item[index].dr_disc = this.order_item[index].discount_percent
        this.order_item[index].amount = Amount
        this.order_item[index].gst_amountbeforfix = (Amount * this.order_item[index].gst_percent) / 100
        this.order_item[index].gst_amount = parseFloat(this.order_item[index].gst_amountbeforfix).toFixed()
        this.order_item[index].total_amount = parseFloat(this.order_item[index].gst_amount) + Amount;
        cart_data.push(this.order_item[index])

        this.serve.post_rqst({ 'id': id, 'cart_data': cart_data }, "order/primaryOrderUpdateItem").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.editqty = false;
                this.toast.successToastr(result['statusMsg']);
                this.orderDetail()
            }
            else {
                this.editqty = false;
                this.toast.errorToastr(result['statusMsg']);
            }
        }))
    }


    amount: any = 0;
    gst_amount: any = 0;
    subtotal: any = 0;
    second_subtotal: any = 0;
    cd_amount: any = 0;

    back() {
        window.history.go(-1);
    }
    addItem() {
        let dr_id = this.order_detail.dr_id
        let order_id = this.order_id
        let state = this.order_detail.state
        let type = this.order_detail.type;
        let company_name = this.order_detail.company_name;
        let name = this.order_detail.name;
        let contact_person = this.order_detail.mobile;
        const dialogRef = this.dialog.open(AddItemComponent, {
            width: '1000px',
            panelClass: 'cs-modal',
            data: {
                'dr_id': dr_id,
                'order_id': order_id,
                'type': type,
                'company_name': company_name,
                'name': name,
                'contact_person': contact_person,
                'state': state
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            this.orderDetail();
        });
    }

    exportPdf() {
        this.loader = 1;
        this.skLoading = true;
        let id = { 'id': this.order_id }
        this.serve.post_rqst(id, "Order/exportOrderPdf").subscribe((result) => {
            if (result['statusCode'] == 200) {
                this.skLoading = false;
                window.open(this.serve.uploadUrl+'orderPdf/'+result['file_name']);
                setTimeout(() => {
                    this.loader = '';

                }, 700);
            } else {
                setTimeout(() => {
                    this.loader = '';

                }, 700);
                this.skLoading = false;
                this.toast.errorToastr(result['statusMsg'])
            }
        }
            , err => {
                this.skLoading = false;

            }
        )
    }

}
