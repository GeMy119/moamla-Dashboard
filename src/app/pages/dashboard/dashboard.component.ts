import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { EmployerService } from '../../services/employer.service.ts.service';
import { WorkerService } from '../../services/worker.service';
import { VisitService } from '../../services/visits.service';
import { NationalityRequestService } from '../../services/nationality-request.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  isLoading = false;
  errorMessage = '';

  stats = {
    employers: 0,
    workers: 0,
    visits: 0,
    nationalityRequests: 0,
  };

  constructor(
    private employerService: EmployerService,
    private workerService: WorkerService,
    private visitService: VisitService,
    private nationalityRequestService: NationalityRequestService
  ) { }

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.isLoading = true;
    this.errorMessage = '';

    // limit: 1 عشان نجيب بس pagination.total من غير ما نجيب كل البيانات
    forkJoin({
      employers: this.employerService.getAll(1, 1),
      workers: this.workerService.getAll({ page: 1, limit: 1 }),
      visits: this.visitService.getAll({ page: 1, limit: 1 }),
      nationalityRequests: this.nationalityRequestService.getAll({ page: 1, limit: 1 }),
    }).subscribe({
      next: (res) => {
        this.stats = {
          employers: res.employers.pagination.total,
          workers: res.workers.pagination.total,
          visits: res.visits.pagination.total,
          nationalityRequests: res.nationalityRequests.pagination.total,
        };
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'حدث خطأ أثناء جلب الإحصائيات';
        this.isLoading = false;
      },
    });
  }
}