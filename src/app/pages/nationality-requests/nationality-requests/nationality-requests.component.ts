import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NationalityRequestService } from '../../../services/nationality-request.service';
import { NationalityRequest } from '../../../models/nationality-request.model.ts';

@Component({
  selector: 'app-nationality-requests',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './nationality-requests.component.html',
})
export class NationalityRequestsComponent implements OnInit {
  requests: NationalityRequest[] = [];
  isLoading = false;
  errorMessage = '';
  isDeleting: string | null = null;

  filters = { status: '', job: '' };
  pagination = { page: 1, limit: 10, total: 0, pages: 0 };

  constructor(private nationalityRequestService: NationalityRequestService) { }

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.isLoading = true;
    this.errorMessage = '';

    const params: any = { page: this.pagination.page, limit: this.pagination.limit };
    if (this.filters.status) params.status = this.filters.status;
    if (this.filters.job) params.job = this.filters.job;

    this.nationalityRequestService.getAll(params).subscribe({
      next: (res) => {
        this.requests = res.data;
        this.pagination = res.pagination;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'حدث خطأ أثناء جلب البيانات';
        this.isLoading = false;
      },
    });
  }

  applyFilters() {
    this.pagination.page = 1;
    this.loadRequests();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.pagination.pages) return;
    this.pagination.page = page;
    this.loadRequests();
  }

  getPagesArray() {
    return Array.from({ length: this.pagination.pages }, (_, i) => i + 1);
  }

  getStatusClass(status: string) {
    return status === 'تمت الموافقة'
      ? 'bg-green-50 text-green-700 border border-green-200'
      : 'bg-red-50 text-red-700 border border-red-200';
  }

  deleteRequest(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;

    this.isDeleting = id;
    this.nationalityRequestService.delete(id).subscribe({
      next: () => {
        this.requests = this.requests.filter((r) => r._id !== id);
        this.isDeleting = null;
        this.pagination.total -= 1;
      },
      error: () => {
        this.errorMessage = 'حدث خطأ أثناء الحذف';
        this.isDeleting = null;
      },
    });
  }
}