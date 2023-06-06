import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService'
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { sessionStorage } from '../localstorage.service';
import {FormControl} from '@angular/forms'
import { Chart } from 'chart.js';
// import * as Highcharts from 'highcharts/highmaps';
import { DatePipe } from '@angular/common';
import indiaMap from '../../assets/indiaMap';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DatePipe]
})


export class DashboardComponent implements OnInit {

  ngOnInit() {
    setTimeout(() => {
      this.getindiaMap();
    }, 700);
  }

  transectionValue:any = [100, 0, 25, 12, 25, 10, 100, 80, 25, 12, 25, 10];
  invoiceValue:any = [40000, 50000, 35000, 21000, 10000, 17000, 80000, 13000, 40000, 50000, 35000, 21000];
  collectionValue:any = [35000, 40000, 35000, 17000, 5000, 12000, 40000, 3000, 35000, 40000, 15000, 17000];

  generatedCoupon:any = [40000, 50000, 35000, 21000, 10000, 17000, 80000, 13000, 40000, 50000, 35000, 21000];
  scannedCoupon:any = [35000, 40000, 35000, 17000, 5000, 12000, 40000, 3000, 35000, 40000, 15000, 17000];

  invoiceValue1:any = [40000, 50000, 35000, 60000, 20000, 17000, 30000, 13000, 40000, 50000, 35000, 24000, 40000, 50000, 35000, 21000, 10000, 17000, 13000, 13000, 40000, 50000, 35000, 21000, 40000, 50000, 35000, 21000, 10000, 17000, 10000];
  collectionValue1:any = [35000, 40000, 35000, 17000, 5000, 12000, 25000, 3000, 35000, 40000, 15000, 18000, 35000, 40000, 35000, 17000, 5000, 12000, 10000, 3000, 35000, 40000, 15000, 17000, 35000, 40000, 35000, 17000, 10000, 17000, 10000];

  items:any = [1000, 2000, 3000, 3400, 3000, 2000, 1000, 900, 1400, 2000, 3000, 4000, 5000, 4700, 3400, 3000, 2000, 1000, 900, 1400, 2000, 3000, 4000, 5000, 5400, 5000, 4800, 4500, 4200, 4000, 3800];
  boxes:any = [500, 1000, 1500, 1700, 1500, 1000, 500, 600, 700, 1500, 2000, 2500, 2700, 2500, 1700, 1500, 1000, 500, 600, 700, 1500, 2000, 2500, 2700, 2500, 2500, 2000, 1800, 1500, 1200, 1000];
  salesusers:any = [
    {name:'Prashant Kumar Sharma',empCode:'EMP406', points:'5,000'},
    {name:'Shivkant Tiwari',empCode:'EMP407', points:'4,000'},
    {name:'Akash Sharma',empCode:'EMP408', points:'3,000'},
    {name:'Jaspreet',empCode:'EMP409', points:'2,000'},
    {name:'Manish',empCode:'EMP410', points:'1,500'},
    {name:'Davinder Kaur',empCode:'SPIL167', points:'1,000'},
    {name:'Saurav Kaur',empCode:'SPIL168', points:'800'},
  ]

  productSegments = [
    {name:'Wall Paint', percent:'80'},
    {name:'Unico PU', percent:'70'},
    {name:'Thinner', percent:'60'},
    {name:'Polyester', percent:'50'},
    {name:'Others', percent:'40'},
    {name:'Metal', percent:'30'},
    {name:'Italian Pu', percent:'20'},
    {name:'Copper', percent:'10'},
  ]

  bonusScheme = [
    {name:'Contractor Bonus', percent:'80'},
    {name:'Bonus Point 1', percent:'70'},
    {name:'Bonus Point 2', percent:'60'},
    {name:'Bonus Point 3', percent:'50'},
    {name:'Bonus Point 4', percent:'40'},
    {name:'Bonus Point 5', percent:'30'},
    {name:'Bonus Point 6', percent:'20'},
    {name:'Bonus Point 7', percent:'10'},
    {name:'Bonus Point 8', percent:'8'},
  ]
  currentDate = new Date();

  constructor(public serve:DatabaseService,public dialog: MatDialog ,public route: Router,private renderer: Renderer2,public session:sessionStorage) {
  }

  tabs = ['Sales','Enquiry', 'Account','Influencer Reward', 'Forecasting'];

  segment =[
    {'state':'Andhra Pradesh'},
    {'state':'Arunachal Pradesh'},
    {'state':'Assam'},
    {'state':'Bihar'},
    {'state':'Chhattisgarh'},
    {'state':'Goa'},
    {'state':'Gujarat'},
    {'state':'Haryana'},
    {'state':'Himachal Pradesh'},
    {'state':'Jharkhand'},
    {'state':'Karnataka'},
    {'state':'Kerala'},
    {'state':'Madhya Pradesh	'},
    {'state':'Maharashtra'},
    {'state':'Manipur'},
    {'state':'Meghalaya'},
    {'state':'Mizoram'},
    {'state':'Nagaland'},
    {'state':'Odisha'},
    {'state':'Punjab'},
    {'state':'Rajasthan'},
    {'state':'Sikkim'},
    {'state':'Tamil Nadu'},
    {'state':'Telangana'},
    {'state':'Tripura'},
    {'state':'Uttar Pradesh'},
    {'state':'Uttarakhand'},
    {'state':'West Bengal'},
  ]
  tabValue :any = 'Sales';

  getindiaMap(){
    let mapIndiaOpt:any  = {
     chart: {
       map: indiaMap
     },

     title: {
       text: ''
     },


     mapNavigation: {
       enabled: true,
       buttonOptions: {
         verticalAlign: 'bottom'
       }
     },

     colorAxis: {
       min: 0
     },

     series: [{
       data: [
        ['madhya pradesh', 10], ['uttar pradesh', 11], ['karnataka', 12],
        ['nagaland', 13], ['bihar', 14], ['lakshadweep', 15],
        ['andaman and nicobar', 16], ['assam', 17], ['west bengal', 18],
        ['puducherry', 19], ['daman and diu', 20], ['gujarat', 21],
        ['rajasthan', 22], ['dadara and nagar havelli', 23],
        ['chhattisgarh', 24], ['tamil nadu', 25], ['chandigarh', 26],
        ['punjab', 27], ['haryana', 28], ['andhra pradesh', 29],
        ['maharashtra', 30], ['himachal pradesh', 31], ['meghalaya', 32],
        ['kerala', 33], ['telangana', 34], ['mizoram', 35], ['tripura', 36],
        ['manipur', 37], ['arunanchal pradesh', 38], ['jharkhand', 39],
        ['goa', 40], ['nct of delhi', 41], ['odisha', 42],
        ['jammu and kashmir', 43], ['sikkim', 44], ['uttarakhand', 45]
    ],
       name: 'State Wise Sales Matrix',
       states: {
         hover: {
           color: '#BADA55'
         }
       },
       dataLabels: {
         enabled: true,
         format: '{point.name}'
       }
     }]
   }
  //  Highcharts.mapChart('indiaMapBox', mapIndiaOpt);
}

getTabValue(value){
  this.tabValue = value.tab.textLabel;
  if(this.tabValue == 'Sales'){
  setTimeout(() => {
    this.getindiaMap();
  }, 700);
}

  // if(this.tabValue == 'Sales'){
  //   setTimeout(() => {
  //   }, 700);
  // }

  // if(this.tabValue == 'Enquiry'){
  //   setTimeout(() => {
  //   }, 700);
  // }


}

