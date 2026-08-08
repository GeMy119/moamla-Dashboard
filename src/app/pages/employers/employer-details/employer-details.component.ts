import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployerService } from '../../../services/employer.service.ts.service';
import { WorkerService } from '../../../services/worker.service';
import { Employer } from '../../../models/employer.model.ts';
import { Worker } from '../../../models/worker.model.ts';

@Component({
  selector: 'app-employer-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employer-details.component.html',
})
export class EmployerDetailsComponent implements OnInit {
  employer: Employer | null = null;
  isLoading = false;
  errorMessage = '';
  activeTab: 'workers' | 'marriage_permit' | 'ticket_visa_review' = 'workers';

  workers: Worker[] = [];
  isLoadingWorkers = false;
  workersErrorMessage = '';
  isDeletingWorker: string | null = null;

  isDeletingTicket: string | null = null;

  constructor(
    private employerService: EmployerService,
    private workerService: WorkerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loadEmployer(id);
  }

  loadEmployer(id: string) {
    this.isLoading = true;
    this.employerService.getById(id).subscribe({
      next: (res) => {
        this.employer = res.data;
        this.isLoading = false;
        // نجيب العمال بعد ما نتأكد إن الكفيل موجود
        this.loadWorkers(id);
      },
      error: () => {
        this.errorMessage = 'حدث خطأ أثناء جلب البيانات';
        this.isLoading = false;
      },
    });
  }

  loadWorkers(employerId: string) {
    this.isLoadingWorkers = true;
    this.workersErrorMessage = '';
    this.workerService.getByEmployer(employerId).subscribe({
      next: (res) => {
        this.workers = res.data;
        this.isLoadingWorkers = false;
      },
      error: () => {
        this.workersErrorMessage = 'حدث خطأ أثناء جلب العمال';
        this.isLoadingWorkers = false;
      },
    });
  }

  setTab(tab: 'workers' | 'marriage_permit' | 'ticket_visa_review') {
    this.activeTab = tab;
  }

  goBack() {
    this.router.navigate(['/employers']);
  }

  getMarriagePermitStatusLabel(status: string) {
    return status === 'accepted' ? 'تمت الموافقة' : 'تم الإلغاء';
  }

  getMarriagePermitStatusClass(status: string) {
    return status === 'accepted'
      ? 'bg-green-50 text-green-700 border border-green-200'
      : 'bg-red-50 text-red-700 border border-red-200';
  }

  getIqamaStatusClass(status?: string) {
    if (status === 'سارية' || status === 'ساريه') return 'bg-green-50 text-green-700 border border-green-200';
    if (status === 'منتهية') return 'bg-red-50 text-red-700 border border-red-200';
    return 'bg-gray-50 text-gray-700 border border-gray-200';
  }

  deleteWorker(workerId: string) {
    if (!confirm('هل أنت متأكد من حذف هذا العامل؟')) return;

    this.isDeletingWorker = workerId;
    this.workerService.delete(workerId).subscribe({
      next: () => {
        this.workers = this.workers.filter((w) => w._id !== workerId);
        this.isDeletingWorker = null;
      },
      error: () => {
        this.workersErrorMessage = 'حدث خطأ أثناء حذف العامل';
        this.isDeletingWorker = null;
      },
    });
  }

  deleteTicket(reviewId: string) {
    if (!this.employer?._id) return;
    if (!confirm('هل أنت متأكد من حذف هذه المراجعة؟')) return;

    this.isDeletingTicket = reviewId;
    this.employerService.deleteTicket(this.employer._id, reviewId).subscribe({
      next: () => {
        if (this.employer?.ticket_visa_review) {
          this.employer.ticket_visa_review = this.employer.ticket_visa_review.filter(
            (t) => t._id !== reviewId
          );
        }
        this.isDeletingTicket = null;
      },
      error: () => {
        this.errorMessage = 'حدث خطأ أثناء حذف المراجعة';
        this.isDeletingTicket = null;
      },
    });
  }
}