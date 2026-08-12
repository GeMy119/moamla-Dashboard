import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkerService } from '../../../services/worker.service';
import { EmployerService } from '../../../services/employer.service.ts.service';
import { Employer } from '../../../models/employer.model.ts';
import { CreateWorkerDto } from '../../../models/worker.model.ts';

@Component({
  selector: 'app-worker-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './worker-form.component.html',
})
export class WorkerFormComponent implements OnInit {
  isEditMode = false;
  workerId = '';
  employerId = '';
  isLoading = false;
  isFetching = false;
  errorMessage = '';

  employersList: Employer[] = [];
  selectedEmployer: Employer | null = null;

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
    this.employerId = this.route.snapshot.params['employerId'] || '';
    this.workerId = this.route.snapshot.params['id'] || '';
    this.isEditMode = !!this.workerId;

    if (this.isEditMode) {
      // حالة التعديل على عامل حالي
      this.fetchWorker();
    } else if (this.employerId) {
      // حالة إضافة عامل جديد مع كفيل محدد مسبقاً في الرابط
      this.formData.employer_id = this.employerId;
      this.loadEmployerDetails(this.employerId);
    } else {
      // حالة إضافة عامل جديد بدون كفيل محدد -> جلب قائمة الكفلاء للاختيار
      this.loadEmployersList();
    }
  }

  // جلب قائمة الكفلاء للاختيار منها
  loadEmployersList() {
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

  loadEmployerDetails(empId: string) {
    if (!empId) {
      this.selectedEmployer = null;
      return;
    }

    this.employerService.getById(empId).subscribe({
      next: (res: any) => {
        this.selectedEmployer = res.data || res;
      },
      error: () => {
        this.errorMessage = 'حدث خطأ في جلب بيانات الكفيل';
      }
    });
  }

  // جلب بيانات العامل في حالة التعديل
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
          iqama_expiry_date: w.iqama_expiry_date,
          iqama_status: w.iqama_status,
          iqama_issue_date: w.iqama_issue_date,
        };

        // جلب تفاصيل الكفيل للعامل المطلوب تعديله
        if (targetEmployerId) {
          this.loadEmployerDetails(targetEmployerId);
        }

        this.isFetching = false;
      },
      error: () => {
        this.errorMessage = 'حدث خطأ أثناء جلب البيانات';
        this.isFetching = false;
      },
    });
  }

  // التعامل مع تغيير الكفيل من القائمة المنسدلة
  onEmployerChange(): void {
    if (this.formData.employer_id) {
      this.loadEmployerDetails(this.formData.employer_id);
    } else {
      this.selectedEmployer = null;
    }
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