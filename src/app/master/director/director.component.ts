import { Component, inject, ViewChild, viewChild } from "@angular/core";
import { SectionComponent } from "../../section/section.component";
import { InputsAppearanceService } from "../masterappearance.service";
import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule, provideNativeDateAdapter } from "@angular/material/core";
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog'
import {MatInputModule} from '@angular/material/input';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
import { DirectorEntryComponent } from "./director-entry/director-entry.component";
import {MatFormFieldModule} from '@angular/material/form-field';
import { Router } from "@angular/router";
import { MatIcon } from "@angular/material/icon";
import { DirectorHistoryDialogComponent } from "./director-history-dialog/director-history-dialog.component";
import { DirectorService } from "../../services/director.service";
@Component({
  selector: 'app-director',
  providers: [provideNativeDateAdapter()],
  imports: [SectionComponent,MatIcon,
    MatOptionModule,
    MatButtonModule,
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
  templateUrl: './director.component.html',
  styleUrl: './director.component.scss',
  standalone: true
})
export class DirectorComponent {
  clickTimeout: any = null;
  formDataArray:any[]=[];
  displayedColumns: string[] = ['position','dinNo', 'name','fatherName', 'gender', 'dob', 'age','occupation', 'pancard', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  selectedRowIndex: number | null = null;

  editIndex: number | null = null

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  constructor(private directorService: DirectorService,private snackBar: MatSnackBar,private dialog: MatDialog, private router: Router) {
  
  }
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.loadFormData();
  }

  handleKeyDown(event: KeyboardEvent, row: any, rowIndex: number) {
    event.preventDefault();
    const totalRows = this.dataSource.data.length;;
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
    } else if (event.ctrlKey && event.key.toLowerCase() === 'v') {
      this.viewRow(row.position);
    } else if (event.ctrlKey && event.key.toLowerCase() === 'e') {
      this.editRow(row);
    } else if (event.ctrlKey && event.key.toLowerCase() === 'd') {
      this.deleteRow(row.position);
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
     
    this.router.navigate(['/director-details'], { 
      state: { 
        title: 'Director History', 
        data: rowData 
      } 
    });
  }
  navigateTo(data: any = null,flag: string = ''): void {
     
    if (data) {
      this.router.navigate(['/director/registrastion'], { state: { data,flag } });
    } else {
      this.router.navigate(['/director/registrastion']);
    }
  }
  navigateToDocument(data:string){
      if(data=="Director"){
        this.router.navigate(['/document-genaration']);
      }

  }
  loadFormData(): void {
    this.directorService.getAllDirectors().subscribe({
      next: (data) => {
        this.formDataArray = data;
        this.dataSource.data = this.formDataArray.map((item: any, index: number) => ({
          position: index + 1,
          ...item
        }));
      
        console.log('✅ Fetched data from API:', this.dataSource.data);
      },
      error: (err) => {
        console.error('⚠️ No records found for directors.', err);
      }
    });
  }
  getAge(dob: string | Date): number {
    if (!dob) return 0; // Handle empty or null values
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
  
    // Adjust age if the birthday hasn't occurred this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  
 

  editRow(data: any) {    
    this.navigateTo(data);
  }
  viewRow(position: number): void {
    const formDataArray = JSON.parse(localStorage.getItem('DirectorformDataArray') || '[]');
    
    if (formDataArray.length === 0) {
        console.error('No data found in local storage.');
        return;
    }

    if (position < 1 || position > formDataArray.length) {
        console.error('Invalid position:', position);
        return;
    }

    const dataToEdit = formDataArray[position - 1];
    const flag = 'View';

    this.navigateTo(dataToEdit, flag);
}
 deleteRow(id: string): void {
   
  this.directorService.deleteDirector(id).subscribe(
    (response) => {
      this.snackBar.open('Director deleted successfully', 'Close', { duration: 3000 });
      this.loadFormData();
    },
    (error) => {
      console.error('⚠️ Error deleting director:', error);
      this.snackBar.open('Error deleting director', 'Close', { duration: 3000 });
    }
  );
}
  // deleteRow(position: number) {
  //   let formDataArray = JSON.parse(localStorage.getItem('DirectorformDataArray') || '[]');
  //   let logArray = JSON.parse(localStorage.getItem('DirectorLogArray') || '[]');
  //   const currentDate = new Date();
  //   const deletedRecord = formDataArray.splice(position - 1, 1)[0];
  //   logArray.push({
  //     action: 'delete',
  //     date: currentDate,
  //     user: 'User',
  //     details: `Deleted record: ${JSON.stringify(deletedRecord)}`
  //   });

  //   localStorage.setItem('DirectorformDataArray', JSON.stringify(formDataArray));
  //   localStorage.setItem('DirectorLogArray', JSON.stringify(logArray));
  //   this.loadFormData();
  // }
 
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  generateLog() {
    this.directorService.fetchDirectorLogs().subscribe(
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
  
  
  
}




