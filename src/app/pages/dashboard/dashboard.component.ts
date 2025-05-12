import { Component } from '@angular/core';
import { AppComponent } from '../../app.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService, private appComp: AppComponent, private snackBar: MatSnackBar,) {
    this.appComp.userLoggedIn = true;
  }
}
