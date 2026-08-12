import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkerService } from '../../../services/worker.service';
import { EmployerRef, Worker } from '../../../models/worker.model.ts';

@Component({
  selector: 'app-profession-change-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profession-change-form.component.html',
})
export class ProfessionChangeFormComponent implements OnInit {
  workerIdFromUrl = '';
  isEditMode = false;
  isLoading = false;
  isFetching = false;
  errorMessage = '';
  selectedWorkerId = '';
  selectedWorker: Worker | null = null;

  workersList: Worker[] = [];

  formData = {
    worker_id: '',
    status: 'accepted',
    change_date: '',
    new_profession: '',
  };

  constructor(
    private workerService: WorkerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.workerIdFromUrl = this.route.snapshot.params['id'] || '';
    this.isEditMode = this.route.snapshot.url.some((seg) => seg.path === 'edit');

    if (this.workerIdFromUrl) {
      this.selectedWorkerId = this.workerIdFromUrl;
      this.fetchProfessionChange();
    } else if (this.isEditMode) {
      this.selectedWorkerId = this.workerIdFromUrl;
      this.fetchProfessionChange();
    } else {
      // جلب العمال إذا تم فتح الصفحة مباشرة من الناف بار
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
      this.fetchProfessionChange();
    } else {
      this.selectedWorker = null;
      this.resetForm();
    }
  }

  fetchProfessionChange() {
    this.isFetching = true;
    this.workerService.getById(this.selectedWorkerId).subscribe({
      next: (res: any) => {
        const worker: Worker = res.data || res;

        // 🔹 تعبئة بيانات العامل لإظهار كارت التفاصيل
        this.selectedWorker = worker;

        if (worker.profession_changes) {
          // 🔹 تحويل صيغة التاريخ إلى YYYY-MM-DD لتظهر داخل input date
          let formattedDate = '';
          if (worker.profession_changes.change_date) {
            formattedDate = new Date(worker.profession_changes.change_date).toISOString().split('T')[0];
          }

          this.formData = {
            worker_id: this.selectedWorkerId || '',
            status: worker.profession_changes.status || 'accepted',
            change_date: formattedDate,
            new_profession: worker.profession,
          };
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

  onSubmit() {
    const targetWorkerId = this.formData.worker_id || this.workerIdFromUrl;

    if (!targetWorkerId) {
      this.errorMessage = 'يرجى اختيار العامل أولاً';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const payload = {
      status: this.formData.status,
      change_date: this.formData.change_date,
      new_profession: this.formData.new_profession,
    };

    const request$ = this.isEditMode
      ? this.workerService.updateProfessionChange(targetWorkerId, payload)
      : this.workerService.addProfessionChange(targetWorkerId, payload);

    request$.subscribe({
      next: () => {
        this.isLoading = false;
        this.workerIdFromUrl = targetWorkerId;
        this.goBack();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'حدث خطأ، حاول مرة أخرى';
      },
    });
  }

  getEmployerName(): string {
    if (this.selectedWorker?.employer_id && typeof this.selectedWorker.employer_id === 'object') {
      return (this.selectedWorker.employer_id as EmployerRef).name || '—';
    }
    return '—';
  }

  getEmployerIdentity(): string {
    if (this.selectedWorker?.employer_id && typeof this.selectedWorker.employer_id === 'object') {
      return (this.selectedWorker.employer_id as EmployerRef).identity_number || '—';
    }
    return '—';
  }

  goBack() {
    const targetWorkerId = this.formData.worker_id || this.workerIdFromUrl;
    if (targetWorkerId) {
      this.router.navigate(['/workers', targetWorkerId]);
    } else {
      window.history.back();
    }
  }

  resetForm() {
    this.formData = {
      worker_id: '',
      status: 'accepted',
      change_date: '',
      new_profession: '',
    };
  }
}