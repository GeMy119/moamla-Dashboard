import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Employer, MarriagePermitDto } from '../../../models/employer.model.ts';
import { EmployerService } from '../../../services/employer.service.ts.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  imports: [FormsModule, CommonModule],
  selector: 'app-marriage-permit-form',
  templateUrl: './marriage-permit-form.component.html'
})
export class MarriagePermitFormComponent implements OnInit {

  formData: MarriagePermitDto = {
    name: '',
    status: 'accepted',
    ProfessionCategory: '',
    wife_nationality: '',
    issue_date: '',
    sending_date: '',
    arrival_port: '',
    file_number: ''
  };

  isEditMode: boolean = false;
  isFetching: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  // 🔹 المتغيرات الخاصة بالربط وتخزين بيانات الكفيل
  employerIdFromUrl: string | null = null;
  selectedEmployerId: string = '';
  employersList: Employer[] = [];
  selectedEmployer!: Employer; // تخزين كائن الكفيل المختار لإظهار بياناته

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employerService: EmployerService
  ) { }

  ngOnInit(): void {
    // 1. التشييك هل يوجد employerId في رابط الـ URL
    this.employerIdFromUrl = this.route.snapshot.paramMap.get('id');

    if (this.employerIdFromUrl) {
      // تم الفتح من صفحة كفيل محدد
      this.selectedEmployerId = this.employerIdFromUrl;
      this.checkEditModeAndLoadData(this.employerIdFromUrl);
    } else {
      // تم الفتح من الناف بار -> جلب قائمة الكفلاء
      this.loadEmployers();
    }
  }

  // جلب قائمة الكفلاء للـ Dropdown
  loadEmployers(): void {
    this.isFetching = true;
    this.employerService.getAll(1, 1000).subscribe({
      next: (res) => {
        this.employersList = (res as any).data || (res as any).employers || res;
        this.isFetching = false;
      },
      error: (err) => {
        this.errorMessage = 'حدث خطأ أثناء جلب قائمة الكفلاء';
        this.isFetching = false;
      }
    });
  }

  checkEditModeAndLoadData(employerId: string): void {
    this.isFetching = true;
    this.errorMessage = '';

    this.employerService.getById(employerId).subscribe({
      next: (res: any) => {
        const employer = res.data || res;
        this.selectedEmployer = employer; // 🔹 تخزين بيانات الكفيل لطباعتها أعلى الفورم

        if (employer && employer.marriage_permit && employer.marriage_permit.status) {
          this.isEditMode = true;
          this.formData = { ...employer.marriage_permit };
        } else {
          // إعادة ضبط نموذج الإضافة في حال اختيار كفيل آخر ليس لديه تصريح
          this.isEditMode = false;
          this.resetForm();
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
  }

  resetForm(): void {
    this.formData = {
      name: '',
      status: 'accepted',
      ProfessionCategory: '',
      wife_nationality: '',
      issue_date: '',
      sending_date: '',
      arrival_port: '',
      file_number: ''
    };
  }

  onSubmit(): void {
    if (!this.selectedEmployerId) {
      this.errorMessage = 'يرجى اختيار الكفيل أولاً';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.isEditMode) {
      this.employerService.updateMarriagePermit(this.selectedEmployerId, this.formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.goBack();
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'حدث خطأ أثناء تعديل تصريح الزواج';
        }
      });
    } else {
      this.employerService.addMarriagePermit(this.selectedEmployerId, this.formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.goBack();
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'حدث خطأ أثناء إضافة تصريح الزواج';
        }
      });
    }
  }

  goBack(): void {
    window.history.back();
  }
}