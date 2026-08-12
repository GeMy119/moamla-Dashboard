import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployerService } from '../../../services/employer.service.ts.service';
import { Employer, ticket } from '../../../models/employer.model.ts';

@Component({
  selector: 'app-ticket-visa-review-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ticket-visa-review-form.component.html',
})
export class TicketVisaReviewFormComponent implements OnInit {
  employerIdFromUrl: string | null = null;
  selectedEmployerId = '';
  selectedEmployer!: Employer; // تخزين كائن الكفيل المختار لإظهار بياناته

  reviewId = '';
  isEditMode = false;
  isLoading = false;
  isFetching = false;
  errorMessage = '';

  employersList: Employer[] = [];

  formData: ticket = {
    nationality: '',
    profession: '',
    arrival_port: '',
    count: 0,
  };

  constructor(
    private employerService: EmployerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.employerIdFromUrl = this.route.snapshot.params['id'];
    this.reviewId = this.route.snapshot.params['reviewId'];
    this.isEditMode = !!this.reviewId;

    if (this.employerIdFromUrl) {
      // 🔹 تم الفتح من صفحة كفيل محدد
      this.selectedEmployerId = this.employerIdFromUrl;
      this.checkEditModeAndLoadData(this.selectedEmployerId);
      if (this.isEditMode) {
        this.fetchReview();
      }
    } else {
      // 🔹 تم الفتح من الناف بار مباشرة -> جلب قائمة الكفلاء
      this.loadEmployers();
    }
  }

  // جلب الكفلاء للقائمة المنسدلة
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

  // لجلب عنصر المراجعة في حالة التعديل
  fetchReview() {
    if (!this.selectedEmployerId) return;

    this.isFetching = true;
    this.employerService.getById(this.selectedEmployerId).subscribe({
      next: (res: any) => {
        const employer = res.data || res;
        const review = employer.ticket_visa_review?.find(
          (r: any) => r._id === this.reviewId
        );
        if (review) {
          this.formData = {
            nationality: review.nationality,
            profession: review.profession,
            arrival_port: review.arrival_port,
            count: review.count || 0,
          };
        } else {
          this.errorMessage = 'المراجعة غير موجودة';
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
    if (!this.selectedEmployerId) {
      this.errorMessage = 'يرجى اختيار الكفيل أولاً';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const request$ = this.isEditMode
      ? this.employerService.updateTicket(
        this.selectedEmployerId,
        this.reviewId,
        this.formData
      )
      : this.employerService.addTicket(this.selectedEmployerId, this.formData);

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

  checkEditModeAndLoadData(employerId: string): void {
    this.isFetching = true;
    this.errorMessage = '';

    this.employerService.getById(employerId).subscribe({
      next: (res: any) => {
        const employer = res.data || res;
        this.selectedEmployer = employer; // 🔹 تخزين بيانات الكفيل لطباعتها أعلى الفورم

        if (employer && employer.ticket_visa_review && employer.ticket_visa_review.status) {
          this.isEditMode = true;
          this.formData = { ...employer.ticket_visa_review };
        } else {
          // إعادة ضبط نموذج الإضافة في حال اختيار كفيل آخر ليس لديه تصريح
          this.isEditMode = false;
        }
        this.isFetching = false;
      },
      error: (err) => {
        this.errorMessage = 'حدث خطأ في جلب بيانات الكفيل';
        this.isFetching = false;
      }
    });
  }

  // التعامل مع اختيار كفيل من Dropdown
  onEmployerChange(): void {
    if (this.selectedEmployerId) {
      this.checkEditModeAndLoadData(this.selectedEmployerId);
    }
    if (this.employerIdFromUrl) {
      this.checkEditModeAndLoadData(this.employerIdFromUrl);
    }
  }
}