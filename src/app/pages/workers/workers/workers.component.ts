import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WorkerService } from '../../../services/worker.service';
import { Worker } from '../../../models/worker.model.ts';


@Component({
  selector: 'app-workers',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './workers.component.html',
})
export class WorkersComponent implements OnInit {
  workers: Worker[] = [];
  isLoading = false;
  errorMessage = '';
  isDeleting: string | null = null;

  filters = {
    nationality: '',
    profession: '',
    iqama_status: '',
  };

  pagination = { page: 1, limit: 10, total: 0, pages: 0 };

  constructor(private workerService: WorkerService) { }

  ngOnInit() {
    this.loadWorkers();
  }

  loadWorkers() {
    this.isLoading = true;
    this.errorMessage = '';

    const params: any = {
      page: this.pagination.page,
      limit: this.pagination.limit,
    };
    if (this.filters.nationality) params.nationality = this.filters.nationality;
    if (this.filters.profession) params.profession = this.filters.profession;
    if (this.filters.iqama_status) params.iqama_status = this.filters.iqama_status;

    this.workerService.getAll(params).subscribe({
      next: (res) => {
        this.workers = res.data;
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
    this.loadWorkers();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.pagination.pages) return;
    this.pagination.page = page;
    this.loadWorkers();
  }

  getPagesArray() {
    return Array.from({ length: this.pagination.pages }, (_, i) => i + 1);
  }

  getEmployerName(worker: Worker) {
    return typeof worker.employer_id === 'object' ? worker.employer_id.name : '-';
  }

  deleteWorker(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا العامل؟')) return;

    this.isDeleting = id;
    this.workerService.delete(id).subscribe({
      next: () => {
        this.workers = this.workers.filter((w) => w._id !== id);
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