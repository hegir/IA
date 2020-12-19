import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { TranslateService } from '@ngx-translate/core';
import { DateTimeFormatPipe } from '../shared/pipes/dateTimeFormat.pipe';
import { ExcelData } from '../models/excelData';
import { Workbook } from 'exceljs';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {
    constructor(private translateService: TranslateService, private dateTimeFormatPipe: DateTimeFormatPipe) { }

    public exportAsExcelFile(json: any[], excelFileName: string): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        var range = XLSX.utils.decode_range(worksheet['!ref']);
        for (var C = 0; C <= range.e.c; ++C) {
            var address = XLSX.utils.encode_col(C) + "1";
            worksheet[address].v = this.translateService.instant(worksheet[address].v.toUpperCase());
        }

        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_' + this.translateService.instant('CREATED') + '_' + this.dateTimeFormatPipe.transform(new Date().toString(), 'dd-MM-yyyy HH:mm') + EXCEL_EXTENSION);
    }

    public createExcelWorkbook(excelData: ExcelData): Workbook {
        let cellStart = 'A';

        let counter = 0;
        excelData.headers[0].headers.forEach(h => {
            counter += h.colspan;
        });

        let cellEnd = String.fromCharCode((counter - 1) + 65);
        let startNumber = 1;
        let endNumber = 2;

        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet(excelData.worksheetName);
        if (excelData.title2 != null) {
            let companyRow = worksheet.addRow([excelData.title2]);
            companyRow.font = { name: 'Roboto', family: 6, size: 12, bold: true };
            companyRow.alignment = { horizontal: 'left' };
            companyRow.alignment = { indent : 1};
            worksheet.mergeCells(`${cellStart}${startNumber}:${cellEnd}${endNumber}`);
            startNumber = endNumber + 1;
            endNumber = startNumber + 1;
        }

        let titleRow = worksheet.addRow([excelData.title]);
        titleRow.font = { name: 'Roboto', family: 6, size: 12, bold: true }
        titleRow.alignment = { horizontal: 'left' };
        titleRow.alignment = { indent : 1};
        worksheet.mergeCells(`${cellStart}${startNumber}:${cellEnd}${endNumber}`);

        if (excelData.title3 != null) {
            startNumber = endNumber + 1;
            endNumber = startNumber + 1;
            let employeeRow = worksheet.addRow([excelData.title3]);
            employeeRow.font = { name: 'Roboto', family: 6, size: 15, bold: true };
            employeeRow.alignment = { horizontal: 'center' };
            worksheet.mergeCells(`${cellStart}5:${cellEnd}6`);
        }

        worksheet.addRow([]);

        let rowStart = 4;
        if (excelData.title2 != null)
            rowStart += 2;
        if (excelData.title3 != null)
            rowStart += 2;

        let headerRows = new Array();
        excelData.headers.forEach(header => {

            let headerData = new Array();
            let emptyRowData = new Array();
            let minRowSpan = 100;
            header.headers.forEach(h => {
                if (h.rowspan < minRowSpan)
                    minRowSpan = h.rowspan;
                headerData.push(h.title);
                emptyRowData.push('');
                if (h.colspan > 1) {
                    for (let index = 1; index < h.colspan; index++) {
                        headerData.push('');
                    }
                }
            });
            headerRows.push(worksheet.addRow(headerData));
            for (let index = 0; index < minRowSpan - 1; index++) {

                headerRows.push(worksheet.addRow(emptyRowData));
            }

        });

        counter = 0;
        excelData.headers[0].headers.forEach(h => {
            let startLetter = String.fromCharCode(counter + 65);
            let startNumber = rowStart;
            let endLetter = String.fromCharCode(counter + (h.colspan - 1) + 65);
            let endNumber = startNumber + (h.rowspan - 1);
            worksheet.mergeCells(`${startLetter}${startNumber}:${endLetter}${endNumber}`);
            counter += h.colspan;
        });

        headerRows.forEach(headerRow => {
            let row = 0;
            let header = excelData.headers[row];
            headerRow.eachCell((cell, number) => {
                cell.font = { bold: true }
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                cell.alignment = { horizontal: 'center', vertical: 'middle' }
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'aeea2e' },
                    bgColor: { argb: 'aeea2e'}
                }
            });
            row++;
        });
        let cellIndex = 0;
        for (let index = 0; index < excelData.headers[0].headers.length; index++) {
            headerRows[0].getCell(cellIndex + 1).alignment = { textRotation: excelData.headers[0].headers[index].textRotation, horizontal: 'center', vertical: 'middle' };
            cellIndex += excelData.headers[0].headers[index].colspan;
        }

        excelData.data.forEach(d => {
            let data = new Array();
            Object.values(d).forEach(value => data.push(value));

            let row = worksheet.addRow(data);
            row.eachCell((cell, number) => {
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                if (excelData.horizontalAlignment == 'center' || excelData.horizontalAlignment == 'left' || excelData.horizontalAlignment == 'right')
                    cell.alignment = { horizontal: excelData.horizontalAlignment }
            });
        });

        counter = 1;
        excelData.headers[0].headers.forEach(header => {
            if (header.colspan > 1) {
                for (let index = 0; index < header.colspan; index++) {
                    worksheet.getColumn(counter + index).width = header.width / header.colspan;
                }
            }
            else {
                worksheet.getColumn(counter).width = header.width;
            }
            counter += header.colspan;
        });
        this.createDataSheet(workbook, excelData);
        return workbook;
    }

    public saveWorkbook(workbook: Workbook, fileName: string) {
        workbook.xlsx.writeBuffer().then((data) => {
            let arrayBuffer = <ArrayBuffer>data;
            let blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            FileSaver.saveAs(blob, `${fileName}.xlsx`);
        })
    }

    private createDataSheet(workbook: Workbook, excelData: ExcelData) {
        let worksheet = workbook.addWorksheet(this.translateService.instant('DATA'));

        let counter = 0;
        excelData.headers[0].headers.forEach(h => {
            counter += h.colspan;
        });


        if (excelData.dataSheetHeaders != undefined) {
            excelData.headers = excelData.dataSheetHeaders;
        }
        let headerRows = new Array();
        excelData.headers.forEach(header => {

            let headerData = new Array();
            let emptyRowData = new Array();
            let minRowSpan = 100;
            header.headers.forEach(h => {
                if (h.rowspan < minRowSpan)
                    minRowSpan = h.rowspan;
                headerData.push(h.title);
                emptyRowData.push('');
                if (h.colspan > 1) {
                    for (let index = 1; index < h.colspan; index++) {
                        headerData.push('');
                    }
                }
            });
            headerRows.push(worksheet.addRow(headerData));
        });

        headerRows.forEach(headerRow => {
            let row = 0;
            let header = excelData.headers[row];
            headerRow.eachCell((cell, number) => {
                cell.font = { bold: true }
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                cell.alignment = { horizontal: 'center', vertical: 'middle' }
            });
            row++;
        });
        let cellIndex = 0;
        for (let index = 0; index < excelData.headers[0].headers.length; index++) {
            headerRows[0].getCell(cellIndex + 1).alignment = { textRotation: excelData.headers[0].headers[index].textRotation, horizontal: 'center', vertical: 'middle' };
            cellIndex += excelData.headers[0].headers[index].colspan;
        }

        excelData.data.forEach(d => {
            let data = new Array();
            Object.values(d).forEach(value => data.push(value));

            let row = worksheet.addRow(data);
            row.eachCell((cell, number) => {
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                cell.alignment = { horizontal: 'center' }
            });
        });

        counter = 1;
        excelData.headers[0].headers.forEach(header => {
            if (header.colspan > 1) {
                for (let index = 0; index < header.colspan; index++) {
                    worksheet.getColumn(counter + index).width = header.width / header.colspan;
                }
            }
            else {
                worksheet.getColumn(counter).width = header.width;
            }
            counter += header.colspan;
        });
    }
}
