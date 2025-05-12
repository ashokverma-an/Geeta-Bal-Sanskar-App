import { Component, Inject } from "@angular/core";
import { ThemeToggleComponent } from "../theme/theme-toggle.component";
import { NgOptimizedImage } from "@angular/common";
import { Router } from "@angular/router";

@Component({
    selector: "app-navbar",
    template: `
    <nav>
      <app-theme-toggle />
       <div class="greeting-container">
    <h2>Hello, <span class="user-name">{{ userName }}</span></h2>
  </div>


  <button mat-raised-button (click)="logout()" class="logout-button">
    Logout
  </button>
    </nav>
  `,
    styles: `
    nav {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title {
        display: flex;
        align-items: center;
        gap: 0.55rem;

        span {
          font-weight: 500;
        }
      }
    }
      /* Default Light Theme */
    .light-theme {
      background-color:rgb(140, 23, 23);
      color: #000;
    }

    /* Dark Theme */
    .dark-theme {
      background-color: #333;
      color: #fff;
    }

    :host {
      width: 100%;
    }
      .logout-button {
     background-color:rgb(140, 23, 23);
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.logout-button:hover {
     background-color:rgb(140, 23, 23);
      color: #000;
}
      .greeting-container {
  display: flex;
  align-items: center;
}

h2 {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
}

.user-name {
  text-transform: capitalize; /* Capitalize first letters */
  font-size: 16px; /* Slightly larger font size for the name */
}
  `,
    imports: [ThemeToggleComponent, NgOptimizedImage]
})
export class NavbarComponent {

  userName: string | null= localStorage.getItem('loggedInUser'); // Example user name
  
  constructor(private router: Router) {}

  logout() {
    // Clear local storage/session/token/etc.
    localStorage.clear();
    
    // Navigate to the login page after logout
    this.router.navigate(['/login']);
  }
}
