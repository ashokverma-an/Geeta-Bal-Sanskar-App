import { Routes } from "@angular/router";
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login',   loadComponent: () =>
    import("./pages/login/login.component").then(
      (m) => m.LoginComponent
    ),},
  { path: 'signup', loadComponent: () => import("./pages/signup/signup.component").then(
    (m) => m.SignupComponent
  ),},
  { path: 'change-password', loadComponent: () => import("./pages/change-password/change-password.component").then(
    (m) => m.ChangePasswordComponent
  ) },
  { path: 'dashboard', loadComponent: () => import("./pages/dashboard/dashboard.component").then(
    (m) => m.DashboardComponent
  ) },
  {
    path: "button",
    loadComponent: () => import("./button/button-page.component"),
  },

  
  {
    path: "card",
    loadComponent: () => import("./card/card-page.component"),
  },
  {
    path: "director",
    loadComponent: () =>
      import("./master/director/director.component").then(
        (m) => m.DirectorComponent
      ),
  },
  {
    path: "document-genaration",
    loadComponent: () =>
      import("./master/genratedocument/genratedocument.component").then(
        (m) => m.GenratedocumentComponent
      ),
  },
  {
    path: "director-details",
    loadComponent: () =>
      import("./master/director/director-history-dialog/director-history-dialog.component").then(
        (m) => m.DirectorHistoryDialogComponent
      ),
  },
  {
    path: "director-history",
    loadComponent: () =>
      import("./master/director/historyentry/historyentry.component").then(
        (m) => m.HistoryentryComponent
      ),
  },
 
  {
    path: "director/registrastion",
    loadComponent: () =>
      import("./master/director/director-entry/director-entry.component").then(
        (m) => m.DirectorEntryComponent
      ),
  },
 
  {
    path: "company",
    loadComponent: () =>
      import("./master/company/company.component").then(
        (m) => m.CompanyComponent
      ),
  },
  {
    path: "company/registration",
    loadComponent: () =>
    import("./master/company/company-entry/company-entry.component").then(
      (m) => m.CompanyEntryComponent
    ),
  },
 
  {
    path: "company-capital-entry",
    loadComponent: () =>
      import("./master/company/capital-entry/capital-entry.component").then(
        (m) => m.CapitalEntryComponent
      ),
  },
  {
    path: "company-detail",
    loadComponent: () =>
      import("./master/company/companydetail/companydetail.component").then(
        (m) => m.CompanydetailComponent
      ),
  },
   {
    path: "auditor",
    loadComponent: () =>
    import("./master/auditor/auditor.component").then(
      (m) => m.AuditorComponent
    ),
  },
  {
    path: "resolution",
    loadComponent: () =>
    import("./master/resolution/resolution.component").then(
      (m) => m.ResolutionComponent
    ),
  },
  {
    path: "notice",
    loadComponent: () =>
    import("./master/notices/notices.component").then(
      (m) => m.NoticesComponent
    ),
  },
  {
    path: "documents",
    loadComponent: () =>
    import("./master/documents/documents.component").then(
      (m) => m.DocumentsComponent
    ),
  },
    {
    path: "card",
    loadComponent: () => import("./card/card-page.component"),
  },
  {
    path: "text-field",
    loadComponent: () => import("./input/input-page.component"),
  },
  {
    path: "datepicker",
    loadComponent: () => import("./date-picker/date-picker-page.component"),
  },
  {
    path: "chip",
    loadComponent: () => import("./chip/chip-page.component"),
  },
  {
    path: "table",
    loadComponent: () => import("./table/table-page.component"),
  },
  {
    path: "dialog",
    loadComponent: () => import("./dialog/dialog-page.component"),
  },
  {
    path: "menu",
    loadComponent: () => import("./menu/menu-page.component"),
  },
  {
    path: "bottom-sheet",
    loadComponent: () => import("./bottom-sheet/bottom-sheet-page.component"),
  },
  {
    path: "badge",
    loadComponent: () => import("./badge/badge-page.component"),
  },
  {
    path: "tab",
    loadComponent: () => import("./tab/tab-page.component"),
  },
  {
    path: "snackbar",
    loadComponent: () => import("./snackbar/snackbar-page.component"),
  },
  {
    path: "expansion-panel",
    loadComponent: () => import("./expansion-panel/expansion-panel-page.component"),
  },
];

