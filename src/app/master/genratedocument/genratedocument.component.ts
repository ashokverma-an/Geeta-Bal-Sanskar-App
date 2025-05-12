import { MatDialogModule } from '@angular/material/dialog';
import { Component, Inject, inject, Input, input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { InputsAppearanceService } from '../masterappearance.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatError, MatFormField, MatLabel, MatSelect, MatSelectModule, MatSuffix } from '@angular/material/select';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { SectionComponent } from '../../section/section.component';
import { WordGeneratorService } from '../../word-generator.service';
import { DirectorService } from '../../services/director.service';
import { CompanyService } from '../../services/company.service';

@Component({
  providers: [provideNativeDateAdapter()],
  selector: 'app-genratedocument',
  imports: [CommonModule, MatFormFieldModule, SectionComponent,
    MatLabel,
    MatSelect,
    MatOptionModule,
    MatInput,
    MatError,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormField,
    MatLabel,
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerInput,
    MatSuffix,
    MatSelectModule],
  templateUrl: './genratedocument.component.html',
  styleUrl: './genratedocument.component.scss'
})
export class GenratedocumentComponent {
  @Input() companyId!: number;
  companyData: any;
  companyList: any[] = [];
  companyformDataArray: any[] = [];
  maxDate: Date = new Date(); // Setting max date to today
  directors: any[] = []; // Example director list
  documentNames: string[] = ['DIR-3', 'DIR-2', 'DIR-8', 'LOA', 'MBP-1', "NOC-Certificate", "MOA"];
  bttnvalue = "submit";
  isEditMode = false;
  initialFormData: any;
  formDataArray: any[] = [];
  appearance = inject(InputsAppearanceService).appearance;
  directorForm: FormGroup;
  genderOptions = ['Male', 'Female'];
  editIndex: number | null = null
  constructor(private directorService: DirectorService, private companyService: CompanyService,
    private fb: FormBuilder, private snackBar: MatSnackBar, private route: ActivatedRoute,
    private router: Router, private wordService: WordGeneratorService
  ) {
    this.directorForm = this.fb.group({
      documentType: ['', Validators.required], // Add document type control
      selectedDirector: [null, Validators.required],
      todate: ['', Validators.required],
      selectedCompany: [null, Validators.required],
    });
  }
  generateWord() {
     
    const documentform = this.directorForm?.value;
    let directerdata: any[] = [];
    const storedData = this.directors;
    if (storedData) {
      const parsedData = storedData;
      directerdata = parsedData.map((dir: any) => {
        const fullName = `${dir.firstName.trim()} ${dir.MiddleName ? dir.MiddleName.trim() + ' ' : ''}${dir.LastName.trim()}`.trim();
        return {
          ...dir,
          fullName
        };
      });
      directerdata = directerdata.filter((dir: any) => dir.directorId === documentform.selectedDirector);
    } else {
      directerdata = [];
    }
    let Companydata: any[] = [];
    const storedCompanies = this.companyList;
    if (storedCompanies) {
      this.companyformDataArray = storedCompanies;
      Companydata = this.companyformDataArray.filter((company: any) =>
        company.companyId === documentform.selectedCompany
      );
    } else {
      this.companyformDataArray = [];
      Companydata = [];
    }
    const selectedDocument = this.directorForm.get('documentType')?.value;
    if (selectedDocument == "DIR-2") {
      const formData = directerdata.map((director: any) => {
        const directorFullName = `${director.firstName.trim()} ${director.MiddleName ? director.MiddleName.trim() + ' ' : ''}${director.LastName.trim()}`;
        const company = Companydata[0];
        return {
          name: directorFullName,
          din: director.dinNO || "N/A",
          fatherName: `${director.ffirstName.trim()} ${director.fMiddleName ? director.fMiddleName.trim() + ' ' : ''}${director.fLastName.trim()}`,
          address: director.permanentaddress || "N/A",
          email: director.email || "N/A",
          mobile: director.mobile || "N/A",
          pan: director.pancard || "N/A",
          companyName: company ? company.companyName : "Not Assigned",
          place: director.district || "N/A",
          state: director.state,
          pincode: director.pincode,
          Occupation: director.occupationtype,
          dbo: director.dob,
          nationality: director.nationality,
          date: new Date(documentform.todate).toLocaleDateString('en-GB')
        };
      });
      this.wordService.generateWordFile(formData[0], selectedDocument);
    } else if (selectedDocument == "DIR-8") {
      const selectedDirector = directerdata.length > 0 ? directerdata[0] : null;
      const selectedCompany = Companydata.length > 0 ? Companydata[0] : null;
      if (selectedDirector && selectedCompany) {
        const data = {
          companyName: selectedCompany.companyName || "Not Assigned",
          companyAddress: selectedCompany.registeredOfficeAddress
            ? `${selectedCompany.registeredOfficeAddress}, ${selectedCompany.city}-${selectedCompany.postalCode}, ${selectedCompany.state}`
            : "Not Available",
          directorName: `${selectedDirector.firstName.trim()} ${selectedDirector.MiddleName ? selectedDirector.MiddleName.trim() + ' ' : ''}${selectedDirector.LastName.trim()}`,
          husbandName: selectedDirector.fatherName || "Not Available", // Assuming fatherName is stored
          directorAddress: selectedDirector.address || "Not Available",
          date: new Date().toLocaleDateString("en-GB"),
          nominalCapital: selectedCompany.authorizedCapital || "Not Available",
          paidUpCapital: selectedCompany.paidUpCapital || "Not Available",
          companies: directerdata[0].directors.map((company: any) => ({
            name: company.companyName,
            appointmentDate: company.startingDate ? new Date(company.startingDate).toLocaleDateString("en-GB") : "Not Available",
            cessationDate: company.endDate ? new Date(company.endDate).toLocaleDateString("en-GB") : "",
          })),
        };

        this.wordService.generateWordFile(data, selectedDocument);
      }
    } else if (selectedDocument == "LOA") {
      // Data variables
      const data = {
        name: "Vinod Purohit",
        date: "09-12-2024",
        place: "Jodhpur",
        firmName: "Keshav Rathi & Associates",
        authorityPerson: "Keshav Rathi",
        location: "ROC/CRC",
      };
      this.wordService.generateWordFile(data, selectedDocument);


    } else if (selectedDocument == "MBP-1") {
      const tableData = [
        ["S.No", "Description", "Rate (%)", "Amount", "Tax", "Total Amount"],
        ["1", "Service 1", "18%", "12,000", "2,160", "14,160"],
        ["2", "Service 2", "18%", "15,000", "2,700", "17,700"],
        ["3", "Service 3", "18%", "10,000", "1,800", "11,800"],
      ];
      this.wordService.generateWordFile(tableData, selectedDocument);

    } else if (selectedDocument == "NOC-Certificate") {
      const tableData = [
        ["S.No", "Description", "Rate (%)", "Amount", "Tax", "Total Amount"],
        ["1", "Service 1", "18%", "12,000", "2,160", "14,160"],
        ["2", "Service 2", "18%", "15,000", "2,700", "17,700"],
        ["3", "Service 3", "18%", "10,000", "1,800", "11,800"],
      ];
      this.wordService.generateWordFile(tableData, selectedDocument);

    } else if (selectedDocument == "MOA") {
      const tableData = [
        ["S.No", "Description", "Rate (%)", "Amount", "Tax", "Total Amount"],
        ["1", "Service 1", "18%", "12,000", "2,160", "14,160"],
        ["2", "Service 2", "18%", "15,000", "2,700", "17,700"],
        ["3", "Service 3", "18%", "10,000", "1,800", "11,800"],
      ];
      this.wordService.generateWordFile(tableData, selectedDocument);

    } else if (selectedDocument == "DIR-3") {

    }
  }

  preventKeyPress(event: KeyboardEvent) {
    event.preventDefault();
  }
  ngOnInit(): void {
     
    this.loadCompanyData();


  }

  onSubmit() {
    this.generateWord();
  }

  fetchDrectorList(companyId: any) {
    this.directorService.getAllDirectorsBasedonCompany(companyId).subscribe({
      next: (data) => {
        this.formDataArray = data;
        this.directors = this.formDataArray.map((item: any, index: number) => ({
          position: index + 1,
          fullName: `${item.firstName.trim()} ${item.MiddleName ? item.MiddleName.trim() + ' ' : ''}${item.LastName.trim()}`.trim(),
          ...item,
        }));
      },
      error: (err) => {
        console.error('⚠️ No records found for directors.', err);
      }
    });
  }
  loadCompanyData() {
    this.companyService.getCompanyList().subscribe({
      next: (data) => {
        if (data && data.error) {
          this.snackBar.open(data.error, 'Close', { duration: 3000 });
        } else {
           
          this.companyList = data.map((item: any, index: number) => ({
            position: index + 1,
            ...item,
          }));
     
          if(this.companyId){
            this.fetchDrectorList(this.companyId);
            this.directorForm.get('selectedCompany')?.setValue(this.companyId);
            this.directorForm.get('selectedCompany')?.disable();
            
          }
        }
      },
      error: (err) => {
        this.snackBar.open('Not Found Comapnies Please Add First.', 'Close', { duration: 3000 });
      },
    });
  }
  onReset(){
    this.directorForm.reset();
  }
  

}
