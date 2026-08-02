import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateEmployerDto } from '../../../models/employer.model.ts';
import { EmployerService } from '../../../services/employer.service.ts.service';

@Component({
  selector: 'app-employer-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employer-form.component.html',
})
export class EmployerFormComponent implements OnInit {
  isEditMode = false;
  employerId = '';
  isLoading = false;
  isFetching = false;
  errorMessage = '';

  formData: CreateEmployerDto = {
    name: '',
    identity_number: '',
    address: '',
    file_number: '',
    company_name: '',
    reference_number: '',
  };

  constructor(
    private employerService: EmployerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.employerId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.employerId;

    if (this.isEditMode) {
      this.fetchEmployer();
    }
  }

  fetchEmployer() {
    this.isFetching = true;
    this.employerService.getById(this.employerId).subscribe({
      next: (res) => {
        const { name, identity_number, address, file_number, company_name, reference_number } = res.data;
        this.formData = { name, identity_number, address, file_number, company_name, reference_number };
        this.isFetching = false;
      },
      error: () => {
        this.errorMessage = 'حدث خطأ أثناء جلب البيانات';
        this.isFetching = false;
      },
    });
  }

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    const request$ = this.isEditMode
      ? this.employerService.update(this.employerId, this.formData)
      : this.employerService.create(this.formData);

    request$.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/employers']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'حدث خطأ، حاول مرة أخرى';
      },
    });
  }

  goBack() {
    this.router.navigate(['/employers']);
  }
}