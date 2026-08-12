import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkerService } from '../../../services/worker.service';
import { Worker, EmployerRef, MoamlaType, WorkerResponse } from '../../../models/worker.model.ts';

@Component({
  selector: 'app-moamla-type-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './moamla-type-form.component.html',
  styleUrl: './moamla-type-form.component.css',
})
export class MoamlaTypeFormComponent implements OnInit {
  workerId = '';
  moamlaId = '';
  selectedWorkerId = '';
  selectedWorker: Worker | null = null;

  isEditMode = false;
  isLoading = false;
  isFetching = false;
  errorMessage = '';

  workersList: Worker[] = [];

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
      this.fetchWorkerDetails(this.workerId);
    } else {
      this.loadWorkers();
    }
  }

  // جلب قائمة العمال في حال عدم وجود workerId في الرابط
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

  // جلب بيانات العامل المحدَّد وتعبئة بيانات المعاملة في حالة التعديل
  fetchWorkerDetails(workerId: string) {
    this.isFetching = true;
    this.workerService.getById(workerId).subscribe({
      next: (res: WorkerResponse) => {
        const worker: Worker = res.data || res;
        if (worker) {
          this.selectedWorker = worker;

          if (this.isEditMode) {
            const moamla = worker.moamla_type?.find(
              (r: MoamlaType) => r._id === this.moamlaId
            );
            if (moamla) {
              this.formData = {
                name: moamla.name,
                status: moamla.status,
              };
            } else {
              this.errorMessage = 'نوع المعاملة غير موجودة';
            }
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

  // عند اختيار عامل من القائمة المنسدلة
  onWorkerChange() {
    if (this.selectedWorkerId) {
      this.selectedWorker = this.workersList.find(w => w._id === this.selectedWorkerId) || null;
    } else {
      this.selectedWorker = null;
    }
  }

  // دالة مساعدة لاستخراج اسم الكفيل بأمان
  getEmployerName(): string {
    if (this.selectedWorker?.employer_id && typeof this.selectedWorker.employer_id === 'object') {
      return (this.selectedWorker.employer_id as EmployerRef).name || '—';
    }
    return '—';
  }

  // دالة مساعدة لاستخراج رقم هوية الكفيل بأمان
  getEmployerIdentity(): string {
    if (this.selectedWorker?.employer_id && typeof this.selectedWorker.employer_id === 'object') {
      return (this.selectedWorker.employer_id as EmployerRef).identity_number || '—';
    }
    return '—';
  }

  onSubmit() {
    const targetWorkerId = this.selectedWorkerId || this.workerId;

    if (!targetWorkerId) {
      this.errorMessage = 'يرجى اختيار العامل أولاً';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

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