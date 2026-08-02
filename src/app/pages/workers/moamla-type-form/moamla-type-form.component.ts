import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkerService } from '../../../services/worker.service';
import { MoamlaType } from '../../../models/worker.model.ts';

@Component({
  selector: 'app-moamla-type-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './moamla-type-form.component.html',
  styleUrl: './moamla-type-form.component.css',
})
export class MoamlaTypeFormComponent implements OnInit {
  workerId = '';
  moamlaId = '';
  selectedWorkerId = ''; // متغير منفصل تماماً لتحديد العامل في حال الإضافة المباشرة

  isEditMode = false;
  isLoading = false;
  isFetching = false;
  errorMessage = '';

  workersList: any[] = [];

  // بيانات المعاملة فقط (تُرسل للـ Backend)
  formData: MoamlaType = {
    name: '',
    status: undefined,
  };

  constructor(
    private workerService: WorkerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.workerId = this.route.snapshot.params['id'] || '';
    this.moamlaId = this.route.snapshot.params['moamlaId'] || '';
    this.isEditMode = !!this.moamlaId;

    if (this.workerId) {
      this.selectedWorkerId = this.workerId;
    }

    if (this.isEditMode) {
      this.fetchMoamla();
    } else if (!this.workerId) {
      this.loadWorkers();
    }
  }

  // جلب قائمة العمال في حال عدم وجود workerId في الرابط
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

  fetchMoamla() {
    this.isFetching = true;
    this.workerService.getById(this.workerId).subscribe({
      next: (res: any) => {
        const moamla = res.data?.moamla_type?.find(
          (r: any) => r._id === this.moamlaId
        );
        if (moamla) {
          this.formData = {
            name: moamla.name,
            status: moamla.status,
          };
        } else {
          this.errorMessage = 'نوع المعاملة غير موجودة';
        }
        this.isFetching = false;
      },
      error: () => {
        this.errorMessage = 'حدث خطأ أثناء جلب البيانات';
        this.isFetching = false;
      },
    });
  }

  onSubmit() {
    // تحديد العامل إما من الرابط أو من القائمة المنسدلة في الـ HTML
    const targetWorkerId = this.selectedWorkerId || this.workerId;

    if (!targetWorkerId) {
      this.errorMessage = 'يرجى اختيار العامل أولاً';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // تجهيز كائن البيانات النظيف فقط بدون خلط الحقول
    const payload: MoamlaType = {
      name: this.formData.name,
      status: this.formData.status
    };

    const request$ = this.isEditMode
      ? this.workerService.updateMoamlaType(targetWorkerId, this.moamlaId, payload)
      : this.workerService.addMoamlaType(targetWorkerId, payload);

    request$.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/workers', targetWorkerId]);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'حدث خطأ، حاول مرة أخرى';
      },
    });
  }

  goBack() {
    const targetWorkerId = this.selectedWorkerId || this.workerId;
    if (targetWorkerId) {
      this.router.navigate(['/workers', targetWorkerId]);
    } else {
      window.history.back();
    }
  }
}