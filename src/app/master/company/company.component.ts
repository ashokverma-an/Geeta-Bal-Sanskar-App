import { Component, inject, ViewChild } from "@angular/core";
import { SectionComponent } from "../../section/section.component";
import { InputsAppearanceService } from "../masterappearance.service";
import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule, provideNativeDateAdapter } from "@angular/material/core";
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';
import { RupeesPipe } from '../../rupees.pipe';
import {
  MatTable,
  MatCellDef,
  MatColumnDef,
  MatHeaderRowDef,
  MatRowDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCell,
  MatRow,
  MatTableDataSource,
  MatHeaderRow,
} from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatFormFieldModule } from '@angular/material/form-field';
import { DirectorEntryComponent } from "../director/director-entry/director-entry.component";
import { MatIcon } from "@angular/material/icon";
import { CompanyService } from "../../services/company.service";

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
  providers: [provideNativeDateAdapter()],
  imports: [MatIcon, RupeesPipe,
    SectionComponent,
    MatOptionModule,
    MatButtonModule,
    SectionComponent,
    MatTable,
    MatCellDef,
    MatColumnDef,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatHeaderRow,
    MatCell,
    MatRow,
    MatPaginator,
    CommonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  standalone: true
})
export class CompanyComponent {
  selectedRowIndex: number | null = null;
  clickTimeout: any = null;
  formDataArray: any[] = [];
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'position',
    'cin',
    'companyName',
    'registrationNumber',
    'companyType',
    'authorisedCapital',
    'paidupCapital',
    'dateOfIncorporation',
    'registeredOfficeAddress',
    'emailAddress',
    'phoneNumber',
    'actions'
  ];
  editIndex: number | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';

  constructor(private companyService: CompanyService, private snackBar: MatSnackBar, private dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    this.loadCompanyData();
  }

  navigateTo(data: any = null): void {
    if (data) {
      this.router.navigate(['/company/registration'], { state: { data } });
    } else {
      this.router.navigate(['/company/registration']);
    }
  }
  loadCompanyData() {
    this.companyService.getCompanyList().subscribe({
      next: (data) => {
          
        if (data && data.error) {
          this.snackBar.open(data.error, 'Close', { duration: 3000 });
        } else {
          this.dataSource.data = data.map((item: any, index: number) => ({
            position: index + 1,
            ...item,
          }));
          
        }
      },
      error: (err) => {
        this.snackBar.open('Not Found Comapnies Please Add First.', 'Close', { duration: 3000 });
      },
    });
  }
  editRow(position: any) {
    const dataToEdit = position;
    this.navigateTo(dataToEdit);
  }
  deleteRow(id: string): void {
       
    this.companyService.deleteCompany(id).subscribe(
      (response) => {
        if (response && response.error) {
          this.snackBar.open(response.error, 'Close', { duration: 3000 });
          this.loadCompanyData();
        } else {
          this.snackBar.open(response.message, 'Close', { duration: 3000 });
          this.loadCompanyData();
        }
      },
      (error) => {
        this.snackBar.open('Error deleting company. Please try again.', 'Close', { duration: 3000 });
      }
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  generateLog() {
     this.companyService.fetchCompanyLogs().subscribe(
       (logArray) => {
         const formattedLogArray = logArray.map((log: any) => {
           let detailsObj = {};
           try {
             detailsObj = log[0];
           } catch (error) {
             console.error("Error parsing details JSON:", error);
           }
     
           return {
             Action: log.logId,
             Date: log.changedAt,
             User: log.tableName,
             ...detailsObj          
           };
         });
 
         const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedLogArray);
         const workbook: XLSX.WorkBook = {
           Sheets: { 'Log': worksheet },
           SheetNames: ['Log']
         };
         const range = XLSX.utils.decode_range(worksheet['!ref'] || '');
         for (let C = range.s.c; C <= range.e.c; ++C) {
           const address = XLSX.utils.encode_col(C) + '1';
           if (!worksheet[address]) continue;
           worksheet[address].s = {
             font: { bold: true }
           };
         }
         const wscols = Object.keys(formattedLogArray[0]).map((key) => ({
           width: Math.max(...formattedLogArray.map((row: any) => (row[key] ? row[key].toString().length : 0))) + 2
         }));
         worksheet['!cols'] = wscols;
 
         const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
 
         this.saveAsExcelFile(excelBuffer, 'DirectorLog');
       },
       (error) => {
         console.error('Error fetching logs from API:', error);
         // this.errorMessage = 'Failed to generate log. Please try again later.';
       }
     );
   }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, fileName + '.xlsx');
  }

  navigateToDetails(element: any): void {
    this.router.navigate(['/company-details'], { state: { data: element } });
  }
  handleKeyDown(event: KeyboardEvent, row: any, rowIndex: number) {
       
    event.preventDefault();
    const totalRows = this.dataSource.data.length;
    if (event.key === 'ArrowDown') {
      if (this.selectedRowIndex === null) {
        this.selectedRowIndex = 0;
      } else if (this.selectedRowIndex < totalRows - 1) {
        this.selectedRowIndex++;
      }
    } else if (event.key === 'ArrowUp') {
      if (this.selectedRowIndex !== null && this.selectedRowIndex > 0) {
        this.selectedRowIndex--;
      }
    } else if (event.key === 'Enter' && this.selectedRowIndex !== null) {
      this.openDirectorHistoryDialog(row);
    }else if (event.ctrlKey && event.key.toLowerCase() === 'v') {
      this.viewRow(row.position);
    } else if (event.ctrlKey && event.key.toLowerCase() === 'e') {
      this.editRow(row);
    } else if (event.ctrlKey && event.key.toLowerCase() === 'd') {
      this.deleteRow(row.companyId);
    }
  }
  onRowClick(rowIndex: number, row: any) {
    if (this.selectedRowIndex === rowIndex) {
      if (this.clickTimeout) {
        clearTimeout(this.clickTimeout);
        this.clickTimeout = null;
        this.openDirectorHistoryDialog(row);
      }
    } else {
      this.selectedRowIndex = rowIndex;
    }
    this.clickTimeout = setTimeout(() => {
      this.clickTimeout = null;
    }, 300);
  }
  openDirectorHistoryDialog(rowData: any) {
      
    this.router.navigate(['/company-detail'], {
      state: {
        title: 'Cmpany Details',
        data: rowData
      }
    });
  }
  viewRow(data: any) {
    console.log();
  }
}
