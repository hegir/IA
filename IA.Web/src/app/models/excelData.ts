export class ExcelData{
  title: string;
  worksheetName: string;
  headers: ExcelHeaders[];
  data: any[];
  date: Date;
  title2:string;
  title3:string;
  dataSheetHeaders: ExcelHeaders[];
  horizontalAlignment: string = 'center';
  headerBackgroundColor: string = '#FFFFFF';
}
export class ExcelHeaders{
  headers: ExcelHeader[];
}
export class ExcelHeader{
  title: string;
  colspan: number = 1;
  rowspan: number = 1;
  width: number = 15;
  textRotation: number = 0;
  constructor(_title: string, _colspan: number = 1, _rowspan: number = 1, _width: number = 15, _textRotation : number = 0){
      this.title = _title;
      this.colspan = _colspan;
      this.rowspan = _rowspan;
      this.width = _width;
      this.textRotation = _textRotation;
  }
}
