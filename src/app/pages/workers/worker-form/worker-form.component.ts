import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkerService } from '../../../services/worker.service';
import { CreateWorkerDto } from '../../../models/worker.model.ts';
import { EmployerService } from '../../../services/employer.service.ts.service';


@Component({
  selector: 'app-worker-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './worker-form.component.html',
})
export class WorkerFormComponent implements OnInit {
  isEditMode = false;
  workerId = '';
  employerId = '';
  isLoading = false;
  isFetching = false;
  errorMessage = '';

  employersList: any[] = [];

  formData: CreateWorkerDto = {
    employer_id: '',
    name: '',
    identity_number: '',
    nationality: '',
    profession: '',
    address: '',
    account_number: '',
    iqama_number: '',
    iqama_expiry_date: '',
    iqama_status: '',
    iqama_issue_date: '',
  };

  constructor(
    private workerService: WorkerService,
    private employerService: EmployerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.employerId = this.route.snapshot.params['employerId'];
    this.workerId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.workerId;

    if (this.isEditMode) {
      this.fetchWorker();
    } else if (this.employerId) {
      this.formData.employer_id = this.employerId;
    } else {
      // 🔹 في حالة الإضافة المباشرة بدون كفيل في الرابط -> جلب قائمة الكفلاء
      this.loadEmployers();
    }
  }

  loadEmployers() {
    this.isFetching = true;
    this.employerService.getAll(1, 1000).subscribe({
      next: (res: any) => {
        this.employersList = res.data || res.employers || res;
        this.isFetching = false;
      },
      error: () => {
        this.errorMessage = 'حدث خطأ أثناء جلب قائمة الكفلاء';
        this.isFetching = false;
      },
    });
  }

  fetchWorker() {
    this.isFetching = true;
    this.workerService.getById(this.workerId).subscribe({
      next: (res) => {
        const w = res.data;
        const targetEmployerId = typeof w.employer_id === 'object' ? w.employer_id._id : w.employer_id;

        this.formData = {
          employer_id: targetEmployerId,
          name: w.name,
          identity_number: w.identity_number,
          nationality: w.nationality,
          profession: w.profession,
          address: w.address,
          account_number: w.account_number,
          iqama_number: w.iqama_number,
          iqama_expiry_date: w.iqama_expiry_date ? w.iqama_expiry_date.split('T')[0] : '',
          iqama_status: w.iqama_status,
          iqama_issue_date: w.iqama_issue_date ? w.iqama_issue_date.split('T')[0] : '',
        };
        this.isFetching = false;
      },
      error: () => {
        this.errorMessage = 'حدث خطأ أثناء جلب البيانات';
        this.isFetching = false;
      },
    });
  }

  onSubmit() {
    if (!this.formData.employer_id) {
      this.errorMessage = 'يرجى اختيار الكفيل أولاً';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const request$ = this.isEditMode
      ? this.workerService.update(this.workerId, this.formData)
      : this.workerService.create(this.formData);

    request$.subscribe({
      next: (res) => {
        this.isLoading = false;
        const targetId = this.isEditMode ? this.workerId : res.data._id;
        this.router.navigate(['/workers', targetId]);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'حدث خطأ، حاول مرة أخرى';
      },
    });
  }

  goBack() {
    if (this.employerId) {
      this.router.navigate(['/employers', this.employerId]);
    } else {
      this.router.navigate(['/workers']);
    }
  }
}