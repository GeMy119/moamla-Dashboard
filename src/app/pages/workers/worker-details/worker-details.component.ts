import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { WorkerService } from '../../../services/worker.service';
import { FamilyVisaService } from '../../../services/family-visa.service';
import { Worker } from '../../../models/worker.model.ts';
import { FamilyVisa } from '../../../models/family-visa.model.ts';

@Component({
  selector: 'app-worker-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './worker-details.component.html',
})
export class WorkerDetailsComponent implements OnInit {
  worker: Worker | null = null;
  isLoading = false;
  errorMessage = '';
  activeTab: 'alerts' | 'profession_changes' | 'family_visas' | 'moamla_type' = 'family_visas';
  isDeletingAlert = false;
  isDeletingProfessionChange = false;

  familyVisas: FamilyVisa[] = [];
  isLoadingFamilyVisas = false;
  familyVisasErrorMessage = '';
  isDeletingVisa: string | null = null;

  moamlaTypesErrorMessage = '';
  isDeletingMoamlaType: string | null = null;

  constructor(
    private workerService: WorkerService,
    private familyVisaService: FamilyVisaService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loadWorker(id);
  }

  loadWorker(id: string) {
    this.isLoading = true;
    this.workerService.getById(id).subscribe({
      next: (res) => {
        this.worker = res.data;
        this.isLoading = false;
        this.loadFamilyVisas(id);
      },
      error: () => {
        this.errorMessage = 'حدث خطأ أثناء جلب البيانات';
        this.isLoading = false;
      },
    });
  }

  loadFamilyVisas(workerId: string) {
    this.isLoadingFamilyVisas = true;
    this.familyVisasErrorMessage = '';
    this.familyVisaService.getAll({ worker_id: workerId }).subscribe({
      next: (res) => {
        console.log('Family Visas:', res.data); // Debugging line
        this.familyVisas = res.data;
        this.isLoadingFamilyVisas = false;
      },
      error: () => {
        this.familyVisasErrorMessage = 'حدث خطأ أثناء جلب التأشيرات العائلية';
        this.isLoadingFamilyVisas = false;
      },
    });
  }

  setTab(tab: 'alerts' | 'profession_changes' | 'family_visas' | 'moamla_type') {
    this.activeTab = tab;
  }

  getEmployerName() {
    return typeof this.worker?.employer_id === 'object' ? this.worker.employer_id.name : '-';
  }

  getAlertStatusLabel(status?: string) {
    return status === 'accepted' ? 'مقبول' : 'مرفوض';
  }

  getAlertStatusClass(status?: string) {
    return status === 'accepted'
      ? 'bg-green-50 text-green-700 border border-green-200'
      : 'bg-red-50 text-red-700 border border-red-200';
  }

  getPurposeLabel(purpose: string) {
    return purpose === 'familyVisit' ? 'زيارة عائلية' : 'استقدام';
  }
  getStatusLablel(status: string) {
    if (status === 'pending') return 'قيد الانتظار';
    if (status === 'approved') return 'تمت الموافقة';
    if (status === 'rejected') return 'تم الرفض';
    return status;
  }
  deleteAlert() {
    if (!this.worker?._id) return;
    if (!confirm('هل أنت متأكد من حذف البلاغ؟')) return;

    this.isDeletingAlert = true;
    this.workerService.deleteAlert(this.worker._id).subscribe({
      next: () => {
        if (this.worker) this.worker.alerts = undefined;
        this.isDeletingAlert = false;
      },
      error: () => {
        this.errorMessage = 'حدث خطأ أثناء حذف البلاغ';
        this.isDeletingAlert = false;
      },
    });
  }

  deleteProfessionChange() {
    if (!this.worker?._id) return;
    if (!confirm('هل أنت متأكد من حذف تغيير المهنة؟')) return;

    this.isDeletingProfessionChange = true;
    this.workerService.deleteProfessionChange(this.worker._id).subscribe({
      next: () => {
        if (this.worker) this.worker.profession_changes = undefined;
        this.isDeletingProfessionChange = false;
      },
      error: () => {
        this.errorMessage = 'حدث خطأ أثناء حذف تغيير المهنة';
        this.isDeletingProfessionChange = false;
      },
    });
  }

  deleteFamilyVisa(visaId: string) {
    if (!confirm('هل أنت متأكد من حذف هذه التأشيرة؟')) return;

    this.isDeletingVisa = visaId;
    this.familyVisaService.delete(visaId).subscribe({
      next: () => {
        this.familyVisas = this.familyVisas.filter((v) => v._id !== visaId);
        this.isDeletingVisa = null;
      },
      error: () => {
        this.familyVisasErrorMessage = 'حدث خطأ أثناء الحذف';
        this.isDeletingVisa = null;
      },
    });
  }

  deleteMoamlaType(moamlaId?: string) {
    if (!this.worker?._id || !moamlaId) return;
    if (!confirm('هل أنت متأكد من حذف نوع المعاملة؟')) return;

    this.isDeletingMoamlaType = moamlaId;
    this.workerService.deleteMoamlaType(this.worker._id, moamlaId).subscribe({
      next: () => {
        if (this.worker?.moamla_type) {
          this.worker.moamla_type = this.worker.moamla_type.filter((m) => m._id !== moamlaId);
        }
        this.isDeletingMoamlaType = null;
      },
      error: () => {
        this.moamlaTypesErrorMessage = 'حدث خطأ أثناء حذف نوع المعاملة';
        this.isDeletingMoamlaType = null;
      },
    });
  }

  goBack() {
    this.router.navigate(['/workers']);
  }
}