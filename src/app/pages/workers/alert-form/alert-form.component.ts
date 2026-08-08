import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkerService } from '../../../services/worker.service';
import { Alert, Worker } from '../../../models/worker.model.ts';

@Component({
  selector: 'app-alert-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alert-form.component.html',
})

export class AlertFormComponent implements OnInit {
  workerIdFromUrl: string | null = null;
  selectedWorkerId = '';
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
      // 🔹 تم الفتح من صفحة عامل محدد
      this.selectedWorkerId = this.workerIdFromUrl;
      if (this.isEditMode) {
        this.fetchAlert();
      }
    } else {
      // 🔹 تم الفتح من الناف بار مباشرة -> جلب قائمة العمال
      this.loadWorkers();
    }
  }

  // جلب قائمة العمال للـ Dropdown
  loadWorkers() {
    this.isFetching = true;
    this.workerService.getAll({ page: 1, limit: 1000 }).subscribe({
      next: (res: any) => {
        this.workersList = res.data || res.workers || res;
        this.isFetching = false;
      },
      error: () => {
        this.errorMessage = 'حدث خطأ أثناء جلب قائمة العمال';
        this.isFetching = false;
      },
    });
  }

  // عند اختيار عامل من القائمة
  onWorkerChange() {
    if (this.selectedWorkerId) {
      this.fetchAlert();
    }
  }

  // جلب بلاغات العامل لتحديد حالة التعديل أو الإضافة تلقائياً
  fetchAlert() {
    if (!this.selectedWorkerId) return;

    this.isFetching = true;
    this.workerService.getById(this.selectedWorkerId).subscribe({
      next: (res: any) => {
        const worker = res.data || res;
        if (worker && worker.alerts) {
          this.isEditMode = true;
          this.formData = { ...worker.alerts };
        } else {
          this.isEditMode = false;
          this.resetForm();
        }
        this.isFetching = false;
      },
      error: () => {
        this.errorMessage = 'حدث خطأ أثناء جلب البيانات';
        this.isFetching = false;
      },
    });
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