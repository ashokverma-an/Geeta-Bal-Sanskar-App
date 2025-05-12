import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterModule,CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;
  loading = false;
  errorMessage: string = '';
  hidePassword: boolean = true;
  constructor(
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  // Custom validator for password strength
  passwordStrengthValidator(control: any): { [key: string]: boolean } | null {
    const password = control.value;
    if (!password) return null;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) {
      return null;
    } else {
      return { weakPassword: true };
    }
  }

  // Password match validator
  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    return group.get('password')?.value === group.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit(): void {
     
    if (this.signupForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const signupData = this.signupForm.value;

      if (this.signupForm.valid) {
        this.authService.register(this.signupForm.value).subscribe({
          next: (res) => {
            this.snackBar.open("Registeration Successfully.", "Close", {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
              panelClass: ['error-snackbar']
            });
            this.router.navigate(['/login']);
          },
          error: (err) => console.error('Error:', err)
        });
      }
    }
  }
}
