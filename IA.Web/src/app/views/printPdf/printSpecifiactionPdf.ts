import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-print-specification-pdf',
  template: ''
})
export class PrintSpecificationComponent implements OnInit {

  constructor() {
}

ngOnInit(){}
printDocument(content : string,pdfTitle : string) {
    setTimeout(() => {
      let popupWin;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();
      popupWin.document.write(`
<html>
<head>
<title style:"visibility: hidden">${pdfTitle}</title>
<style>
.footer {
  left: 0;
  bottom: 0;
  width: 100%;

  color: white;
  text-align: center;
}

.bg-green{

   background-color:yellowgreen !important;
}
</style>
</head>

<body onload="window.print()">
${content}
</body>
</html>`
      );
      popupWin.document.close();
    }, 100);
  }
}
