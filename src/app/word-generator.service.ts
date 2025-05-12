import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import {
  Document, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, Packer, BorderStyle, PageBreak,
  IRunOptions,
  TabStopType
} from "docx";
import { writeFileAsync } from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class WordGeneratorService {

  constructor() { }

  generateWordFile(data: any, flag: string): void {
 
    if (flag == "DIR-8") {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              // FORM DIR-8 Title
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "FORM DIR-8", bold: true, size: 56 }), // 28 * 2
                  new TextRun({ text: "\n[Intimation by Director]", bold: true, size: 48 }), // 24 * 2
                  new TextRun({
                    text: "\n[Pursuant to Section 164(2) and rule 14(1) of Companies (Appointment and Qualification of Directors) Rules, 2014]",
                    size: 40, // 20 * 2
                  }),
                ],
                spacing: { after: 200 },
              }),

              // Registration Details
              new Paragraph({ children: [new TextRun({ text: `Registration No. of Company ${data.nominalCapital}`, size: 44 })] }),
              new Paragraph({ children: [new TextRun({ text: `Nominal Capital ${data.nominalCapital}`, size: 44 })] }),
              new Paragraph({ children: [new TextRun({ text: `Paid-up Capital ${data.paidUpCapital}`, size: 44 })] }),
              new Paragraph({ children: [new TextRun({ text: `Name of Company- ${data.companyName}`, size: 44 })] }),
              new Paragraph({
                children: [new TextRun({ text: `Address of its Registered Office: ${data.companyAddress}`, size: 44 })],
                spacing: { after: 200 },
              }),

              // Addressed to Board of Directors
              new Paragraph({ children: [new TextRun({ text: "To", size: 44 })] }),
              new Paragraph({ children: [new TextRun({ text: "The Board of Directors of", size: 44 })] }),
              new Paragraph({
                children: [new TextRun({ text: data.companyName, size: 44 })],
                spacing: { after: 200 },
              }),

              // Declaration
              new Paragraph({
                children: [
                  new TextRun({ text: `I ${data.directorName} wife of Mr. ${data.husbandName}, resident of ${data.directorAddress},`, size: 44 }),
                  new TextRun({
                    text: ` Rajasthan, director/managing director/manager in the company hereby give notice that I am/was a director in the following companies during the last three years:-`,
                    size: 44,
                  }),
                ],
                spacing: { after: 200 },
              }),

              // Table of Companies
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "S. No.", bold: true })] })], width: { size: 10, type: WidthType.PERCENTAGE } }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Name of the Company", bold: true })] })], width: { size: 50, type: WidthType.PERCENTAGE } }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Date of Appointment", bold: true })] })], width: { size: 20, type: WidthType.PERCENTAGE } }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Date of Cessation", bold: true })] })], width: { size: 20, type: WidthType.PERCENTAGE } }),
                    ],
                  }),
                  ...data.companies.map((company: any, index: number) =>
                    new TableRow({
                      children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: (index + 1).toString() })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: company.name })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: company.appointmentDate })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: company.cessationDate || "-" })] })] }),
                      ],
                    })
                  ),
                ],
              }),

              // Confirmation Statement
              new Paragraph({
                children: [
                  new TextRun({
                    text: `I further confirm that I have not incurred disqualification under section 164(2) of the Companies Act, 2013 in any of the above companies, in the previous financial year, and that I, at present, stand free from any disqualification from being a director.`,
                    size: 44,
                  }),
                ],
                spacing: { before: 200, after: 200 },
              }),

              // Date and Signature
              new Paragraph({ children: [new TextRun({ text: `Dated this ${data.date}`, size: 44 })], spacing: { after: 100 } }),
              new Paragraph({
                children: [new TextRun({ text: data.directorName, bold: true, size: 48 })],
                spacing: { before: 200 },
              }),
            ],
          },
        ],
      });
      // Generate and Save Word File
      Packer.toBlob(doc).then(blob => {
        saveAs(blob, "FORM_DIR-8.docx");
      });
    }
    else if (flag == "DIR-2") {
       
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
            properties: {},
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [

                  new TextRun({

                    text: "FORM DIR-2",
                    bold: true,
                    size: 24,
                  })
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "Consent to act as a Director of a Company",
                    size: 24,
                    bold: true,

                  })
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                text: "[Pursuant to section 152(5) and rule 8 of Companies (Appointment and Qualification of Directors) Rules, 2014]", spacing: { after: 200 }
              }),
              new Paragraph({ text: "To,", spacing: { before: 200 } }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${data.companyName}`,
                    bold: true,
                  })
                ]
              }),
              new Paragraph({ text: "(Proposed to be incorporated)"}),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Subject: Consent to act as a Director",
                    bold: true
                  })
                ],
                spacing: { before: 200, after: 200 }
              }),
              new Paragraph({
                children: [
                  new TextRun("I, "),
                  new TextRun({
                    text: data.name,
                    bold: true
                  }),
                  new TextRun(", hereby give my consent to act as director of "),
                  new TextRun({
                    text: data.companyName,
                    bold: true
                  }),
                  new TextRun(" pursuant to sub-section (5) of section 152 of the Companies Act, 2013 and certify that I am not disqualified to become a director under the Companies Act, 2013:")
                ]
              }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  this.createTableRow("Director Identification Number (DIN)", `${data.din}`),
                  this.createTableRow("Name (in full)", `${data.name}`),
                  this.createTableRow("Father's Name (in full)", `${data.fatherName}`),
                  this.createTableRow("Address", `${data.address},${data.place}-${data.pincode}, ${data.state}`),
                  this.createTableRow("E-mail id", `${data.email}`),
                  this.createTableRow("Mobile no.",`${data.mobile}`),
                  this.createTableRow("Income-tax PAN", `${data.pancard}`),
                  this.createTableRow("Occupation", `${data.Occupation}`),
                  this.createTableRow("Date of Birth", `${data.dbo}`),
                  this.createTableRow("Nationality",`${data.nationality}`),
                  this.createTableRow("No. of companies in which I am already a Director", "Director in 10 Companies out of which Managing Director in one company i.e. Patrimony Credevelopers Private Limited"),
                  this.createTableRow("Particulars of membership No. and Certificate of practice No.", "Nil"),
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Declaration",
                    bold: true
                  })
                ],
                spacing: { before: 200 }
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "I declare that I have not been convicted of any offence in connection with the promotion, formation or management of any company or LLP and have not been found guilty of any fraud or misfeasance or of any breach of duty to any company under this Act or any previous company law in the last five years. I further declare that if appointed my total Directorship in all the companies shall not exceed the prescribed number of companies in which a person can be appointed as a Director.",
                  })
                ]
              }),
              new Paragraph({
                spacing: { before: 200 },
                children: [
                  new TextRun({
                    
                    text: "I further declare that I am not required to obtain the security clearance from the Ministry of Home Affairs, Government of India before seeking appointment as director.",
                  })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `Place: ${data.place}` }),
                  new TextRun({ text: `\tSignature: ________` }),
                ],
                tabStops: [
                  {
                    type: TabStopType.LEFT,
                    position: 6500, // Adjust for spacing between elements
                  },
                ],
                spacing: { before: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `\tDate: ${data.dbo}` }),
                  new TextRun({ text: "\tDesignation: Director" }),
                ],
                tabStops: [
                  {
                    type: TabStopType.LEFT,
                    position: 6500, // Adjust for spacing between elements
                  },
                ],
              }),
              
                           
              new Paragraph({ text: "Attached:", spacing: { before: 200 } }),
              new Paragraph({ text: "1. Proof of Identity" }),
              new Paragraph({ text: "2. Proof of Residence" })
            ]
          }
        ]
      });

      Packer.toBlob(doc).then(blob => {
        saveAs(blob, "Director_Consent_Form.docx");
      }).catch(error => {
        console.error("Error generating document:", error);
      });
    } else if (flag == "LOA") {
      // Creating the document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              // Title
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "LETTER OF AUTHORITY", bold: true, size: 56 }), // 28 * 2
                  new TextRun({ text: "\nTO WHOM SO EVER IT MAY CONCERN", bold: true, size: 48 }), // 24 * 2
                ],
                spacing: { after: 300 },
              }),

              // Content
              new Paragraph({
                children: [
                  new TextRun({
                    text: `I, hereby authorize and give complete authority to ${data.firmName}, Practicing Company Secretaries and/or ${data.authorityPerson} and/or any person authorized by him, jointly or severally, to use our electronic signature and/or digital signature for the purpose of signing all the documents for the ${data.location} including but not restricted to documents, attachments, and relevant e-forms. `,
                    size: 44,
                  }),
                ],
                spacing: { after: 200 },
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: `They are authorized to do all acts and take all such steps as may be necessary, proper, expedient, or desirable and to sign, affix, or use my electronic signature and/or Digital Signature to execute all necessary documents, applications, and returns for the aforesaid purpose.`,
                    size: 44,
                  }),
                ],
                spacing: { after: 200 },
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: `Any act carried out by the aforesaid person/persons/firm on our behalf shall have the same effect as acts of our own. This authority shall be continued until revoked by me.`,
                    size: 44,
                  }),
                ],
                spacing: { after: 300 },
              }),

              // Signature Details
              new Paragraph({ children: [new TextRun({ text: data.name, bold: true, size: 48 })], spacing: { before: 200 } }),
              new Paragraph({ children: [new TextRun({ text: `Date: ${data.date}`, size: 44 })] }),
              new Paragraph({ children: [new TextRun({ text: `Place: ${data.place}`, size: 44 })] }),
            ],
          },
        ],
      });

      Packer.toBlob(doc).then(blob => {
        saveAs(blob, "Letter_of_Authority.docx");
      });
    } else if (flag === "MBP-1") {
      const selectedDateStr = data[0].date;
      const selectedDate = new Date(selectedDateStr);

      if (!selectedDate || isNaN(selectedDate.getTime())) {
        console.error('Invalid or missing date');
        return;
      }

      // Filter and map your dynamic data
      const filteredData = data
        .filter((entry: any) => new Date(entry.endDate) <= selectedDate)
        .map((entry: any, index: any) => [
          (index + 1).toString(),
          entry.companyName || '',
          entry.role || entry.natureOfInterest || '',
          `${entry.shareholdingRupees?.toLocaleString()} (${entry.shareholding}%)`,
          new Date(entry.date).toLocaleDateString() // use the added `date` field
        ]);

      // Add header row
      const tableData = [
        ["S. No", "Names of Companies / Firms", "Nature of Interest", "Shareholding (₹)", "Date of Change"],
        ...filteredData
      ];

      const tableRows = tableData.map((row, index) =>
        new TableRow({
          children: row.map((cell: any, i: number) =>
            new TableCell({
              children: [
                new Paragraph({
                  text: cell,
                  alignment: i === 0 ? AlignmentType.CENTER : AlignmentType.LEFT,
                  children: index === 0
                    ? [new TextRun({ text: cell, bold: true })]
                    : [new TextRun(cell)],
                }),
              ],
              width: { size: 20, type: WidthType.PERCENTAGE },
            })
          ),
        })
      );

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "Notice of Interest by Director",
                    bold: true,
                    size: 32,
                  }),
                ],
                spacing: { after: 200 },
              }),

              new Paragraph({
                text: "To,\nVinris Solar Energy Private Limited,\n(Proposed to be incorporated)",
                spacing: { after: 200 },
              }),

              new Paragraph({
                text:
                  "Dear Sir,\n\nI, Vinod Purohit, s/o of Devi Singh Purohit, resident of Opp. Central School 112, Abhaya Garh Scheme, Jodhpur-342001, Rajasthan, being a proposed director in the proposed company, hereby give notice of my interest or concern in the following company or firms.",
                spacing: { after: 200 },
              }),

              new Table({
                rows: tableRows,
                width: { size: 100, type: WidthType.PERCENTAGE },
                margins: { top: 100, bottom: 100 },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 },
                  insideVertical: { style: BorderStyle.SINGLE, size: 1 },
                  insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
                },
              }),

              new Paragraph({
                text: "Signature:\nName: Vinod Purohit\nDesignation: Proposed Director",
                spacing: { before: 300 },
              }),

              new Paragraph({
                text: `Date: ${new Date().toLocaleDateString()}\nPlace: Jodhpur`,
                spacing: { before: 200 },
              }),
            ],
          },
        ],
      });

      Packer.toBlob(doc).then(blob => {
        saveAs(blob, "MBP-1.docx");
      });
    }
    else if (flag == "NOC-Certificate") {
      // Create the document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              // Title: NO OBJECTION CERTIFICATE
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "NO OBJECTION CERTIFICATE",
                    bold: true,
                    size: 32, // Font size in half-points (32 = 16pt)
                  }),
                ],
                spacing: { after: 300 },
              }),

              // Body Content
              new Paragraph({
                children: [
                  new TextRun({ text: "I, ", size: 24 }),
                  new TextRun({ text: "Kirti Vinod", bold: true, size: 24 }),
                  new TextRun({ text: ", being the legal owner of the property situated at A-324, Shastri Nagar, Jodhpur-342001, Rajasthan, hereby provide NOC to ", size: 24 }),
                  new TextRun({ text: "VINRIS SOLAR ENERGY PRIVATE LIMITED", bold: true, size: 24 }),
                  new TextRun({ text: " to use the said property as its registered office and do hereby solemnly declare and affirm that: -", size: 24 }),
                ],
                spacing: { after: 200 },
              }),

              // Numbered List
              ...[
                "That the property is situated at A-324, Shastri Nagar, Jodhpur-342001, Rajasthan.",
                "That on the electricity bill the address has been inadvertently mentioned by the electricity municipal department as A-324, Shastri Nagar 0.",
                "That the address mentioned on the electricity bill is incomplete and the complete address of the said property is A-324, Shastri Nagar, Jodhpur-342001, Rajasthan.",
                "That being a small city it’s a general practice of not mentioning the complete address and only mentioning the locality of the address in short where it is situated on the electricity bill which is continued to be followed by the electricity department.",
                "That the address A-324, Shastri Nagar 0 as mentioned on the electricity bill or the complete address as swear by me for the said premises A-324, Shastri Nagar, Jodhpur-342001, Rajasthan is one and belongs to the same property.",
                "That it is in my knowledge that the said address is being used by VINRIS SOLAR ENERGY PRIVATE LIMITED as its registered address.",
                "That I have no objection if the VINRIS SOLAR ENERGY PRIVATE LIMITED is registered at A-324, Shastri Nagar, Jodhpur-342001, Rajasthan. I personally provide the no objection certificate to get registered the said LLP at the above address.",
              ].map((text, index) =>
                new Paragraph({
                  children: [
                    new TextRun({ text: `${index + 1}. `, bold: true, size: 24 }),
                    new TextRun({ text: text, size: 24 }),
                  ],
                  spacing: { after: 100 },
                })
              ),

              // Signature
              new Paragraph({
                children: [
                  new TextRun({ text: "KIRTI VINOD", bold: true, size: 24 }),
                ],
                spacing: { before: 300, after: 100 },
              }),

              // Date and Place
              new Paragraph({ children: [new TextRun({ text: "Date: 09-12-2024", size: 24 })], spacing: { after: 100 } }),
              new Paragraph({ children: [new TextRun({ text: "Place: Jodhpur", size: 24 })] }),
            ],
          },
        ],
      });

      Packer.toBlob(doc).then(blob => {
        saveAs(blob, "No_Objection_Certificate.docx");
      });


    } else if (flag == "MOA") {

      // Create the document
      // Dynamic Data
      const companyName = "VINRIS SOLAR ENERGY PRIVATE LIMITED";
      const personName = "Kirti Vinod";
      const address = "A-324, Shastri Nagar, Jodhpur-342001, Rajasthan";
      const date = new Date().toLocaleDateString();
      const place = "Jodhpur";

      // Create the document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              // Title: MEMORANDUM OF ASSOCIATION
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "MEMORANDUM OF ASSOCIATION",
                    bold: true,
                    size: 32,
                  }),
                ],
                spacing: { after: 300 },
              }),

              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: companyName,
                    bold: true,
                    size: 28,
                  }),
                ],
                spacing: { after: 200 },
              }),

              // Clause: Name of the Company
              new Paragraph({
                children: [
                  new TextRun({ text: `1. Name of the Company: `, bold: true, size: 24 }),
                  new TextRun({ text: companyName, size: 24 }),
                ],
                spacing: { after: 200 },
              }),

              // Clause: Registered Office
              new Paragraph({
                children: [
                  new TextRun({
                    text: "2. The Registered Office of the Company will be situated in the State of Rajasthan.",
                    size: 24,
                  }),
                ],
                spacing: { after: 200 },
              }),

              // Clause: Business Objectives
              new Paragraph({
                children: [
                  new TextRun({ text: "3. Business Objectives:", bold: true, size: 24 }),
                ],
                spacing: { after: 200 },
              }),

              ...[
                "To carry on the business of solar energy production, installation, distribution, and maintenance.",
                "To develop, manufacture, operate, and maintain power plants based on renewable energy sources.",
                "To enter into joint ventures, collaborations, and contracts for the promotion of renewable energy solutions.",
                "To acquire land, equipment, and machinery necessary for the execution of solar energy projects.",
                "To engage in training, research, and consultation in the field of renewable energy.",
              ].map((text, index) =>
                new Paragraph({
                  children: [
                    new TextRun({ text: `${index + 1}. `, bold: true, size: 24 }),
                    new TextRun({ text: text, size: 24 }),
                  ],
                  spacing: { after: 150 },
                })
              ),

              // Page Break before the next section
              new Paragraph({
                children: [new TextRun({ text: "", break: 1 })], // ✅ Correct way to insert a page break
              }),

              // Capital Clause
              new Paragraph({
                children: [
                  new TextRun({ text: "4. Share Capital Structure:", bold: true, size: 24 }),
                ],
                spacing: { after: 200 },
              }),

              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph("Share Type")], width: { size: 25, type: WidthType.PERCENTAGE } }),
                      new TableCell({ children: [new Paragraph("No. of Shares")], width: { size: 25, type: WidthType.PERCENTAGE } }),
                      new TableCell({ children: [new Paragraph("Nominal Value")], width: { size: 25, type: WidthType.PERCENTAGE } }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph("Equity Shares")], width: { size: 25, type: WidthType.PERCENTAGE } }),
                      new TableCell({ children: [new Paragraph("10,00,000")], width: { size: 25, type: WidthType.PERCENTAGE } }),
                      new TableCell({ children: [new Paragraph("₹10 each")], width: { size: 25, type: WidthType.PERCENTAGE } }),
                    ],
                  }),
                ],
              }),

              // Page Break
              new Paragraph({
                children: [new TextRun({ text: "", break: 1 })], // ✅ Another correct page break
              }),

              // Signature Section
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({ text: "Subscriber's Declaration:", bold: true, size: 24 }),
                ],
                spacing: { before: 300, after: 100 },
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: `I, ${personName}, do hereby declare that the details mentioned above are true to the best of my knowledge and belief.`,
                    size: 24,
                  }),
                ],
                spacing: { after: 200 },
              }),

              // Signature
              new Paragraph({
                children: [
                  new TextRun({ text: "Signature: ____________________", size: 24 }),
                ],
                spacing: { before: 300, after: 100 },
              }),

              new Paragraph({
                children: [new TextRun({ text: `Date: ${date}`, size: 24 })],
                spacing: { after: 100 },
              }),
              new Paragraph({
                children: [new TextRun({ text: `Place: ${place}`, size: 24 })],
              }),
            ],
          },
        ],
      });
      // Save document
      Packer.toBlob(doc).then(blob => {
        saveAs(blob, "Memorandum_of_Association.docx");
      });
    }


  }
  private createTableRow(label: string, value: string): TableRow {
    return new TableRow({
      children: [
        new TableCell({ children: [new Paragraph(label)], width: { size: 50, type: WidthType.PERCENTAGE } }),
        new TableCell({ children: [new Paragraph(value ?? "N/A")] })
      ]
    });
  }
}
