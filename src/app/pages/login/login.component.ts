import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppComponent } from '../../app.component';
import { MatSpinner } from '@angular/material/progress-spinner';
import { WidthType } from 'docx';
import { doubleDecryptAES, doubleEncryptAES } from '../../utils/crypto.utils'; // Adjust path as needed


@Component({
  selector: 'app-login',
  standalone: true,

  imports: [MatSpinner, AppComponent, RouterModule, CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="login-container" [class.loading]="isLoading">
  <div class="login-card">
    <div class="logo-container">
   <svg width="400" height="100" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="textGradient" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" style="stop-color:rgb(74,144,226); stop-opacity:1" />
            <stop offset="64%" style="stop-color:rgb(164,78,182); stop-opacity:1" />
        </linearGradient>
    </defs>

    <text x="50%" y="50%" font-size="48" font-weight="bold" font-family="Arial, sans-serif"
          fill="url(#textGradient)" text-anchor="middle" dominant-baseline="middle">
        Keshav Rathi
    </text>
          <line x="50%" y="90%" font-size="28" font-weight="bold" font-family="Arial, sans-serif"
                  fill="black" text-anchor="middle" dominant-baseline="middle">
                <tspan font-size="32" font-weight="bold" fill="purple">------------</tspan>
            </line>
            <!-- Association Text Below Line -->
            <text x="50%" y="90%" font-size="28" font-weight="bold" font-family="Arial, sans-serif"
                  fill="black" text-anchor="middle" dominant-baseline="middle">
                <tspan font-size="32" font-weight="bold" fill="purple">A</tspan>ssociation
            </text>
</svg>
    </div>
    <h2>Login</h2>
    <p>Hey, Enter your details to sign in to your account</p>
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Enter Email / Phone No</mat-label>
        <input matInput formControlName="email">
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Passcode</mat-label>
        <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
        <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
          <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
        </button>
      </mat-form-field>
      <button mat-raised-button color="primary" class="full-width" [disabled]="isLoading">Sign in</button>
    </form>
    <p>Or Sign in with</p>
 
    <p>Don't have an account? <a [routerLink]="['/signup']">Register Now</a></p>
    <p class="links">
      <a routerLink="/change-password">Forgot Password?</a>
    </p>
  </div>

  <!-- Loader Overlay -->
  <div class="overlay" *ngIf="isLoading">
    <mat-spinner diameter="50"></mat-spinner>
  </div>
</div>

  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color:rgb(189, 142, 142);
      position: relative;
    }
    .login-card {
      padding: 2rem;
      text-align: center;
      width: 400px;
      border-radius: 10px;
      background: white;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    .full-width {
      width: 100%;
      margin-top: 1rem;
    }
    .social-login button {
      margin: 0.5rem;
    }
    .logo-container {
      margin-bottom: 1rem;
    }
        .links {
      margin-top: 1rem;
    }

    .links a {
      text-decoration: none;
      color: #1976d2;
      font-weight: bold;
    }
  .overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}
  `]
})
export class LoginComponent {
  hidePassword: boolean = true;
  isLoading: boolean = false; // Loader state
  loginForm: FormGroup;
  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService, private appComp: AppComponent, private snackBar: MatSnackBar,) {
    this.loginForm = this.fb.group({
      email: ['snehasoni1234@gmail.com', [Validators.required, Validators.email]],
      password: ['Arit@123', [Validators.required, Validators.minLength(6)]]
    });
    this.appComp.userLoggedIn = false;
  }
onSubmit(): void {
  this.isLoading = true;

  if (this.loginForm.valid) {
    this.authService.getAccess().subscribe({
      next: (accessRes) => {
        // Save access token in session storage
        sessionStorage.setItem('accessToken', accessRes.token);

        // Encrypt login data
        const encryptedLoginData = doubleEncryptAES(JSON.stringify(this.loginForm.value));

        // Call login API with Authorization header
        this.authService.login({ data: encryptedLoginData }).subscribe({
          next: (response) => {
            setTimeout(() => {
              debugger
              this.isLoading = false;
              const decrypted = JSON.parse(doubleDecryptAES(response.data));
              localStorage.setItem('token', decrypted.token);
              localStorage.setItem('loggedInUser', decrypted.username);
              this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
              this.appComp.userLoggedIn = true;
              this.router.navigate(['/company']);
            }, 2000);
          },
          error: (err) => {
            this.isLoading = false;
            this.snackBar.open('Login failed: ' + err.error?.error, 'Close', { duration: 3000 });
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open('Access failed: ' + err.error?.error, 'Close', { duration: 3000 });
      }
    });
  }
}

}
// <div class="social-login">
// <button mat-button><mat-icon>google</mat-icon> Google</button>
// <button mat-button><mat-icon>apple</mat-icon> Apple ID</button>
// <button mat-button><mat-icon>facebook</mat-icon> Facebook</button>
// </div>