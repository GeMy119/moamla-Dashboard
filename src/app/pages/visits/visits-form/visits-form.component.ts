import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VisitService } from '../../../services/visits.service';
import { CreateVisitDto } from '../../../models/visits.model.ts';

@Component({
  selector: 'app-visits-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './visits-form.component.html',
})
export class VisitsFormComponent implements OnInit {
  visitId = '';
  isEditMode = false;
  isLoading = false;
  isFetching = false;
  errorMessage = '';

  selectedImage: File | null = null;
  imagePreviewUrl: string | null = null;

  formData: CreateVisitDto = {
    visaNo: '',
    passportNo: '',
    code: '',
    applicationNo: '',
    name: '',
    birthDate: '',
    validFrom: '',
    validUntil: '',
    typeOfVisa: '',
    durationOfStay: '',
    nationality: '',
    placeOfIssue: '',
    entryType: '',

  };

  constructor(
    private visitService: VisitService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.visitId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.visitId;

    if (this.isEditMode) {
      this.fetchVisit();
    }
  }

  fetchVisit() {
    this.isFetching = true;
    this.visitService.getById(this.visitId).subscribe({
      next: (res) => {
        const v = res.data;
        this.formData = {
          visaNo: v.visaNo,
          passportNo: v.passportNo,
          code: v.code,
          applicationNo: v.applicationNo,
          name: v.name,
          birthDate: v.birthDate,
          validFrom: v.validFrom,
          validUntil: v.validUntil,
          typeOfVisa: v.typeOfVisa,
          durationOfStay: v.durationOfStay,
          nationality: v.nationality,
          placeOfIssue: v.placeOfIssue,
          entryType: v.entryType,
        };
        this.imagePreviewUrl = v.image_url;
        this.isFetching = false;
      },
      error: () => {
        this.errorMessage = 'حدث خطأ أثناء جلب البيانات';
        this.isFetching = false;
      },
    });
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
      this.imagePreviewUrl = URL.createObjectURL(this.selectedImage);
    }
  }

  onSubmit() {
    // في وضع الإضافة، الصورة مطلوبة (زي ما الباك إند بيتأكد بـ req.file)
    if (!this.isEditMode && !this.selectedImage) {
      this.errorMessage = 'صورة التأشيرة مطلوبة';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const request$ = this.isEditMode
      ? this.visitService.update(this.visitId, this.formData, this.selectedImage)
      : this.visitService.create(this.formData, this.selectedImage!);

    request$.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/visits']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'حدث خطأ، حاول مرة أخرى';
      },
    });
  }

  goBack() {
    this.router.navigate(['/visits']);
  }
}