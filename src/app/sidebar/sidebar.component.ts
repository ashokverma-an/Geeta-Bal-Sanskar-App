import { Component, inject } from "@angular/core";
import { MatNavList, MatListItem } from "@angular/material/list";
import { SIDEBAR_LINKS } from "./sidebar-options";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { QuicklinkDirective } from "ngx-quicklink";
import { MatSidenav } from "@angular/material/sidenav";
import { MatMenu, MatMenuModule } from "@angular/material/menu";
import { NgClass, NgFor, NgIf } from "@angular/common";
import { MatIcon } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";

@Component({
    selector: "app-sidebar",
    template: `
<mat-nav-list>
  <a mat-list-item routerLink="/home">
    <mat-icon>home</mat-icon> HOME
  </a>

  <mat-expansion-panel *ngFor="let category of menuItems" [expanded]="category.expanded">
    <mat-expansion-panel-header>
      {{ category.name }}
    </mat-expansion-panel-header>

    <ng-container *ngFor="let item of category.children">
      <a mat-list-item [routerLink]="item.href">
        {{ item.name }}
      </a>
    </ng-container>
  </mat-expansion-panel>
</mat-nav-list>


  `,
    styles: `
    .sidebar-link {
      margin-bottom: 0.35rem;
    }


mat-nav-list.mat-mdc-nav-list.mat-mdc-list-base.mdc-list {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: center;
    justify-content: space-evenly;
    gap:1px;
        min-width: 260px !important;
}
  `,
    imports: [NgClass,MatListItem,MatIcon,MatExpansionModule,NgFor, NgIf,MatNavList, MatListItem, MatMenuModule,RouterLink, RouterLinkActive,MatMenu,MatMenuModule,MatNavList, MatListItem, RouterLink, RouterLinkActive, QuicklinkDirective]
})
export class SidebarComponent {
  #sidenav = inject(MatSidenav);
  // sidebarLinks = SIDEBAR_LINKS;
  menuItems = [
    {
      name: 'CA Compute',
      expanded: true,
      children: [
        { name: 'Dashboard', href: '/smart-paste' },
        { name: 'Director', href: '/director'},
        { name: 'Company', href: '/company'},
        { name: 'Generate Document', href: '/document-genaration'},
      ]
    },
    // {
    //   name: 'Email Marketing',
    //   expanded: false,
    //   children: [
    //     { name: 'Dashboard', href: '/smart-paste' },
    //     { name: 'Campaigns', href: '/smart-textarea'},
    //     { name: 'Contacts', href: '/smart-textarea'},
    //   ]
    // },
    // {
    //   name: 'SMS Marketing',
    //   expanded: false,
    //   children: [
    //     { name: 'Dashboard', href: '/smart-paste' },
    //     { name: 'Director', href: '/smart-textarea'},
    //     { name: 'Company', href: '/smart-textarea'},
    //     { name: 'Generate Document', href: '/smart-textarea', tag: 'Preview' },
    //   ]
    // },
    
  ];
  getTagClass(tag: string) {
    return {
      'tag-preview': tag === 'Preview',
      'tag-updated': tag === 'Updated'
    };
  }
  closeSidenav() {
    if (this.#sidenav.mode === "over") {
      this.#sidenav.close();
    }
  }
}
