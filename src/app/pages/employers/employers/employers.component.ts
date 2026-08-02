import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { EmployerService } from '../../../services/employer.service.ts.service';
import { Employer, PaginationMeta } from '../../../models/employer.model.ts';

@Component({
  selector: 'app-employers',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './employers.component.html',
})
export class EmployersComponent implements OnInit {
  employers: Employer[] = [];
  pagination: PaginationMeta = { total: 0, page: 1, pages: 1, limit: 10 };
  isLoading = false;
  isDeleting: string | null = null;
  errorMessage = '';

  constructor(private employerService: EmployerService, private router: Router) { }

  ngOnInit() {
    this.loadEmployers();
  }

  loadEmployers(page: number = 1) {
    this.isLoading = true;
    this.errorMessage = '';

    this.employerService.getAll(page, this.pagination.limit).subscribe({
      next: (res) => {
        this.employers = res.data;
        this.pagination = res.pagination;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'حدث خطأ أثناء جلب البيانات';
        this.isLoading = false;
      },
    });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.pagination.pages) return;
    this.loadEmployers(page);
  }

  deleteEmployer(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا الكفيل؟')) return;
    this.isDeleting = id;

    this.employerService.delete(id).subscribe({
      next: () => {
        this.employers = this.employers.filter((e) => e._id !== id);
        this.isDeleting = null;
        this.pagination.total--;
      },
      error: () => {
        this.isDeleting = null;
        alert('حدث خطأ أثناء الحذف');
      },
    });
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.pagination.pages }, (_, i) => i + 1);
  }
}