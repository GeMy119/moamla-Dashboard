import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkerService } from '../../../services/worker.service';

@Component({
  selector: 'app-profession-change-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profession-change-form.component.html',
})
export class ProfessionChangeFormComponent implements OnInit {
  workerId = '';
  isEditMode = false;
  isLoading = false;
  isFetching = false;
  errorMessage = '';

  workersList: any[] = [];

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
    this.workerId = this.route.snapshot.params['id'] || '';
    this.isEditMode = this.route.snapshot.url.some((seg) => seg.path === 'edit');

    if (this.workerId) {
      this.formData.worker_id = this.workerId;
    }

    if (this.isEditMode) {
      this.fetchProfessionChange();
    } else if (!this.workerId) {
      // جلب العمال إذا تم فتح الصفحة مباشرة من الناف بار
      this.loadWorkers();
    }
  }

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

  fetchProfessionChange() {
    this.isFetching = true;
    this.workerService.getById(this.workerId).subscribe({
      next: (res) => {
        const pc = res.data.profession_changes;
        if (pc) {
          this.formData = {
            worker_id: this.workerId,
            status: pc.status || 'accepted',
            change_date: pc.change_date ? pc.change_date.split('T')[0] : '',
            new_profession: res.data.profession || '',
          };
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
    const targetWorkerId = this.formData.worker_id || this.workerId;

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
        this.workerId = targetWorkerId;
        this.goBack();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'حدث خطأ، حاول مرة أخرى';
      },
    });
  }

  goBack() {
    const targetWorkerId = this.formData.worker_id || this.workerId;
    if (targetWorkerId) {
      this.router.navigate(['/workers', targetWorkerId]);
    } else {
      window.history.back();
    }
  }
}