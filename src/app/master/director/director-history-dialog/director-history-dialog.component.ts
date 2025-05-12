import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, viewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatError,
  MatFormField,
  MatFormFieldModule,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { SectionComponent } from '../../../section/section.component';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatOptionModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { InputsAppearanceService } from '../../masterappearance.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WordGeneratorService } from '../../../word-generator.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CustomDateAdapter,
  MY_DATE_FORMATS,
} from '../director-entry/director-entry.component';
import moment from 'moment';
import { MatCard, MatCardModule } from '@angular/material/card';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DirectorService } from '../../../services/director.service';
import { RupeesPipe } from '../../../rupees.pipe';
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  AlignmentType,
  WidthType,
  BorderStyle,
  VerticalAlign
} from "docx";
import { saveAs } from "file-saver";
@Component({
  selector: 'app-director-history-dialog',
  standalone: true,
  providers: [
    provideNativeDateAdapter(),
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
  imports: [
    CommonModule,
    RupeesPipe,
    MatFormFieldModule,
    SectionComponent,
    MatCard,
    MatCardModule,
    MatIcon,
    MatOptionModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
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
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCard,
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerInput,
  ],
  templateUrl: './director-history-dialog.component.html',
  styleUrls: ['./director-history-dialog.component.scss'],
})
export class DirectorHistoryDialogComponent implements OnInit {
  mbpGeneration!: FormGroup;
  clickTimeout: any = null;
  formDataArray: any[] = [];
  displayedColumns: string[] = [
    'position',
    'companyName',
    'role',
    'startingDate',
    'endDate',
    'natureOfInterest',
    'shareHolding',
    'shareHoldingAmount',
    'DateOfWitchInterest',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>([]);
  selectedRowIndex: number | null = null;

  editIndex: number | null = null;
  paginator = viewChild.required<MatPaginator>(MatPaginator);
  showDirectorHostory: boolean = false;
  directorData: any;
  title: string = '';
  directorId: string | null = null;
  directorForm!: FormGroup;
  minDate = new Date(1900, 0, 1);
  maxDate = new Date(); // Set max date to today
  appearance = inject(InputsAppearanceService).appearance;

  constructor(
    private wordService: WordGeneratorService,
    private directorService: DirectorService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
     ;
    const navigation = window.history.state;
    if (navigation && navigation.data) {
      this.title = navigation.title;
      this.directorData = navigation.data;
      this.directorId = this.directorData.directorId;
      this.fetchDirectorHistoryById(this.directorId);
    }

    if (this.directorForm) {
      this.directorForm.valueChanges.subscribe(() => {
        this.validateNoOverlap(this.directors);
      });
    }
  }
  get directors(): FormArray {
    return this.directorForm.get('directors') as FormArray;
  }
  createDirectorRowWithData(data: any): FormGroup {
    return this.fb.group(
      {
        companyName: [data.companyName || ''],
        role: [data.role || ''],
        startingDate: [data.startingDate || ''],
        endDate: [data.endDate || ''],
        years: [
          { value: data.years || '', disabled: true },
          [Validators.pattern('^[0-9]+$')],
        ],
        otherRole: [data.otherRole || ''],
      },
      { validators: this.dateValidator() }
    );
  }
  onRoleChange(index: number, event: any) {
    const selectedValue = event.value;
    const directorGroup = this.directors.at(index) as FormGroup; // Cast to FormGroup

    if (selectedValue === 'Other') {
      if (!directorGroup.contains('otherRole')) {
        directorGroup.addControl(
          'otherRole',
          new FormControl('', Validators.required)
        );
      }
    } else {
      if (directorGroup.contains('otherRole')) {
        directorGroup.removeControl('otherRole');
      }
    }
  }

  addRow() {
    const lastRow = this.directors.at(this.directors.length - 1);
    if (lastRow && lastRow.invalid) {
      this.snackBar.open(
        'Please fill all required fields before adding a new row.',
        'Close',
        {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['error-snackbar'],
        }
      );
      return;
    }
    this.directors.push(this.createDirectorRow(Number(this.directorId)));
  }
  removeRow(index: number) {
    if (this.directors.length > 1) {
      this.directors.removeAt(index);
    }
  }
  createDirectorRow(directorId: number): FormGroup {
    const row = this.fb.group(
      {
        diretorId: directorId,
        companyName: [''],
        role: [''],
        startingDate: ['', [this.startDateValidator()]],
        endDate: [''],
        years: [
          { value: '', disabled: true },
          [Validators.pattern('^[0-9]+$')],
        ],
      },
      { validators: this.dateValidator() }
    );
    row
      .get('startingDate')
      ?.valueChanges.subscribe(() => this.calculateExperience(row));
    row
      .get('endDate')
      ?.valueChanges.subscribe(() => this.calculateExperience(row));

    return row;
  }
  getAge(dob: string | Date): number {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  }

  calculateExperience(row: FormGroup) {
    const startDate = row.get('startingDate')?.value;
    const endDate = row.get('endDate')?.value;

    if (startDate && endDate) {
      const start = moment(startDate);
      const end = moment(endDate);

      if (end.isBefore(start)) {
        row.get('years')?.setValue(null);
        row.get('years')?.setErrors({ invalidDate: true });
      } else {
        const experience = parseFloat(
          end.diff(start, 'years', true).toFixed(1)
        );
        row.get('years')?.setValue(experience);
        row.get('years')?.setErrors(null);
      }
    } else {
      row.get('years')?.setValue(null);
    }
  }
  startDateValidator() {
    return (control: FormControl) => {
      const today = new Date();
      const startDate = new Date(control.value);
      return startDate > today ? { startDateInvalid: true } : null;
    };
  }

  dateValidator() {
    return (group: FormGroup) => {
      const start = group.get('startingDate')?.value;
      const end = group.get('endDate')?.value;

      if (start && end) {
        const startDate = new Date(start);
        const endDate = new Date(end);

        if (endDate < startDate) {
          group.get('endDate')?.setErrors({ endDateBeforeStart: true });
        } else if (startDate.getTime() === endDate.getTime()) {
          group.get('endDate')?.setErrors({ sameDates: true });
        } else {
          group.get('endDate')?.setErrors(null);
        }
      }
      return null;
    };
  }
  validateNoOverlap(formArray: FormArray) {
    const dateRanges: { start: Date; end: Date }[] = [];

    for (let i = 0; i < formArray.controls.length; i++) {
      const group = formArray.at(i) as FormGroup;
      const start = group.get('startingDate')?.value;
      const end = group.get('endDate')?.value;

      if (start && end) {
        const startDate = new Date(start);
        const endDate = new Date(end);

        for (const range of dateRanges) {
          if (
            (startDate >= range.start && startDate <= range.end) ||
            (endDate >= range.start && endDate <= range.end) ||
            (startDate <= range.start && endDate >= range.end)
          ) {
            group.get('startingDate')?.setErrors({ overlap: true });
            group.get('endDate')?.setErrors({ overlap: true });
            return;
          }
        }

        dateRanges.push({ start: startDate, end: endDate });
      }
    }
  }

  onReset() {
    if (this.directorForm) {
      this.directorForm.reset();
    }

    this.router.navigate(['/director']);
  }
  fetchDirectorHistoryById(directorId: any) {
    this.directorService.getDirectorHistoryById(directorId).subscribe(
      (data) => {
         ;
        const allData = data;
        this.formDataArray = allData.filter(
          (item: any) => item.directorId === this.directorId
        );
        this.dataSource.data = this.formDataArray.map(
          (item: any, index: number) => ({
            position: index + 1,
            ...item,
          })
        );
        this.mbpGeneration = this.fb.group({
          documentgenrate: ['', Validators.required],
        });
      },
      (error) => {
        this.snackBar.open(
          'No data found for selected director Interest in other entities. Please add first',
          'Close',
          {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['error-snackbar'],
          }
        );
        console.error('❌ API Error:', error);
      }
    );
  }
  ngAfterViewInit(): void {
    this.dataSource!.paginator = this.paginator();
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
      // this.openDirectorHistoryDialog(row);
    } else if (event.ctrlKey && event.key.toLowerCase() === 'v') {
      // this.viewRow(row.position);
    } else if (event.ctrlKey && event.key.toLowerCase() === 'e') {
      //this.editRow(row.position);
    } else if (event.ctrlKey && event.key.toLowerCase() === 'd') {
      //this.deleteRow(row.position);
    }
  }
  onRowClick(rowIndex: number, row: any) {
    if (this.selectedRowIndex === rowIndex) {
      if (this.clickTimeout) {
        clearTimeout(this.clickTimeout);
        this.clickTimeout = null;
        // this.openDirectorHistoryDialog(row);
      }
    } else {
      this.selectedRowIndex = rowIndex;
    }
    this.clickTimeout = setTimeout(() => {
      this.clickTimeout = null;
    }, 300);
  }
  viewRow(position: number): void {
    const formDataArray = JSON.parse(
      localStorage.getItem('DirectorformDataArray') || '[]'
    );

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
     ;
    if (data) {
      this.router.navigate(['/director/registrastion'], {
        state: { data, flag },
      });
    } else {
      this.router.navigate(['/director/registrastion']);
    }
  }
  AddHistory(data: any) {
     ;
    data = this.directorId;
    if (data) {
      this.router.navigate(['/director-history'], { state: { data } });
    }
  }
  GoBack() {
    this.router.navigate(['/director']);
  }
  editRow(id: any) {
    if (id) {
      let flag = 'Edit';
      this.router.navigate(['/director-history'], { state: { id, flag } });
    }
  }
  deleteRow(id: any) {
    this.directorService.deleteDirectorHistoryById(id).subscribe(
      (data) => {
        this.snackBar.open(data.message, 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['error-snackbar'],
        });
        this.fetchDirectorHistoryById(this.directorId);
      },
      (error) => {
        this.snackBar.open('Something went wrong. Please try again.', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['error-snackbar'],
        });
        console.error('❌ API Error:', error);
      }
    );
  }
  GenerateMBP() {
    const selectedDateStr = this.mbpGeneration.get('documentgenrate')?.value;
    const selectedDate = new Date(selectedDateStr);
    if (!selectedDate || isNaN(selectedDate.getTime())) {
      console.error('Invalid or missing date');
      return;
    }
  
    const director = this.directorData;
    const filteredData = this.formDataArray
  .filter((entry: any) => new Date(entry.dateOfAlloted) <= selectedDate)
  .map((entry: any, index: number) => [
    (index + 1).toString(),
    entry.companyName || '',
    `${entry.role || ''}${entry.natureOfInterest ? ' / ' + entry.natureOfInterest : ''}`,
    `${entry.shareholding}%`,
    `₹${entry.shareholdingRupees?.toLocaleString() || '0'}`,
    new Date(entry.dateOfAlloted).toLocaleDateString()
  ]);
  
    const tableData = [
      ['S. No', 'Names of the Companies /bodies corporate/ firms/ association of individuals/Other ', 'Nature of interest or concern / Change in interest or concern ','Shareholding', 'Shareholding/Contribution (in Rupees)', 'Date on which interest or concern arose / changed '],
      ...filteredData
    ];
  
    const columnWidths = [8, 28, 22, 12, 18, 12]; // Column width percentages for each of the 6 columns

const tableRows = tableData.map((row, rowIndex) =>
  new TableRow({
    children: row.map((cellText, cellIndex) =>
      new TableCell({
        width: {
          size: columnWidths[cellIndex],
          type: WidthType.PERCENTAGE,
        },
        margins: {
          top: 100,
          bottom: 100,
          left: 100,
          right: 100,
        },
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            alignment: cellIndex === 0 ? AlignmentType.CENTER : AlignmentType.LEFT,
            children: rowIndex === 0
              ? [new TextRun({ text: cellText, bold: true })]
              : [new TextRun({ text: cellText })],
          }),
        ],
      })
    ),
  })
);

  
    const doc = new Document({
      styles: {
        default: {
          document: {
            run: {
              font: "Segoe UI",
              size: 24, 
            },
          },
        },
      },
      sections: [
        {
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "Notice of Interest by Director", bold: true, size: 24 })
              ],
              spacing: { after: 200 }
            }),
  
            new Paragraph({
              children: [
                new TextRun({ text: "To,", bold: true, size: 24 })
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Vinris Solar Energy Private Limited,", bold: true, size: 24 })
              ],
            }),
                new Paragraph({
                  children: [
                    new TextRun({ text: "(Proposed to be incorporated)", bold: true, size: 24 })
                  ],
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Dear Sir,", bold: true, size: 24 })
              ],
              spacing: { after: 200 }
            }),
            new Paragraph({
              spacing: { after: 200 },
              children: [
                new TextRun("I, "),
                new TextRun({
                  text: `${director.firstName} ${director.MiddleName || ''} ${director.LastName}`,
                  bold: true,
                }),
                new TextRun(`, s/o of ${director.ffirstName} ${director.fMiddleName || ''} ${director.fLastName}, `),
                new TextRun(`resident of ${director.permanentaddress}, being a proposed director in the proposed company hereby give notice of my interest or concern in the following company or companies, bodies corporate, firms or other association of individuals:-`),
              ],
            }),
  
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              alignment: AlignmentType.CENTER, // Center the whole table
              margins: {
                top: 200, bottom: 200, // More space around the table
              },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1 },
                bottom: { style: BorderStyle.SINGLE, size: 1 },
                left: { style: BorderStyle.SINGLE, size: 1 },
                right: { style: BorderStyle.SINGLE, size: 1 },
                insideVertical: { style: BorderStyle.SINGLE, size: 1 },
                insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
              },
              rows: tableRows
            }),
  
            new Paragraph({
              spacing: { before: 200 },
              alignment: AlignmentType.RIGHT,
              children: [new TextRun("Signature :________")],
            }),
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun("Name : "),
                new TextRun({
                  text: `${director.firstName} ${director.MiddleName || ''} ${director.LastName}`,
                  bold: true,
                  size: 24, // 12pt
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun(`Designation : ${director.Designation || 'Proposed Director'}`),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: { after: 200 },
              children: [
                new TextRun(`DIN : ${director.dinNO || '________'}`),
              ],
            }),
            
            new Paragraph({
              text: `Date: ${selectedDate.toLocaleDateString()}\n`,
            }),
            new Paragraph({
              text: `Place: ${director.district || "________"}`,
              spacing: { after: 200 }
            })
          ]
        }
      ]
    });
  
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, 'MBP-1.docx');
    });
  }
  
}
