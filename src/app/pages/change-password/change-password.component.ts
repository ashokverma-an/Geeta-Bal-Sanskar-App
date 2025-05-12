import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="change-password-container">
      <h2>Change Password</h2>
      <form [formGroup]="changePasswordForm" (ngSubmit)="onSubmit()">
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Old Password</mat-label>
          <input matInput type="password" formControlName="oldPassword" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>New Password</mat-label>
          <input matInput type="password" formControlName="newPassword">
          <mat-error *ngIf="changePasswordForm.get('newPassword')?.invalid">
            Password must be at least 6 characters
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Confirm New Password</mat-label>
          <input matInput type="password" formControlName="confirmPassword">
          <mat-error *ngIf="changePasswordForm.hasError('passwordMismatch')">
            Passwords do not match
          </mat-error>
        </mat-form-field>

        <button mat-raised-button color="primary" class="full-width" type="submit" [disabled]="changePasswordForm.invalid">
          Change Password
        </button>
      </form>
    </div>
  `,
  styles: [`
    .change-password-container {
      max-width: 400px;
      margin: auto;
      padding: 2rem;
      text-align: center;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    .full-width {
      width: 100%;
      margin-top: 1rem;
    }
  `]
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.changePasswordForm = this.fb.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      console.log('Password changed:', this.changePasswordForm.value);
      alert('Password successfully changed!');
    }
  }
}
