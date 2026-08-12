import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NationalityRequestService } from '../../../services/nationality-request.service';
import { CreateNationalityRequestDto } from '../../../models/nationality-request.model.ts';

@Component({
  selector: 'app-nationality-request-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './nationality-request-form.component.html',
})
export class NationalityRequestFormComponent implements OnInit {
  requestId = '';
  isEditMode = false;
  isLoading = false;
  isFetching = false;
  errorMessage = '';

  selectedImage: File | null = null;
  imagePreviewUrl: string | null = null;

  formData: CreateNationalityRequestDto = {
    name: '',
    application_number: '',
    issue_date: '',
    serial_number: '',
    status: 'تمت الموافقة',
    job: '',
    identity_number: '',
  };

  constructor(
    private nationalityRequestService: NationalityRequestService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.requestId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.requestId;

    if (this.isEditMode) {
      this.fetchRequest();
    }
  }

  fetchRequest() {
    this.isFetching = true;
    this.nationalityRequestService.getById(this.requestId).subscribe({
      next: (res) => {
        const r = res.data;
        this.formData = {
          name: r.name,
          application_number: r.application_number,
          issue_date: r.issue_date,
          serial_number: r.serial_number,
          status: r.status,
          job: r.job,
          identity_number: r.identity_number,
        };
        this.imagePreviewUrl = r.image_URL;
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
    if (!this.isEditMode && !this.selectedImage) {
      this.errorMessage = 'صورة الطلب مطلوبة';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const request$ = this.isEditMode
      ? this.nationalityRequestService.update(this.requestId, this.formData, this.selectedImage)
      : this.nationalityRequestService.create(this.formData, this.selectedImage!);

    request$.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/nationality-requests']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'حدث خطأ، حاول مرة أخرى';
      },
    });
  }

  goBack() {
    this.router.navigate(['/nationality-requests']);
  }
}