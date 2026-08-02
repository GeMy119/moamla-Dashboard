import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FamilyVisaService } from '../../../services/family-visa.service';
import { WorkerService } from '../../../services/worker.service';
import { CreateFamilyVisaDto } from '../../../models/family-visa.model.ts';

@Component({
  selector: 'app-family-visa-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './family-visa-form.component.html',
})
export class FamilyVisaFormComponent implements OnInit {
  visaId = '';
  workerIdFromUrl = '';
  isEditMode = false;
  isLoading = false;
  isFetching = false;
  errorMessage = '';

  workersList: any[] = [];

  formData: CreateFamilyVisaDto = {
    worker_id: '',
    visitor_name: '',
    relation: '',
    nationality: '',
    purpose: 'familyVisit',
    duration_days: 90,
    validity_days: undefined,
    arrival_from: '',
    status: 'pending',
    releaseDate: '',
    age: 0
  };

  constructor(
    private familyVisaService: FamilyVisaService,
    private workerService: WorkerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.workerIdFromUrl = this.route.snapshot.params['workerId'];
    this.visaId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.visaId;

    if (this.isEditMode) {
      // 🔹 وضع التعديل
      this.fetchVisa();
    } else if (this.workerIdFromUrl) {
      // 🔹 وضع الإضافة من صفحة عامل محدد
      this.formData.worker_id = this.workerIdFromUrl;
    } else {
      // 🔹 وضع الإضافة المباشرة من الناف بار -> جلب قائمة العمال
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

  fetchVisa() {
    this.isFetching = true;
    this.familyVisaService.getById(this.visaId).subscribe({
      next: (res) => {
        const v = res.data;
        const targetWorkerId = typeof v.worker_id === 'object' ? v.worker_id._id : v.worker_id;

        this.formData = {
          worker_id: targetWorkerId,
          visitor_name: v.visitor_name,
          relation: v.relation,
          nationality: v.nationality,
          purpose: v.purpose,
          duration_days: v.duration_days,
          validity_days: v.validity_days,
          arrival_from: v.arrival_from,
          status: v.status,
          releaseDate: v.releaseDate,
          age: v.age
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
    if (!this.formData.worker_id) {
      this.errorMessage = 'يرجى اختيار العامل أولاً';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const request$ = this.isEditMode
      ? this.familyVisaService.update(this.visaId, this.formData)
      : this.familyVisaService.create(this.formData);

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
    if (this.formData.worker_id) {
      this.router.navigate(['/workers', this.formData.worker_id]);
    } else {
      window.history.back();
    }
  }
}