  segmentPieChart: ZingchartAngular.graphset = {
    type: 'ring',
    backgroundColor: '#fff',

    plot: {
      tooltip: {
        backgroundColor: 'none',
        borderWidth: '0px',
        fontSize: '10px',

        sticky: true,
        thousandsSeparator: ',',

      },
      valueBox:
        {
          type: 'all',
          text: '%t<br>%npv%',
          placement: 'out',
          fontSize:'10px'
        },
      animation: {
        effect: 2,
        sequence: 3,
        speed:1000
      },
      backgroundColor: '#FBFCFE',
      borderWidth: '0px',
      slice: 30,
    },
    plotarea: {
      margin: '0px',
      backgroundColor: 'transparent',
      borderRadius: '10px',
      borderWidth: '0px',
    },
    series: [
      {
        text: 'Segment 1',
        values: [16541],
        backgroundColor: '#00889f',
        lineColor: '#00889f',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#00889f',
        },
      },
      {
        text: 'Segment 2',
        values: [36711],
        backgroundColor: '#3691d6',
        lineColor: '#3691d6',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#3691d6',
        },
      },
      {
        text: 'Segment 3',
        values: [50011],
        backgroundColor: '#b5a1c8',
        lineColor: '#b5a1c8',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#b5a1c8',
        },
      },
      {
        text: 'Segment 4',
        values: [20711],
        backgroundColor: '#ffbd00',
        lineColor: '#ffbd00',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#ffbd00',
        },
      },
      {
        text: 'Segment 5',
        values: [16711],
        backgroundColor: '#7f7f7f',
        lineColor: '#7f7f7f',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#7f7f7f',
        },
      },
      {
        text: 'Segment 6',
        values: [26711],
        backgroundColor: '#9B26AF',
        lineColor: '#9B26AF',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#9B26AF',
        },
      },
      {
        text: 'Segment 7',
        values: [10711],
        backgroundColor: '#e3c889',
        lineColor: '#e3c889',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#e3c889',
        },
      },

    ],
    noData: {
      text: 'No Selection',
      alpha: 0.6,
      backgroundColor: '#20b2db',
      bold: true,
      fontSize: '10px',
      textAlpha: 0.9,
    },
  };

  leadPieChart: ZingchartAngular.graphset = {
    type: 'ring',
    backgroundColor: '#fff',

    plot: {
      tooltip: {
        backgroundColor: 'none',
        borderWidth: '0px',
        fontSize: '10px',

        sticky: true,
        thousandsSeparator: ',',
      },
      valueBox:
        {
          type: 'all',
          text: '%t<br>%npv%',
          placement: 'out',
          fontSize:'10px'
        },
      animation: {
        effect: 2,
        sequence: 3,
        speed:1000
      },
      backgroundColor: '#FBFCFE',
      borderWidth: '0px',
      slice: 40,
    },
    plotarea: {
      margin: '0px',
      backgroundColor: 'transparent',
      borderRadius: '10px',
      borderWidth: '0px',
    },
    series: [
      {
        text: 'Contractor',
        values: [16541],
        backgroundColor: '#26a0fc',
        lineColor: '#26a0fc',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#26a0fc',
        },
      },
      {
        text: 'Architect',
        values: [36711],
        backgroundColor: '#68d4cd',
        lineColor: '#68d4cd',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#68d4cd',
        },
      },
      {
        text: 'Site',
        values: [50011],
        backgroundColor: '#ffc000',
        lineColor: '#ffc000',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#ffc000',
        },
      },

    ],
    noData: {
      text: 'No Selection',
      alpha: 0.6,
      backgroundColor: '#20b2db',
      bold: true,
      fontSize: '10px',
      textAlpha: 0.9,
    },
  };

  totalEnquiryPieChart: ZingchartAngular.graphset = {
    type: 'ring',
    backgroundColor: '#fff',

    plot: {
      tooltip: {

        backgroundColor: '#000',
        borderWidth: '0px',
        fontSize: '10px',
        sticky: true,
        thousandsSeparator: ',',
      },
      valueBox:
        {
          type: 'all',
          text: '%npv%',
          placement: 'in',
          fontSize:'8px'
        },
      animation: {
        effect: 2,
        sequence: 3,
        speed:1000
      },
      backgroundColor: '#FBFCFE',
      borderWidth: '0px',
      slice: 40,
    },
    plotarea: {
      margin: '0px',
      backgroundColor: 'transparent',
      borderRadius: '10px',
      borderWidth: '0px',
    },

    series: [
      {
        text: 'Review Pending',
        values: [20],
        backgroundColor: '#ffc300',
        lineColor: '#ffc300',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#ffc300',
        },
      },
      {
        text: 'Qualified',
        values: [60],
        backgroundColor: '#00a54d',
        lineColor: '#009fb5',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#009fb5',
        },
      },
      {
        text: 'Disqualified',
        values: [20],
        backgroundColor: '#ff4b4a',
        lineColor: '#ff4b4a',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#ff4b4a',
        },
      }

    ],
    noData: {
      text: 'No Selection',
      alpha: 0.6,
      backgroundColor: '#20b2db',
      bold: true,
      fontSize: '10px',
      textAlpha: 0.9,
    },
  };

  qualifiedEnquiryPieChart: ZingchartAngular.graphset = {
    type: 'ring',
    backgroundColor: '#fff',

    plot: {
      tooltip: {
        backgroundColor: 'black',
        borderWidth: '0px',
        fontSize: '10px',

        sticky: true,

      },
      valueBox:
        {
          type: 'all',
          text: '%npv%',
          placement: 'in',
          fontSize:'8px'
        },

      animation: {
        effect: 2,
        sequence: 3,
        speed:1000
      },
      backgroundColor: '#FBFCFE',
      borderWidth: '0px',
      slice: 40,
    },
    plotarea: {
      margin: '0px',
      backgroundColor: 'transparent',
      borderRadius: '10px',
      borderWidth: '0px',
    },

    series: [
      {
        text: 'Win',
        values: [200],
        backgroundColor: '#46a345',
        lineColor: '#46a345',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#46a345',
        },
      },
      {
        text: 'Lost',
        values: [200],
        backgroundColor: '#ff4b4a',
        lineColor: '#ff4b4a',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#ff4b4a',
        },
      },
      {
        text: 'In Process',
        values: [200],
        backgroundColor: '#ffc300',
        lineColor: '#ffc300',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#ffc300',
        },
      },
    ],
    noData: {
      text: 'No Selection',
      alpha: 0.6,
      backgroundColor: '#20b2db',
      bold: true,
      fontSize: '10px',
      textAlpha: 0.9,
    },
  };

  sourceEnquiryPieChart: ZingchartAngular.graphset = {
    type: 'ring',
    backgroundColor: '#fff',

    plot: {
      tooltip: {

        backgroundColor: 'none',
        borderWidth: '0px',
        fontSize: '10px',
        sticky: true,
        thousandsSeparator: ',',
      },
      valueBox:
        {
          type: 'all',
          text: '%v%',
          placement: 'in',
          fontSize:'8px'
        },
      animation: {
        effect: 2,
        sequence: 3,
        speed:1000
      },
      backgroundColor: '#FBFCFE',
      borderWidth: '0px',

      slice: 40,
    },
    plotarea: {
      margin: '0px',
      backgroundColor: 'transparent',
      borderRadius: '10px',
      borderWidth: '0px',
    },

    series: [
      {
        text: 'Facebook',
        values: [20],
        backgroundColor: '#95ce50',
        lineColor: '#95ce50',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#95ce50',
        },
      },
      {
        text: 'Website',
        values: [17],
        backgroundColor: '#ffb300',
        lineColor: '#ffb300',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#ffb300',
        },
      },
      {
        text: 'Call',
        values: [14],
        backgroundColor: '#ff6f00',
        lineColor: '#ff6f00',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#ff6f00',
        },
      },
      {
        text: 'Walk',
        values: [18],
        backgroundColor: '#00897b',
        lineColor: '#00897b',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#00897b',
        },
      },
      {
        text: 'SMS',
        values: [12],
        backgroundColor: '#43a047',
        lineColor: '#43a047',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#43a047',
        },
      },
      {
        text: 'Toll-Free',
        values: [5],
        backgroundColor: '#2e7d32',
        lineColor: '#2e7d32',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#2e7d32',
        },
      },
      {
        text: 'Others',
        values: [5],
        backgroundColor: '#989c25',
        lineColor: '#989c25',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#989c25',
        },
      },
      {
        text: 'Instagram',
        values: [9],
        backgroundColor: '#f70474',
        lineColor: '#f70474',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#f70474',
        },
      },
      {
        text: 'Linked-in',
        values: [9],
        backgroundColor: '#0077b5',
        lineColor: '#0077b5',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#0077b5',
        },
      },
      {
        text: 'Reference',
        values: [9],
        backgroundColor: '#d778b3',
        lineColor: '#d778b3',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#d778b3',
        },
      },
      {
        text: 'Whatsapp',
        values: [9],
        backgroundColor: '#1bd741',
        lineColor: '#1bd741',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#1bd741',
        },
      },
      {
        text: 'Mail',
        values: [9],
        backgroundColor: '#ea4335',
        lineColor: '#ea4335',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#ea4335',
        },
      },
      {
        text: 'IndiaMart',
        values: [9],
        backgroundColor: '#1c124f',
        lineColor: '#1c124f',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#1c124f',
        },
      },
      {
        text: 'JustDial',
        values: [9],
        backgroundColor: '#fc6904',
        lineColor: '#fc6904',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#fc6904',
        },
      },
    ],
    noData: {
      text: 'No Selection',
      alpha: 0.6,
      backgroundColor: '#20b2db',
      bold: true,
      fontSize: '10px',
      textAlpha: 0.9,
    },
  };


  horizontalBarChart:ZingchartAngular.graphset = {
    type: "hbar",
    scaleX: {
      labels: ['East', 'West', 'North', 'South'],
    },
    plot:{
      valueBox: {
        text: '%v',
        placement: "top-in",
        'font-color': "black",
        thousandsSeparator: ',',
      },
      animation: {
        effect: 11,
        speed: 3000,
      }
    },
    plotarea: {
      backgroundColor: 'transparent',
      marginTop:'0',
      marginRight:'15px',
      marginLeft:'80px'
    },
    series: [
      {
        values:[2012,4220,2445,5000],
        backgroundColor:'#00ccfd'
      },
      {
        values:[5233,3000,2123,3875],
        backgroundColor:'#bac0c3'
      }
    ]
  };

  invoiceCollectionBarChart:any = {
    type: "bar",
    scaleX: {
      labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    },
    plot:{
      valueBox: {
        text: '%v',
        short: true,
        placement: "top-out",
        'font-color': "black",
        'font-weight':'normal',
        'font-size':'10px',
        thousandsSeparator: ',',
      },
      animation: {
        effect: 11,
        speed: 3000,
      }
    },
    plotarea: {
      backgroundColor: 'transparent',
      marginTop:'60px',
      marginRight:'15px',
      marginLeft:'80px'
    },
    series: [
      {
        text:'Invoice',
        values:this.invoiceValue,
        backgroundColor:'#0071bd'
      },
      {
        text:'Collection',
        values:this.collectionValue,
        backgroundColor:'#6ec44d'
      }
    ]
  };

  accountBarChart:ZingchartAngular.graphset = {
    type: "bar",
    scaleX: {
      labels: ['0 or less', '1 ~ 30', '31 ~ 60', '61 ~ 90', 'Over 90'],
    },
    plot:{
      valueBox: {
        text: '%v',
        placement: "top-in",
        'font-color': "black",
        thousandsSeparator: ',',
      },
      animation: {
        effect: 11,
        speed: 3000,
      }
    },
    plotarea: {
      backgroundColor: 'transparent',
      marginTop:'0',
      marginRight:'15px',
      marginLeft:'80px'
    },
    series: [
      {
        values:[2012,4220,2445,5000, 2500],
        backgroundColor:'#00ccfd'
      },
      {
        values:[5233,3000,2123,3875, 3000],
        backgroundColor:'#bac0c3'
      }
    ]
  };



  config: any = {
    type: 'gauge',
    globals: {
      fontSize: '18px',
    },
    plot: {
      tooltip: {
        borderRadius: '5px',
        fontSize:'10px'
      },
      valueBox: {

        text: '%v',
        fontSize: '14px',
        placement: 'center',
        rules: [
          {
            text: '%v<br>Days',
            rule: '%v <= 30',
          },
        ],
      },
      size: '100%',
      animation: {
        effect: 11,
        speed: 3000,
      }
    },
    plotarea: {
      backgroundColor: 'transparent',
      marginTop: '40px',
    },
    scaleR: {

      aperture: 180,
      center: {
        visible: false,
      },
      item: {
        offsetR: 0,

      },
      labels: ['1', '', '', '30'],
      maxValue: 30,
      minValue: 0,

        ring:{
          size: 50,
          backgroundColor: '#89b3d6',
          rules: [
            {
              backgroundColor: '#89b3d6',
              rule: '%v <= 10',
            },
            {
              backgroundColor: '#009fb5',
              rule: '%v >= 10 && %v <= 20',
            },
            {
              backgroundColor: '#1a4262',
              rule: '%v >= 20 && %v <= 30',
            },
          ],
        },
      step: 10,
      tick: {
        visible: false,
      },

    },

    refresh: {
      type: 'feed',
      url: 'feed()',
      interval: 1500,
      resetTimeout: 1000,
      transport: 'js',
    },
    series: [
      {
        values: [24],
        backgroundColor: 'black',
        indicator: [0.1, 4, 5, 5, 0.3],

      },
    ],

  };

  enquiryScore: any = {
    type: 'gauge',
    globals: {
      fontSize: '18px',
    },
    plot: {
      tooltip: {
        borderRadius: '5px',
        fontSize:'10px'
      },
      valueBox: {
        text: '%v%',
        fontSize: '18px',
        placement: 'center',
        rules: [
          {
            text: '%v',
            rule: '%v <= 30',
          },
        ],
      },
      size: '100%',
      animation: {
        effect: 11,
        speed: 3000,
      }
    },
    plotarea: {
      backgroundColor: 'transparent',
      marginTop: '40px',
    },
    scaleR: {
      aperture: 240,
      center: {
        visible: false,
      },
      item: {
        offsetR: 0,

      },
      labels: ['0', '', '', '', '100'],
      maxValue: 100,
      minValue: 0,
      ring: {
        rules: [
          {
            backgroundColor: '#ea4335',
            rule: '%v <= 25',
          },
          {
            backgroundColor: '#ffc300',
            rule: '%v >= 25 && %v <= 50',
          },
          {
            backgroundColor: '#2e7d32',
            rule: '%v > 50 && %v <= 100',
          },
        ],
        size: '20px',
      },
      step: 25,
      tick: {
        visible: false,
      },
    },
    refresh: {
      type: 'feed',
      url: 'feed()',
      interval: 1500,
      resetTimeout: 1000,
      transport: 'js',
    },
    series: [
      {
        values: [74],
        animation: {
          delay:1200,
          effect: 2,
          method: 3,
          speed: 3000,
        },
        backgroundColor: 'black',
        indicator: [0.1, 4, 5, 5, 0.3],
      },
    ],

  };

  accuracyLead: any = {
    type: 'gauge',
    globals: {
      fontSize: '18px',
    },
    plot: {
      tooltip: {
        borderRadius: '5px',
        fontSize:'10px'
      },
      valueBox: {
        text: '%v%',
        fontSize: '18px',
        placement: 'center',
        rules: [
          {
            text: '%v',
            rule: '%v <= 30',
          },
        ],
      },
      size: '100%',
      animation: {
        effect: 11,
        speed: 3000,
      }
    },
    plotarea: {
      backgroundColor: 'transparent',
      marginTop: '40px',
    },
    scaleR: {
      aperture: 240,
      center: {
        visible: false,
      },
      item: {
        offsetR: 0,

      },
      labels: ['0', '', '', '', '100'],
      maxValue: 100,
      minValue: 0,
      ring: {
        rules: [
          {
            backgroundColor: '#ea4335',
            rule: '%v <= 25',
          },
          {
            backgroundColor: '#ffc300',
            rule: '%v >= 25 && %v <= 50',
          },
          {
            backgroundColor: '#2e7d32',
            rule: '%v > 50 && %v <= 100',
          },
        ],
        size: '20px',
      },
      step: 25,
      tick: {
        visible: false,
      },
    },
    refresh: {
      type: 'feed',
      url: 'feed()',
      interval: 1500,
      resetTimeout: 1000,
      transport: 'js',
    },
    series: [
      {
        values: [74],
        animation: {
          delay:1200,
          effect: 2,
          method: 3,
          speed: 3000,
        },
        backgroundColor: 'black',
        indicator: [0.1, 4, 5, 5, 0.3],
      },
    ],

  };

  disqualifiedMeter: any = {
    type: 'ring',
    backgroundColor: '#fff',
    plot: {
      tooltip: {

        backgroundColor: 'none',
        borderWidth: '0px',
        fontSize: '0px',
        visible: false,
        sticky: true,
      },
      valueBox:
      {
        type: 'min',
        text:'%v%',
        // text: `${parseInt(data[0]/(data[0]+data[1])*100)}%`,
        fontColor: '#718096',
        fontSize: '20px',
        placement: 'center',
        visible: true,
        offsetY: '25px',
      },
      animation: {
        effect: 2,
        sequence: 3,
        speed:1000
      },
      backgroundColor: '#FBFCFE',
      borderWidth: '0px',

      slice: 50,
    },

    plotarea: {
      margin: '0px',
      backgroundColor: 'transparent',
      borderRadius: '10px',
      borderWidth: '0px',
    },
    scaleR: {
      refAngle: 130,
      aperture: 280,
    },
    series: [
      {
        text: 'Disqualified',
        values: [50],
        backgroundColor: '#ff4b4a',
        lineColor: '#ff4b4a',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#ff4b4a',
        },
      },
      {
        text: 'total',
        values: [50],
        backgroundColor: '#009fb5',
        lineColor: '#009fb5',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#009fb5',
        },
      },

    ],
    noData: {
      text: 'No Selection',
      alpha: 0.6,
      backgroundColor: '#20b2db',
      bold: true,
      fontSize: '10px',
      textAlpha: 0.9,
    },
  };

  gaugeConfig: any = {
    type: 'gauge',
    globals: {
      fontSize: '18px',
    },
    plot: {
      tooltip: {
        borderRadius: '5px',
        fontSize:'10px'
      },
      valueBox: {
        text: '%v',
        fontSize: '14px',
        placement: 'center',
        rules: [
          {
            text: '%v<br>Days',
            rule: '%v <= 30',
          },
        ],
      },
      size: '100%',
    },
    plotarea: {
      backgroundColor: 'transparent',
      marginTop: '40px',
      fontSize:'10px'
    },
    scaleR: {
      aperture: 180,
      center: {
        visible: false,
      },
      item: {
        offsetR: 0,

      },
      labels: ['1', '', '', '30'],
      maxValue: 30,
      minValue: 0,
      ring: {
        rules: [
          {
            backgroundColor: '#b5a1c8',
            rule: '%v <= 10',
          },
          {
            backgroundColor: '#654779',
            rule: '%v >= 10 && %v <= 20',
          },
          {
            backgroundColor: '#433051',
            rule: '%v >= 20 && %v <= 30',
          },
        ],
        size: '50px'
      },
      step: 10,
      tick: {
        visible: false,
      },
    },
    refresh: {
      type: 'feed',
      url: 'feed()',
      interval: 1500,
      resetTimeout: 1000,
      transport: 'js',
    },
    series: [
      {
        values: [3],
        animation: {
          delay:1200,
          effect: 2,
          method: 3,
          speed: 3000,
        },
        backgroundColor: 'black',
        indicator: [0.1, 4, 5, 5, 0.3],
      },
    ],

  };

  multiStackedConfig: any = {
    type: 'bar',
    stacked: true,
    title: {
      text: '',
      adjustLayout: true,
    },

    plot: {
      tooltip: {
        text: '%v%',
        borderRadius: '3px',
        fontColor: '#ffffff',

      },
      animation: {
        effect: 12,
        method: 0,
        speed: 1600,
      },


      valueBox: {
        text: '%total%',
        placement: "top-in",
        'font-color': "white",
        thousandsSeparator: ',',
        rules: [
          {
            rule: '%stack-top == 0',
            visible: false,
          },
        ],
      },
      offsetY: '-1px',
      rules: [
        {
          offsetY: '1px',
          rule: '%v <= 0',
        },
      ],
    },
    plotarea: {
      backgroundColor: 'transparent',
      margin: 'dynamic',
    },
    scaleX: {
      labels: ['APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR'],
    },
    scaleY: {
      format: '%v',
      guide: {
        items: [
          {
            backgroundColor: '#fff',
          }
        ],
      },
      multiplier: true,
      negation: 'currency',
      refLine: {
        lineColor: '#212121',
        lineWidth: '1px',
      },
    },
    series: [
      {
        text: 'Distributed Product',
        values: [35, -36, 99, 44, -52, 96, 41, 65,-25, -46, 95, -99],
        rules:[
          {
            rule:'%v >= 0',
            backgroundColor: '#00889f',
          },
          {
            backgroundColor: '#ff4f3f',
            rule:'%v < 0'
          }
        ],
        stack: 1,
      },
    ],

  };

  vbulletConfig: any = {
    type: 'vbullet',
    title: {
      text: '',
    },
    plot: {
      tooltip: {
        borderRadius: '3px',
        borderWidth: '1px',
        fontSize: '14px',
        shadow: true,
      },
      animation: {
        effect: 4,
        method: 0,
        speed: 1600,
      },
      valueBox:
        {
          type: 'all',
          text: '%node-goal-value',
          angle: 0,
          color: '#000',
          placement: 'goal',
        },
      },
      backgroundColor:'transparent',
    plotarea:{
      backgroundColor:'transparent'
    },
    scaleX: {
      labels: ['Segment 1', 'Segment 2', 'Segment 3', 'Segment 4', 'Segment 5', 'Segment 6', 'Segment 7'],
    },
    series: [
      {
        values: [20, 40, 14, 50, 15, 35, 45],
        dataDragging: true,
        goal: {
          borderWidth: '1px',
          height:0,
          borderColor:'#000'
        },
        goals: [25, 43, 30, 40, 21, 59, 43],
        rules: [
          {
            backgroundColor: '#64b5f6',
            rule: '%v >= %g',
          },
          {
            backgroundColor: '#bfbfbf',
            rule: '%v < %g',
          }
        ],
      },
    ],
  };

  sourceleadConfig: any = {
    type: 'bar',
    plot: {
      barWidth:'25px',
      tooltip: {
        borderRadius: '3px',
        borderWidth: '1px',
        fontSize: '14px',
        shadow: true,
      },
      animation: {
        effect: 4,
        method: 0,
        speed: 1600,
      },
      valueBox:
        {
          type: 'all',
          placement: "top-in",
          text: '%v%',
          angle:0,
          fontSize:'10px',
          fontWeight:'100',
          "font-color": "white",

        },
    },
    scaleX: {
      labels: ['Facebook', 'Website', 'Call', 'Walk', 'SMS', 'Toll Free', 'Others', 'Instagram', 'Linked-in', 'Reference', 'Whatsapp', 'Mail', 'IndiaMart', 'JustDial'],

    },
    series: [
      {
        values: [2, 40, 14, 50, 15, 35, 45, 20, 40, 14, 50, 15, 35, 35],
       styles:[
          {backgroundColor: '#95ce50'},
          {backgroundColor: '#ffb300'},
         {backgroundColor: '#ff6f00'},
         {backgroundColor: '#00897b'},
         {backgroundColor: '#43a047'},
         {backgroundColor: '#2e7d32'},
         {backgroundColor: '#989c25'},
         {backgroundColor: '#f70474'},
         {backgroundColor: '#0077b5'},
         {backgroundColor: '#d778b3'},
         {backgroundColor: '#1bd741'},
         {backgroundColor: '#ea4335'},
         {backgroundColor: '#1c124f'},
         {backgroundColor: '#fc6904'},
        ],
      },

    ],

  };

  duBalanceAgeChart: any = {
    type: 'bar',
    plot: {
      barWidth:'25px',
      tooltip: {
        borderRadius: '3px',
        borderWidth: '1px',
        fontSize: '14px',
        shadow: true,
      },
      animation: {
        effect: 4,
        method: 0,
        speed: 1600,
      },
      valueBox:
        {
          type: 'all',
          placement: "top-out",
          short: true,
          text: '%v',
          angle:0,
          fontSize:'10px',
          fontWeight:'100',
          "font-color": "black",

        },
    },
    scaleX: {
      "transform": {
        "type": "text",

      },
      "item": {
        "font-size": 9
      },
      wrapText: true,
      labels: ['Within<br/>Due Days', 'Over Due<br/>0-30<br/>Days', 'Over Due<br/>31-60<br/>Days', 'Over Due<br/>61-90<br/>Days', 'Due Over<br/>90 Days'],
    },
    scaleY:{
      visible:false
    },
    series: [
      {
        values: [40000, 10000, 14000, 50000, 15000],
        styles:[
          {'background-color':'#00ff00'},
          {'background-color':'#0073bd'},
          {'background-color':'#0073bd'},
          {'background-color':'#0073bd'},
          {'background-color':'#ea4335'},
        ]
      },

    ],

  };

  categoryleadConfig: any = {
    type: 'bar',
    title: {
      text: '',
    },
    plot: {
      tooltip: {
        borderRadius: '3px',
        borderWidth: '1px',
        fontSize: '14px',
        shadow: true,
      },
      animation: {
        effect: 4,
        method: 0,
        speed: 1600,
      },
      valueBox:
        {
          type: 'all',
          placement: "top-in",
          text: '%v%',
          angle:0,
          fontSize:'10px',
          fontWeight:'100',
          "font-color": "white"
        },
    },
    scaleX: {
      labels: ['Contractor', 'Architect', 'Site'],
    },
    series: [
      {
        values: [20, 13, 14],
        dataDragging: true,
        goal: {
          borderWidth: '1px',
          height:0,
          borderColor:'#000'
        },
        goals: [25, 30, 30],
        styles: [
          {backgroundColor: '#989c25'},
          {backgroundColor: '#f70474'},
          {backgroundColor: '#0077b5'},
        ],
      },
    ],
  };

  vbulletConfig2: any = {
    type: 'vbullet',
    title: {
      text: '',
    },
    plot: {
      tooltip: {
        backgroundColor:'black',
        borderRadius: '3px',
        borderWidth: '1px',
        fontSize: '14px',
        shadow: true,
      },
      animation: {
        effect: 4,
        method: 0,
        speed: 1600,
      },
      valueBox:
        {
          type: 'all',
          text: '%node-goal-value',
          'font-color': '#000',
          placement: 'goal',
        },
    },
    scaleX: {
      labels: ['APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR'],
    },
    series: [
      {
        values: [20, 40, 14, 50, 15, 35, 5, 20, 40, 14, 50, 15],
        dataDragging: true,
        goal: {
          backgroundColor: '#64b5f6',
          borderWidth: '1px',
          height:0,
          borderColor:'#000'
        },
        goals: [25, 43, 30, 40, 21, 59, 35, 25, 43, 30, 40, 21, 59],
        rules: [
          {
            backgroundColor: '#009fb5',
            rule: '%v >= %g',
          },
          {
            backgroundColor: '#ef5350',
            rule: '%v < %g/2',
          },
          {
            backgroundColor: '#ffca28',
            rule: '%v >= %g/2 && %v < %g',
          },
        ],
      },
    ],
  };

    invoicePieChart: ZingchartAngular.graphset = {
      type: 'ring',
      backgroundColor: '#fff',

      plot: {
        tooltip: {

          backgroundColor: 'none',
          borderWidth: '0px',
          fontSize: '10px',
          sticky: true,
          thousandsSeparator: ',',
        },
        valueBox:
          {
            type: 'all',
            text: '%t<br>%npv%',
            placement: 'out',
            fontSize:'10px'
          },

        animation: {
          effect: 2,
          sequence: 3,
          speed:1000
        },
        backgroundColor: '#FBFCFE',
        borderWidth: '0px',

        slice: 40,
      },
      plotarea: {
        margin: '0px',
        backgroundColor: 'transparent',
        borderRadius: '10px',
        borderWidth: '0px',
      },
      series: [
        {
          text: 'Invoice 1',
          values: [16541],
          backgroundColor: '#00889f',
          lineColor: '#00889f',
          lineWidth: '1px',
          marker: {
            backgroundColor: '#00889f',
          },
        },
        {
          text: 'Invoice 2',
          values: [36711],
          backgroundColor: '#3691d6',
          lineColor: '#3691d6',
          lineWidth: '1px',
          marker: {
            backgroundColor: '#3691d6',
          },
        },
        {
          text: 'Invoice 3',
          values: [50011],
          backgroundColor: '#b5a1c8',
          lineColor: '#b5a1c8',
          lineWidth: '1px',
          marker: {
            backgroundColor: '#b5a1c8',
          },
        },

      ],
      noData: {
        text: 'No Selection',
        alpha: 0.6,
        backgroundColor: '#20b2db',
        bold: true,
        fontSize: '10px',
        textAlpha: 0.9,
      },
    };

    overdueByRegionPieChart: ZingchartAngular.graphset = {
      type: 'ring',
      backgroundColor: '#fff',

      plot: {
        tooltip: {
          backgroundColor: 'black',
          borderWidth: '0px',
          fontSize: '10px',
          sticky: true,
          thousandsSeparator: ',',
        },
        valueBox:
          {
            type: 'all',
            text: '%t<br>%npv%',
            placement: 'out',
            fontSize:'10px'
          },

        animation: {
          effect: 2,
          sequence: 3,
          speed:1000
        },
        backgroundColor: '#FBFCFE',
        borderWidth: '0px',

        slice: 60,
      },
      plotarea: {
        margin: '0px',
        backgroundColor: 'transparent',
        borderRadius: '10px',
        borderWidth: '0px',
      },
      series: [
        {
          text: 'East',
          values: [16541],
          backgroundColor: '#95ce50',
          lineColor: '#95ce50',
          lineWidth: '1px',
          marker: {
            backgroundColor: '#95ce50',
          },
        },
        {
          text: 'West',
          values: [36711],
          backgroundColor: '#ffb300',
          lineColor: '#ffb300',
          lineWidth: '1px',
          marker: {
            backgroundColor: '#ffb300',
          },
        },
        {
          text: 'North',
          values: [50011],
          backgroundColor: '#ff6f00',
          lineColor: '#ff6f00',
          lineWidth: '1px',
          marker: {
            backgroundColor: '#ff6f00',
          },
        },
        {
          text: 'South',
          values: [50011],
          backgroundColor: '#0071bd',
          lineColor: '#0071bd',
          lineWidth: '1px',
          marker: {
            backgroundColor: '#0071bd',
          },
        },

      ],
      noData: {
        text: 'No Selection',
        alpha: 0.6,
        backgroundColor: '#20b2db',
        bold: true,
        fontSize: '10px',
        textAlpha: 0.9,
      },
    };

    transectionChart: ZingchartAngular.graphset = {
      type: "line",
      scaleX: {
        // labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
        visible:false
      },
      scaleY:{
        visible:false
      },
      plot: {
        aspect: "spline",
        },
      series: [{
          values: this.transectionValue,
          monotone: true,
          text: "monotone: true"
        },

      ]
    }

    invoiceCollectionChart: any = {
      type: "line",
      scaleX: {
        // labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
        "step":"86400000",
    "transform": {
      "type":"date",
      "all":"%d<br/>day"
    },
    "item":{
      "font-size":9
    },
      },
      "tooltip": {
        "visible": false
      },
      plot: {
        aspect: "spline",
        "tooltip-text": "%t views: %v<br>%k",
        "shadow": 0,
        "line-width": "2px",
        "marker": {
          "type": "circle",
          "size": 3
          }
        },
        plotarea: {
          backgroundColor: 'transparent',
          marginTop:'20px',
        },
        "crosshair-x": {
          "line-color": "#efefef",
          "plot-label": {
            "border-radius": "5px",
            "border-width": "1px",
            "border-color": "#f6f7f8",
            "padding": "10px",
            "font-weight": "bold"
          },
          "scale-label": {
            "font-color": "#000",
            "background-color": "#f6f7f8",
            "border-radius": "5px"
          }
        },
      series: [{
          values: this.invoiceValue1,
          monotone: true,
          text: "Invoice",
          lineColor:'#0071bd',
          "marker": {
            "background-color": "#0071bd",
          },

        },
        {
          values: this.collectionValue1,
          monotone: true,
          text: "Collection",
          lineColor:'#6ec44d',
          "marker": {
            "background-color": "#6ec44d",
          },
          "highlight-state": {
            "line-width": 3
          },
        },

      ]
    }

    // influencer rewards
    totalInfluencerPieChart:any = {
      type: 'ring',
      backgroundColor: '#fff',

      plot: {
        tooltip: {

          backgroundColor: '#000',
          borderWidth: '0px',
          fontSize: '10px',
          sticky: true,
          thousandsSeparator: ',',
        },
        valueBox:
          {
            type: 'all',
            text: '%npv%',
            "offset-r":"-4%",
            fontSize:'8px',

          },
        animation: {
          effect: 2,
          sequence: 3,
          speed:1000
        },
        backgroundColor: '#FBFCFE',
        borderWidth: '0px',
        slice: 0,
      },
      plotarea: {
        margin: '0px',
        backgroundColor: 'transparent',
        borderRadius: '10px',
        borderWidth: '0px',
      },

      series: [

        {
          text: 'Site',
          values: [60],
          backgroundColor: '#00a54d',
          lineColor: '#009fb5',
          lineWidth: '1px',
          marker: {
            backgroundColor: '#009fb5',
          },
        },
        {
          text: 'Architect',
          values: [20],
          backgroundColor: 'var(--warning)',
          lineColor: 'var(--warning)',
          lineWidth: '1px',
          marker: {
            backgroundColor: 'var(--warning)',
          },
        },
        {
          text: 'Contractor',
          values: [20],
          backgroundColor: 'var(--primary-tint)',
          lineColor: 'var(--primary-tint)',
          lineWidth: '1px',
          marker: {
            backgroundColor: 'var(--primary-tint)',
          },
        },

      ],
      noData: {
        text: 'No Selection',
        alpha: 0.6,
        backgroundColor: '#20b2db',
        bold: true,
        fontSize: '10px',
        textAlpha: 0.9,
      },
    };

    influencerStatusPieChart: any = {
      type: 'ring',
      backgroundColor: '#fff',

      plot: {
        tooltip: {

          backgroundColor: '#000',
          borderWidth: '0px',
          fontSize: '10px',
          sticky: true,
          thousandsSeparator: ',',
        },
        valueBox:
          {
            type: 'all',
            text: '%npv%',
            placement: 'in',
            fontSize:'8px'
          },
        animation: {
          effect: 2,
          sequence: 3,
          speed:1000
        },
        backgroundColor: '#FBFCFE',
        borderWidth: '0px',
        slice: 0,
      },
      plotarea: {
        margin: '0px',
        backgroundColor: 'transparent',
        borderRadius: '10px',
        borderWidth: '0px',
      },

      series: [
        {
          text: 'Pending',
          values: [10],
          backgroundColor: '#ffc300',
          lineColor: '#ffc300',
          lineWidth: '1px',
          marker: {
            backgroundColor: '#ffc300',
          },
        },
        {
          text: 'Approved',
          values: [60],
          backgroundColor: '#00a54d',
          lineColor: '#009fb5',
          lineWidth: '1px',
          marker: {
            backgroundColor: '#009fb5',
          },
        },
        {
          text: 'Reject',
          values: [20],
          backgroundColor: '#ff4b4a',
          lineColor: '#ff4b4a',
          lineWidth: '1px',
          marker: {
            backgroundColor: '#ff4b4a',
          },
        },
        {
          text: 'Suspect',
          values: [10],
          backgroundColor: 'var(--secondary)',
          lineColor: 'var(--secondary)',
          lineWidth: '1px',
          marker: {
            backgroundColor: 'var(--secondary)',
          },
        }

      ],
      noData: {
        text: 'No Selection',
        alpha: 0.6,
        backgroundColor: '#20b2db',
        bold: true,
        fontSize: '10px',
        textAlpha: 0.9,
      },
    };

    kycStatusPieChart: any = {
      type: 'ring',
      backgroundColor: '#fff',

      plot: {
        tooltip: {

          backgroundColor: '#000',
          borderWidth: '0px',
          fontSize: '10px',
          sticky: true,
          thousandsSeparator: ',',
        },
        valueBox:
          {
            type: 'all',
            text: '%npv%',
            placement: 'in',
            fontSize:'8px'
          },
        animation: {
          effect: 2,
          sequence: 3,
          speed:1000
        },
        backgroundColor: '#FBFCFE',
        borderWidth: '0px',
        slice: 0,
      },
      plotarea: {
        margin: '0px',
        backgroundColor: 'transparent',
        borderRadius: '10px',
        borderWidth: '0px',
      },

      series: [
        {
          text: 'kYC Status',
          values: [60],
          backgroundColor: 'var(--warning)',
          lineColor: 'var(--warning)',
          lineWidth: '1px',
          marker: {
            backgroundColor: 'var(--warning)',
          },
        },
        {
          text: 'Redeem Request',
          values: [40],
          backgroundColor: 'var(--primary-tint)',
          lineColor: 'var(--primary-tint)',
          lineWidth: '1px',
          marker: {
            backgroundColor: 'var(--primary-tint)',
          },
        },
      ],
      noData: {
        text: 'No Selection',
        alpha: 0.6,
        backgroundColor: '#20b2db',
        bold: true,
        fontSize: '10px',
        textAlpha: 0.9,
      },
    };

    totalCouponPieChart: any = {
      type: 'ring',
      backgroundColor: '#fff',

      plot: {
        tooltip: {

          backgroundColor: '#000',
          borderWidth: '0px',
          fontSize: '10px',
          sticky: true,
          thousandsSeparator: ',',
        },
        valueBox:
          {
            type: 'all',
            text: '%npv%',
            placement: 'in',
            fontSize:'8px'
          },
        animation: {
          effect: 2,
          sequence: 3,
          speed:1000
        },
        backgroundColor: '#FBFCFE',
        borderWidth: '0px',
        slice: 0,
      },
      plotarea: {
        margin: '0px',
        backgroundColor: 'transparent',
        borderRadius: '10px',
        borderWidth: '0px',
      },

      series: [
        {
          text: 'Item Count',
          values: [1000],
          backgroundColor: 'var(--primary-tint)',
          lineColor: 'var(--primary-tint)',
          lineWidth: '1px',
          marker: {
            backgroundColor: 'var(--primary-tint)',
          },
        },
        {
          text: 'Box Count',
          values: [50],
          backgroundColor: 'var(--primary-tint)',
          lineColor: 'var(--primary-tint)',
          lineWidth: '1px',
          marker: {
            backgroundColor: 'var(--primary-tint)',
          },
        },
      ],
      noData: {
        text: 'No Selection',
        alpha: 0.6,
        backgroundColor: '#20b2db',
        bold: true,
        fontSize: '10px',
        textAlpha: 0.9,
      },
    };

    scanningInDaysChart: any = {
      type: "line",
      scaleX: {
        "step":"86400000",
    "transform": {
      "type":"date",
      "all":"%d<br/>day"
    },
    "item":{
      "font-size":9
    },
      },
      "tooltip": {
        "visible": false
      },
      plot: {
        aspect: "spline",
        "tooltip-text": "%t views: %v<br>%k",
        "shadow": 0,
        "line-width": "2px",
        "marker": {
          "type": "circle",
          "size": 3
          }
        },
        plotarea: {
          backgroundColor: 'transparent',
          marginTop:'20px',
        },
        "crosshair-x": {
          "line-color": "#efefef",
          "plot-label": {
            "border-radius": "5px",
            "border-width": "1px",
            "border-color": "#f6f7f8",
            "padding": "10px",
            "font-weight": "bold"
          },
          "scale-label": {
            "font-color": "#000",
            "background-color": "#f6f7f8",
            "border-radius": "5px"
          }
        },
      series: [{
          values: this.items,
          monotone: true,
          text: "Items",
          lineColor:'var(--primary-tint)',
          "marker": {
            "background-color": "var(--primary-tint)",
          },

        },
        {
          values: this.boxes,
          monotone: true,
          text: "Boxes",
          lineColor:'var(--text)',
          "marker": {
            "background-color": "var(--text)",
          },
          "highlight-state": {
            "line-width": 3
          },
        },

      ]
    }

    couponStatusBarChart:any = {
      type: "bar",
      scaleX: {
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      },
      plot:{
        valueBox: {
          text: '%v',
          short: true,
          placement: "top-out",
          'font-color': "black",
          'font-weight':'normal',
          'font-size':'10px',
          thousandsSeparator: ',',
        },
        animation: {
          effect: 11,
          speed: 3000,
        }
      },
      plotarea: {
        backgroundColor: 'transparent',
        marginTop:'60px',
        marginRight:'15px',
        marginLeft:'80px'
      },
      series: [
        {
          text:'Invoice',
          values:this.generatedCoupon,
          backgroundColor:'#0071bd'
        },
        {
          text:'Collection',
          values:this.scannedCoupon,
          backgroundColor:'#6ec44d'
        }
      ]
    };

    regionScanningBarChart:any = {
      type: "hbar",
      scaleX: {
        labels: ['East', 'West', 'North', 'South'],
      },
      scaleY:{
        visible:false
      },
      plot:{
        valueBox: {
          text: '%v%',
          placement: "top-in",
          'font-color': "#fff",
          'font-weight':'400',
          thousandsSeparator: ',',
        },
        animation: {
          effect: 11,
          speed: 3000,
        }
      },
      plotarea: {
        backgroundColor: 'transparent',
        marginTop:'0',
        marginRight:'15px',
        marginLeft:'80px'
      },
      series: [
        {
          values:[40,25,15,20],
          backgroundColor:'var(--primary-tint)'
        },
        {
          values:[80,60,90,40],
          backgroundColor:'var(--text)'
        }
      ]
    };

    scanningAgeChart: any = {
      type: 'bar',
      plot: {
        barWidth:'25px',
        tooltip: {
          borderRadius: '3px',
          borderWidth: '1px',
          fontSize: '14px',
          shadow: true,
        },
        animation: {
          effect: 4,
          method: 0,
          speed: 1600,
        },
        valueBox:
          {
            type: 'all',
            placement: "top-out",
            short: true,
            text: '%v%',
            // text: `${parseInt(data[0]/(data[0]+data[1])*100)}%`,
            angle:0,
            fontSize:'10px',
            fontWeight:'100',
            "font-color": "black",

          },
      },
      scaleX: {
        "transform": {
          "type": "text",

        },
        "item": {
          "font-size": 9
        },
        wrapText: true,
        labels: ['0-7<br/>Days', 'Last 30<br/>Days', 'Last 06<br/>Months', 'Last<br/>01 Year', 'Not<br/>Scanning'],
      },
      scaleY:{
        visible:false
      },
      series: [
        {
          values: [20, 35, 40, 70, 20],
          styles:[
            {'background-color':'var(--success)'},
            {'background-color':'var(--primary-tint)'},
            {'background-color':'var(--primary-tint)'},
            {'background-color':'var(--primary-tint)'},
            {'background-color':'#ea4335'},
          ]
        },

      ],

    };





    influencerConversionPieChart: any = {
      type: 'ring',
      backgroundColor: '#fff',

      plot: {
        tooltip: {
          backgroundColor: 'black',
          borderWidth: '0px',
          fontSize: '10px',
          sticky: true,
          thousandsSeparator: ',',
          text:'%t<br/>%npv%'
        },
        valueBox:
          {
            type: 'all',
            text: '%npv%',
            placement: 'out',
            fontSize:'10px'
          },

        animation: {
          effect: 2,
          sequence: 3,
          speed:1000
        },
        backgroundColor: '#FBFCFE',
        borderWidth: '0px',

        slice: 60,
      },
      plotarea: {
        margin: '0px',
        backgroundColor: 'transparent',
        borderRadius: '10px',
        borderWidth: '0px',
      },
      series: [
        {
          text: 'Self Registration',
          values: [58],
          backgroundColor: 'var(--success)',
          lineColor: 'var(--success)',
          lineWidth: '1px',
          marker: {
            backgroundColor: 'var(--success)',
          },
        },

        {
          text: 'Register By Sales Executive',
          values: [32],
          backgroundColor: 'var(--warning)',
          lineColor: 'var(--warning)',
          lineWidth: '1px',
          marker: {
            backgroundColor: 'var(--warning)',
          },
        },
        {
          text: 'Referral By Influencer',
          values: [10],
          backgroundColor: 'var(--danger)',
          lineColor: 'var(--danger)',
          lineWidth: '1px',
          marker: {
            backgroundColor: 'var(--danger)',
          },
        },
      ],
      noData: {
        text: 'No Selection',
        alpha: 0.6,
        backgroundColor: '#20b2db',
        bold: true,
        fontSize: '10px',
        textAlpha: 0.9,
      },
    };

    scanningMeter: any = {
      type: 'gauge',
      globals: {
        fontSize: '18px',
      },
      plot: {
        tooltip: {
          borderRadius: '5px',
          fontSize:'10px'
        },
        valueBox: {

          text: '%v',
          fontSize: '14px',
          placement: 'center',
          rules: [
            {
              text: '%v<br>Days',
              rule: '%v <= 30',
            },
          ],
        },
        size: '100%',
        animation: {
          effect: 11,
          speed: 3000,
        }
      },
      plotarea: {
        backgroundColor: 'transparent',
        marginTop: '40px',
      },
      scaleR: {

        aperture: 180,
        center: {
          visible: false,
        },
        item: {
          offsetR: 0,

        },
        labels: ['1', '', '', '', '31'],
        maxValue: 31,
        minValue: 1,
        ring: {
          rules: [
            {
              backgroundColor: '#b5a1c8',
              rule: '%v <= 8',
            },
            {
              backgroundColor: '#654779',
              rule: '%v >= 8 && %v <= 16',
            },
            {
              backgroundColor: '#433051',
              rule: '%v >= 18 && %v <= 31',
            },
          ],
          size: '50px'
        },
        step: 10,
        tick: {
          visible: false,
        },

      },

      refresh: {
        type: 'feed',
        url: 'feed()',
        interval: 1500,
        resetTimeout: 1000,
        transport: 'js',
      },
      series: [
        {
          values: [21],
          backgroundColor: 'black',
          indicator: [0.1, 4, 5, 5, 0.3],

        },
      ],

    };


    pointRedeemMeter: any = {
      type: 'gauge',
      globals: {
        fontSize: '18px',
      },
      plot: {
        tooltip: {
          borderRadius: '5px',
          fontSize:'10px'
        },
        valueBox: {
          text: '%v',
          fontSize: '14px',
          placement: 'center',
          rules: [
            {
              text: '%v<br>Days',
              rule: '%v <= 30',
            },
          ],
        },
        size: '100%',
      },
      plotarea: {
        backgroundColor: 'transparent',
        marginTop: '40px',
        fontSize:'10px'
      },
      scaleR: {
        aperture: 180,
        center: {
          visible: false,
        },
        item: {
          offsetR: 0,

        },
        labels: ['1', '', '', '', '31'],
        maxValue: 31,
        minValue: 1,
        ring: {
          rules: [
            {
              backgroundColor: '#b5a1c8',
              rule: '%v <= 8',
            },
            {
              backgroundColor: '#654779',
              rule: '%v >= 8 && %v <= 16',
            },
            {
              backgroundColor: '#433051',
              rule: '%v >= 18 && %v <= 31',
            },
          ],
          size: '50px'
        },
        step: 7.75,
        tick: {
          visible: false,
        },
      },
      refresh: {
        type: 'feed',
        url: 'feed()',
        interval: 1500,
        resetTimeout: 1000,
        transport: 'js',
      },
      series: [
        {
          values: [26],
          animation: {
            delay:1200,
            effect: 2,
            method: 3,
            speed: 3000,
          },
          backgroundColor: 'black',
          indicator: [0.1, 4, 5, 5, 0.3],
        },
      ],

    };
  }
