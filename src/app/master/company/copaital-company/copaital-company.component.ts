
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../../services/company.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RupeesPipe } from '../../../rupees.pipe';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-copaital-company',
  providers: [provideNativeDateAdapter()],
  imports: [MatRow, MatCell, MatTable,CommonModule,
    MatCellDef,
    MatColumnDef,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatHeaderRow,MatProgressSpinnerModule,RupeesPipe],
  templateUrl: './copaital-company.component.html',
  styleUrl: './copaital-company.component.scss'
})
export class CopaitalCompanyComponent {
  loading :boolean=false;
  @Input() companyData: any; 
  capitalDetails = [
    {
      type: "Authorized Capital",
      equityShare: 0.00,
      preferenceShare: 0.00,
      total: 0.00
    },
    {
      type: "Paid-up Capital",
      equityShare: 0.00,
      preferenceShare: 0.00,
      total: 0.00
    },
    {
      type: "Issued Capital",
      equityShare: 0.00,
      preferenceShare: 0.00,
      total: 0.00
    },
    {
      type: "Subscribed Capital",
      equityShare: 0.00,
      preferenceShare: 0.00,
      total: 0.00
    }
  ];

  clickTimeout: any = null;
  formDataArray: any[] = [];
  displayedColumns: string[] = ['HeadsOfCapital','ResolutionDate', 'EquetyShares',  'Total'];
  dataSource = new MatTableDataSource<any>([]);
  selectedRowIndex: number | null = null;
  constructor(        private snackBar: MatSnackBar,  private companyService: CompanyService,private router: Router, private route: ActivatedRoute, public dialog: MatDialog) { }
  ngOnInit() {
    this.fetchCapitalData();
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
    } else if (event.ctrlKey && event.key.toLowerCase() === 'v') {
    } else if (event.ctrlKey && event.key.toLowerCase() === 'e') {
    } else if (event.ctrlKey && event.key.toLowerCase() === 'd') {
    }
  }
  onRowClick(rowIndex: number, row: any) {
      this.openCapitalDialog(row,row.type);
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
  navigateTo(data: any = null, flag: string = ''): void {
    if (data) {
      this.router.navigate(['/director/registrastion'], { state: { data, flag } });
    } else {
      this.router.navigate(['/director/registrastion']);
    }
  }
  openCapitalDialog(row: any,flag: number) {
     
    flag=this.companyData.companyId;
    const data=this.companyData
    this.router.navigate(['/company-capital-entry'], { state: { row,flag,data  } });
  }
  fetchCapitalData(): void {
    this.loading = true;
    this.companyService.getLatestCapitalTypes(this.companyData.companyId).subscribe(
      (data) => {
       

          this.capitalDetails = data;
          this.dataSource.data=data;
          this.loading = false;

      },
      (error) => {
        this.snackBar.open('Error fetching company capital types.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        this.loading = false;
      }
    );
  }
  
  
}

