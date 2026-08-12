import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VisitService } from '../../../services/visits.service';
import { Visit } from '../../../models/visits.model.ts';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-visas',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe],
  templateUrl: './visits.component.html',
})
export class VisitsComponent implements OnInit {
  visits: Visit[] = [];
  isLoading = false;
  errorMessage = '';
  isDeleting: string | null = null;

  filters = { nationality: '', typeOfVisa: '' };
  pagination = { page: 1, limit: 10, total: 0, pages: 0 };

  constructor(private visitService: VisitService) { }

  ngOnInit() {
    this.loadVisits();
  }

  loadVisits() {
    this.isLoading = true;
    this.errorMessage = '';

    const params: any = { page: this.pagination.page, limit: this.pagination.limit };
    if (this.filters.nationality) params.nationality = this.filters.nationality;
    if (this.filters.typeOfVisa) params.typeOfVisa = this.filters.typeOfVisa;

    this.visitService.getAll(params).subscribe({
      next: (res) => {
        this.visits = res.data;
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
    this.loadVisits();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.pagination.pages) return;
    this.pagination.page = page;
    this.loadVisits();
  }

  getPagesArray() {
    return Array.from({ length: this.pagination.pages }, (_, i) => i + 1);
  }

  deleteVisit(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذه التأشيرة؟')) return;

    this.isDeleting = id;
    this.visitService.delete(id).subscribe({
      next: () => {
        this.visits = this.visits.filter((v) => v._id !== id);
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