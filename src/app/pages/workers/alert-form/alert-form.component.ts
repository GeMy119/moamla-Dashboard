import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkerService } from '../../../services/worker.service';
import { Alert, EmployerRef, Worker, WorkerResponse } from '../../../models/worker.model.ts';

@Component({
  selector: 'app-alert-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alert-form.component.html',
})
export class AlertFormComponent implements OnInit {
  workerIdFromUrl: string | null = null;
  selectedWorkerId = '';
  selectedWorker: Worker | null = null;
  isEditMode = false;
  isLoading = false;
  isFetching = false;
  errorMessage = '';
  workersList: Worker[] = [];

  formData: Alert = {
    type: undefined,
    status: undefined,
    filed_date: '',
    resolved_date: '',
  };

  constructor(
    private workerService: WorkerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.workerIdFromUrl = this.route.snapshot.params['id'];
    this.isEditMode = this.route.snapshot.url.some((seg) => seg.path === 'edit');

    if (this.workerIdFromUrl) {
      this.selectedWorkerId = this.workerIdFromUrl;
      this.fetchAlert();
    } else {
      this.loadWorkers();
    }
  }

  loadWorkers() {
    this.isFetching = true;
    this.workerService.getAll({ page: 1, limit: 1000 }).subscribe({
      next: (res: any) => {
        this.workersList = res.data || res.workers || res;
        if (this.selectedWorkerId) {
          this.selectedWorker = this.workersList.find(w => w._id === this.selectedWorkerId) || null;
        }
        this.isFetching = false;
      },
      error: () => {
        this.errorMessage = 'حدث خطأ أثناء جلب قائمة العمال';
        this.isFetching = false;
      },
    });
  }

  onWorkerChange() {
    if (this.selectedWorkerId) {
      this.selectedWorker = this.workersList.find(w => w._id === this.selectedWorkerId) || null;
      this.fetchAlert();
    } else {
      this.selectedWorker = null;
      this.resetForm();
    }
  }

  fetchAlert() {
    if (!this.selectedWorkerId) return;

    this.isFetching = true;
    this.workerService.getById(this.selectedWorkerId).subscribe({
      next: (res: WorkerResponse) => {
        const worker: Worker = res.data || res;
        if (worker) {
          this.selectedWorker = worker;
          if (worker.alerts) {
            this.isEditMode = true;
            this.formData = { ...worker.alerts };
          } else {
            this.isEditMode = false;
            this.resetForm();
          }
        }
        this.isFetching = false;
      },
      error: () => {
        this.errorMessage = 'حدث خطأ أثناء جلب البيانات';
        this.isFetching = false;
      },
    });
  }

  // 🔹 دالة مساعدة لاستخراج اسم الكفيل بآمان وتجنب خطأ TypeScript
  getEmployerName(): string {
    if (this.selectedWorker?.employer_id && typeof this.selectedWorker.employer_id === 'object') {
      return (this.selectedWorker.employer_id as EmployerRef).name || '—';
    }
    return '—';
  }

  // 🔹 دالة مساعدة لاستخراج رقم هوية الكفيل بآمان
  getEmployerIdentity(): string {
    if (this.selectedWorker?.employer_id && typeof this.selectedWorker.employer_id === 'object') {
      return (this.selectedWorker.employer_id as EmployerRef).identity_number || '—';
    }
    return '—';
  }

  resetForm() {
    this.formData = {
      type: undefined,
      status: undefined,
      filed_date: '',
      resolved_date: '',
    };
  }

  onSubmit() {
    if (!this.selectedWorkerId) {
      this.errorMessage = 'يرجى اختيار العامل أولاً';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const request$ = this.isEditMode
      ? this.workerService.updateAlert(this.selectedWorkerId, this.formData)
      : this.workerService.addAlert(this.selectedWorkerId, this.formData);

    request$.subscribe({
      next: () => {
        this.isLoading = false;
        this.goBack();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'حدث خطأ، حاول مرة أخرى';
      },
    });
  }

  goBack() {
    window.history.back();
  }
}