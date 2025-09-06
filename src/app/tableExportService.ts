import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import * as Excel from "exceljs/dist/exceljs.min.js"
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  transactionType: any = [];
  transactionStatus: any = [];
  couponStatus: any;
  couponSource:any=[];
  guestFilterType: any;
  constructor() {

  }

  public exportTransactionHistoryNewAsExcelFile(transactionDateTime, columnNames, json: any[], transactionType, transactionStatus, startDate, endDate) {
    const header = columnNames;
    this.transactionType = transactionType;
    this.transactionStatus = transactionStatus
    let excelFileName = 'Transaction History';
    let workbook = new Excel.Workbook();
    let date = new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear();
    let time = new Date().toLocaleTimeString("en-US", { hour12: false });
    if (transactionDateTime == null || transactionDateTime == '') {
      transactionDateTime = date + ' ' + time;
    } else {
      transactionDateTime;
    }
    let worksheet = workbook.addWorksheet(date);
    worksheet.mergeCells('D1:G1');
    worksheet.getCell('D1').value = excelFileName;
    worksheet.getCell('D1').font = {
      bold: true,
      size: 14
    };
    worksheet.addRow([]);
    worksheet.addRow(['', '', 'Start Date', startDate, '', '', 'Report Generation Date', transactionDateTime]);
    worksheet.addRow(['', '', 'End Date', endDate]);
    worksheet.addRow([]);
    worksheet.addRow([]);
    let headerRow = worksheet.addRow(header);
    headerRow.font = {
      size: 11,
      bold: true
    };
    headerRow.eachCell((cell, number) => {
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    let row;

    json.forEach((element, i) => {
      let eachRow = [i + 1, element.transactionId, element.transactionDatetime, element.accountNumber, element.phone, element.cardNumber, element.amount, element.tax, element.loanAmount, element.totalAmount, this.getLookup(element.transactionType, "transactionType"), element.bundleName, this.getLookup(element.status, "transactionStatus")];
      let row = worksheet.addRow(eachRow);
      // var eachRow = [ dataRow ]

      row.eachCell((cell, number) => {
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        cell.alignment = { horizontal: 'right', vertical: 'top', };
        // const numFmtStr =  '$#,##0.00;[Red]-$#,##0.00';
        // cell.numFmt = numFmtStr;
      })
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: EXCEL_TYPE });
      FileSaver.saveAs(blob, excelFileName + '_' + this.getUniqueTime() + EXCEL_EXTENSION);
    })
  }

  public exportUsersTransactionHistoryNewAsExcelFile(transactionDateTime, tabInfo, columnNames, json: any[], headersArray, guestFilterType, transactionType, transactionStatus, startDate, endDate) {
    const header = columnNames;
    this.guestFilterType = guestFilterType;
    this.transactionType = transactionType;
    this.transactionStatus = transactionStatus
    let excelFileName = 'Transaction History';
    let time = new Date().toLocaleTimeString("en-US", { hour12: false });
    let workbook = new Excel.Workbook();
    let date = new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear();
    if (transactionDateTime == null || transactionDateTime == '') {
      transactionDateTime = date + ' ' + time;
    } else {
      transactionDateTime;
    }
    let worksheet = workbook.addWorksheet(date);
    worksheet.mergeCells('D1:G1');
    worksheet.getCell('D1').value = excelFileName;
    worksheet.getCell('D1').font = {
      bold: true,
      size: 14
    };
    worksheet.addRow([]);
    worksheet.addRow(['', '', 'Start Date', startDate, '', '', 'Report Generation Date', transactionDateTime]);
    worksheet.addRow(['', '', 'End Date', endDate]);
    worksheet.addRow([]);
    worksheet.addRow([]);

    let headerRow1 = worksheet.addRow(headersArray);
    headerRow1.font = {
      size: 11,
      bold: true
    };
    headerRow1.eachCell((cell, number) => {
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    let eachRow1 = [tabInfo.totalTransactions,
    tabInfo.totalAmount,
    tabInfo.billPaymentTransactions,
    tabInfo.billPaymentAmount,
    tabInfo.topupTaxAmount,
    tabInfo.topupTransactions,
    tabInfo.topupAmount,
    tabInfo.prepaidBundleTaxAmount,
    tabInfo.prepaidBundleTransactions,
    tabInfo.prepaidBundleAmount,
    tabInfo.topupVoucherAmount,
    tabInfo.topupVoucherTransactions
    ];
    let row1 = worksheet.addRow(eachRow1);
    row1.eachCell((cell, number) => {
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      cell.alignment = { horizontal: 'right', vertical: 'top', width: 300 };
    })

    worksheet.addRow([]);
    worksheet.addRow([]);

    let headerRow = worksheet.addRow(header);
    headerRow.font = {
      size: 11,
      bold: true
    };
    headerRow.eachCell((cell, number) => {
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    let row;

    json.forEach((element, i) => {
      let eachRow = [i + 1, element.customerId, element.transactionId, element.transactionDatetime, element.accountNumber, element.phone, element.cardNumber, element.amount, element.tax, element.loanAmount, element.totalAmount, this.getLookup(element.transactionType, "transactionType"), element.bundleName, this.getLookup(element.transactionStatus, "transactionStatus")];
      let row = worksheet.addRow(eachRow);
      // var eachRow = [ dataRow ]

      row.eachCell((cell, number) => {
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        cell.alignment = { horizontal: 'right', vertical: 'top', };
        // const numFmtStr =  '$#,##0.00;[Red]-$#,##0.00';
        // cell.numFmt = numFmtStr;
      })
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: EXCEL_TYPE });
      FileSaver.saveAs(blob, excelFileName + '_' + this.getUniqueTime() + EXCEL_EXTENSION);
    })
  }
  public exportUsersCouponTransactionHistoryNewAsExcelFile(tabInfo, columnNames, json: any[],headersArray, couponStatus,couponSource) {
    const header = columnNames;
    // this.transactionType=transactionType;
    // this.transactionStatus=transactionStatus
    this.couponStatus=couponStatus;
    this.couponSource=couponSource;
    let excelFileName = 'Coupon Transaction History';
    let time = new Date().toLocaleTimeString("en-US", { hour12: false });
    let workbook = new Excel.Workbook();
    let date = new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear();
    // if (transactionDateTime == null || transactionDateTime == '') {
    //   transactionDateTime = date + ' ' + time;
    // } else {
    //   transactionDateTime;
    // }
    let worksheet = workbook.addWorksheet(date);
    worksheet.mergeCells('D1:G1');
    worksheet.getCell('D1').value = excelFileName;
    worksheet.getCell('D1').font = {
      bold: true,
      size: 14
    };
    worksheet.addRow([]);
    // worksheet.addRow(['', '', 'Start Date', startDate, '', '', 'Report Generation Date', transactionDateTime]);
    // worksheet.addRow(['', '', 'End Date', endDate]);  
    worksheet.addRow([]);
    worksheet.addRow([]);

    let headerRow1 = worksheet.addRow(headersArray);
    headerRow1.font = {
      size: 11,
      bold: true
    };
    headerRow1.eachCell((cell, number) => {
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    let eachRow1 = [
    tabInfo.issuedCoupons,
    tabInfo.couponsRedeemed,
    tabInfo.unredeeemedCoupons,
    tabInfo.couponsRemaining!="0"? tabInfo.couponsRemaining:"-" ,
    ];
    let row1 = worksheet.addRow(eachRow1);
    row1.eachCell((cell, number) => {
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      cell.alignment = { horizontal: 'right', vertical: 'top', width: 300 };
    })

    worksheet.addRow([]);
    worksheet.addRow([]);

    let headerRow = worksheet.addRow(header);
    headerRow.font = {
      size: 11,
      bold: true
    };
    headerRow.eachCell((cell, number) => {
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    let row;

    json.forEach((element, i) => {
      let eachRow = [
        i + 1,
        element.issuedTrnxId,
        // element.fullName,
        element.consumerEmail,
        // element.consumerPhone,
        element.couponCode,
        // element.couponSource,
        this.getLookup(element.couponSource,"couponSource"),
        element.couponName,
        element.issueStartDateTime,
        element.issueEndDateTime,
        element.startDateTime,
        element.endDateTime,
        element.isExpired,
        element.isUsed,
        element.issuedPhone,
        element.issuedAt,
        element.redeemedPhone,
        element.usedAt,
        // element.vendor,
        this.getLookup(element.couponStatus, "couponStatus")
      ];

      let row = worksheet.addRow(eachRow);
      // var eachRow = [ dataRow ]

      row.eachCell((cell, number) => {
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        cell.alignment = { horizontal: 'right', vertical: 'top', };
        // const numFmtStr =  '$#,##0.00;[Red]-$#,##0.00';
        // cell.numFmt = numFmtStr;
      })
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: EXCEL_TYPE });
      FileSaver.saveAs(blob, excelFileName + '_' + this.getUniqueTime() + EXCEL_EXTENSION);
    })
  }

  public exportInfluencerCouponReportNewAsExcelFile( columnNames, json: any[]) {
    const header = columnNames;
    let excelFileName = 'Influencer Coupon Report';
    let time = new Date().toLocaleTimeString("en-US", { hour12: false });
    let workbook = new Excel.Workbook();
    let date = new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear();
    // if (transactionDateTime == null || transactionDateTime == '') {
    //   transactionDateTime = date + ' ' + time;
    // } else {
    //   transactionDateTime;
    // }
    let worksheet = workbook.addWorksheet(date);
    worksheet.mergeCells('D1:G1');
    worksheet.getCell('D1').value = excelFileName;
    worksheet.getCell('D1').font = {
      bold: true,
      size: 14
    };
    worksheet.addRow([]);
    // worksheet.addRow(['', '', 'Start Date', startDate, '', '', 'Report Generation Date', transactionDateTime]);
    // worksheet.addRow(['', '', 'End Date', endDate]);  
    worksheet.addRow([]);
    worksheet.addRow([]);

    let headerRow = worksheet.addRow(header);
    headerRow.font = {
      size: 11,
      bold: true
    };
    headerRow.eachCell((cell, number) => {
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    let row;

    json.forEach((element, i) => {
      let eachRow = [
        i + 1, 
        element.startDateTime,
        element.endDateTime,
        element.couponCode,
        element.couponCount,
        element.promotionName,
        element.influencerName,
        element.redeemCount,
        element.discountPercent,
        element.activeYn === 1 ? 'Yes' : 'No', 
        element.isDeletedYn === 1 ? 'Yes' : 'No' 
      ];

      let row = worksheet.addRow(eachRow);
      // var eachRow = [ dataRow ]

      row.eachCell((cell, number) => {
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        cell.alignment = { horizontal: 'right', vertical: 'top', };
        // const numFmtStr =  '$#,##0.00;[Red]-$#,##0.00';
        // cell.numFmt = numFmtStr;
      })
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: EXCEL_TYPE });
      FileSaver.saveAs(blob, excelFileName + '_' + this.getUniqueTime() + EXCEL_EXTENSION);
    })
  }

  public exportUsersRedeemedCouponTransactionHistoryNewAsExcelFile(transactionDateTime, tabInfo, columnNames, json: any[], headersArray, transactionStatus, startDate, endDate,couponSource) {
    const header = columnNames;
    this.couponSource=couponSource;
    // this.transactionType=transactionType;
    // this.transactionStatus=transactionStatus
    this.transactionStatus = transactionStatus;
    let excelFileName = 'Redeemed Coupon Transaction History';
    let time = new Date().toLocaleTimeString("en-US", { hour12: false });
    let workbook = new Excel.Workbook();
    let date = new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear();
    if (transactionDateTime == null || transactionDateTime == '') {
      transactionDateTime = date + ' ' + time;
    } else {
      transactionDateTime;
    }
    let worksheet = workbook.addWorksheet(date);
    worksheet.mergeCells('D1:G1');
    worksheet.getCell('D1').value = excelFileName;
    worksheet.getCell('D1').font = {
      bold: true,
      size: 14
    };
    worksheet.addRow([]);
    worksheet.addRow(['', '', 'Start Date', startDate, '', '', 'Report Generation Date', transactionDateTime]);
    worksheet.addRow(['', '', 'End Date', endDate]);
    worksheet.addRow([]);
    worksheet.addRow([]);

    let headerRow1 = worksheet.addRow(headersArray);
    headerRow1.font = {
      size: 11,
      bold: true
    };
    headerRow1.eachCell((cell, number) => {
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    let eachRow1 = [
      tabInfo.totalCouponTransactions,
      tabInfo.totalAmountPaid,
      tabInfo.discountAmountApplied
    ];
    let row1 = worksheet.addRow(eachRow1);
    row1.eachCell((cell, number) => {
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      cell.alignment = { horizontal: 'right', vertical: 'top', width: 300 };
    })

    worksheet.addRow([]);
    worksheet.addRow([]);

    let headerRow = worksheet.addRow(header);
    headerRow.font = {
      size: 11,
      bold: true
    };
    headerRow.eachCell((cell, number) => {
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    let row;

    json.forEach((element, i) => {
      let eachRow = [
        i + 1,
        element.customerId,
        element.transactionId,
        element.name,
        element.phone,
        element.email,
        element.accountNumber,
        element.couponCode,
        element.influencerName,
        // element.couponSource,
        this.getLookup(element.couponSource,"couponSource"),
        element.couponName,
        element.bundleName,
        element.cardNumber,
        element.discount,
        element.discountedAmount,
        element.discountedTax,
        element.discountedTotalAmount,
        element.loanAmount,
        element.originalAmount,
        element.originalTax,
        element.originalTotalAmount,
        element.transactionDatetime,
        this.getLookup(element.transactionStatus, "transactionStatus")
        // element.transactionType
      ];

      let row = worksheet.addRow(eachRow);
      // var eachRow = [ dataRow ]

      row.eachCell((cell, number) => {
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        cell.alignment = { horizontal: 'right', vertical: 'top', };
        // const numFmtStr =  '$#,##0.00;[Red]-$#,##0.00';
        // cell.numFmt = numFmtStr;
      })
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: EXCEL_TYPE });
      FileSaver.saveAs(blob, excelFileName + '_' + this.getUniqueTime() + EXCEL_EXTENSION);
    })
  }

  public exportrefundTransactionHistoryNewAsExcelFile(transactionDateTime, columnNames, json: any[], transactionType, startDate, endDate) {
    const header = columnNames;
    this.transactionType = transactionType;
    let excelFileName = 'Refund Payment History';
    let time = new Date().toLocaleTimeString("en-US", { hour12: false });
    let workbook = new Excel.Workbook();
    let date = new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear();
    if (transactionDateTime == null || transactionDateTime == '') {
      transactionDateTime = date + ' ' + time;
    } else {
      transactionDateTime;
    }
    let worksheet = workbook.addWorksheet(date);
    worksheet.mergeCells('D1:G1');
    worksheet.getCell('D1').value = excelFileName;
    worksheet.getCell('D1').font = {
      bold: true,
      size: 14
    };
    worksheet.addRow([]);
    worksheet.addRow(['', '', 'Start Date', startDate, '', '', 'Report Generation Date', transactionDateTime]);
    worksheet.addRow(['', '', 'End Date', endDate]);
    worksheet.addRow([]);
    worksheet.addRow([]);
    let headerRow = worksheet.addRow(header);
    headerRow.font = {
      size: 11,
      bold: true
    };
    headerRow.eachCell((cell, number) => {
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    let row;

    json.forEach((element, i) => {
      let eachRow = [i + 1, element.transactionId, element.transactionDatetime, element.orderNumber, element.customerId, element.accountNumber, element.mobileNumber, element.cardNumber, element.amount, element.tax, element.totalAmount, this.getLookup(element.transactionType, "transactionType"), element.isRefunded == true ? 'Refunded' : 'Not Refunded'];
      let row = worksheet.addRow(eachRow);
      // var eachRow = [ dataRow ]

      row.eachCell((cell, number) => {
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        cell.alignment = { horizontal: 'right', vertical: 'top', };
        // const numFmtStr =  '$#,##0.00;[Red]-$#,##0.00';
        // cell.numFmt = numFmtStr;
      })
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: EXCEL_TYPE });
      FileSaver.saveAs(blob, excelFileName + '_' + this.getUniqueTime() + EXCEL_EXTENSION);
    })
  }
  getUniqueTime() {
    const currentDate = new Date().toLocaleString('en-US', { timeZone: 'America/New_York', hour12: false });
    const dateTimeParts = currentDate.split(', ');
    const dateParts = dateTimeParts[0].split('/');
    const timeParts = dateTimeParts[1].split(':');

    const day = String(dateParts[1]).padStart(2, '0');
    const month = String(dateParts[0]).padStart(2, '0');
    const year = dateParts[2];
    const hours = String(timeParts[0]).padStart(2, '0');
    const minutes = String(timeParts[1]).padStart(2, '0');
    const seconds = String(timeParts[2]).padStart(2, '0');

    return `${day}-${month}-${year}_${hours}-${minutes}-${seconds}`;


  }
  getLookup(value, fieldName) {
    let element: any;
    if (fieldName == 'transactionType') {
      element = this.transactionType.filter(element => element.key == value)[0];
    }
    else if (fieldName == 'guestFilterType') {
      element = this.guestFilterType.filter(element => element.key == value)[0];
    }
    else if (fieldName == 'transactionStatus') {
      element = this.transactionStatus.filter(element => element.key == value)[0];
    }
    else if (fieldName == 'couponStatus') {
      element = this.couponStatus.filter(element => element.key == value)[0];
    }
    else if (fieldName == 'couponSource') {
      element = this.couponSource.filter(element => element.key == value)[0];
    }

    if (element) {
      return element.value;
    }

  }
  public exportCMSAsExcelFile(
    json: any[],
    header,
    excelFileName: string,
    transactionDateTime,
    startDate,
    endDate,
    
  ) {
    const headerArray = header;
    let workbook = new Excel.Workbook();
    let time = new Date().toLocaleTimeString("en-US", {
      timeZone: "Jamaica",
      hour12: false,
    });
    let date =
      new Date().getDate() +
      "-" +
      (new Date().getMonth() + 1) +
      "-" +
      new Date().getFullYear();
    let worksheet = workbook.addWorksheet(date);
    worksheet.mergeCells("C1:F1");
    worksheet.getCell("C1").value = excelFileName;
    worksheet.getCell("C1").font = {
      bold: true,
      size: 14,
    };
    worksheet.addRow([]);
    worksheet.addRow(['', '', 'Start Date', startDate, '', '', 'Report Generation Date', transactionDateTime]);
    worksheet.addRow(['', '', 'End Date', endDate]);
    // worksheet.addRow(["", "", "Report Generation Date", date + " " + time]);
    worksheet.addRow([]);
    worksheet.addRow([]);

    if (json.length > 0) {
      let headerRow = worksheet.addRow(header);
      headerRow.font = {
        size: 11,
        bold: true,
      };
      headerRow.eachCell((cell, number) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
      json.forEach((ele, i) => {
        let eachRow = [i + 1,  ele.firstName,
          ele.lastName,
          ele.signupMethod,
          ele.phone,
          ele.customerId,
          ele.email,
          ele.creationDate,
          ele.status,
          
         ];
       
        let row = worksheet.addRow(eachRow);
        row.eachCell((cell, number) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          cell.alignment = { horizontal: "right", vertical: "top" };
        });
      });
    }

    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: EXCEL_TYPE });
      FileSaver.saveAs(blob, excelFileName + "_" + date + EXCEL_EXTENSION);
    });
  }
}