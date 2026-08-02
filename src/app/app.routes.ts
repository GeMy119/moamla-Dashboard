import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guards';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./pages/login/login.component').then(
                (m) => m.LoginComponent
            ),
    },
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./layout/dashboard-layout/dashboard-layout.component').then(
                (m) => m.DashboardLayoutComponent
            ),
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            },
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./pages/dashboard/dashboard.component').then(
                        (m) => m.DashboardComponent
                    ),
            },
            {
                path: 'employers',
                loadComponent: () =>
                    import('./pages/employers/employers/employers.component').then(
                        (m) => m.EmployersComponent
                    ),
            },
            {
                path: 'employers/:id',
                loadComponent: () =>
                    import('./pages/employers/employer-details/employer-details.component').then(
                        (m) => m.EmployerDetailsComponent
                    ),
            },
            {
                path: 'employers/:id/marriage-permit/:mode',
                loadComponent: () =>
                    import('./pages/employers/marriage-permit-form/marriage-permit-form.component').then(
                        (m) => m.MarriagePermitFormComponent
                    ),
            },
            {
                path: 'marriage-permits/add', loadComponent: () =>
                    import('./pages/employers/marriage-permit-form/marriage-permit-form.component').then(
                        (m) => m.MarriagePermitFormComponent
                    ),
            },
            {
                path: 'employers/ticket-visa-review/add',
                loadComponent: () =>
                    import('./pages/employers/ticket-visa-review-form/ticket-visa-review-form.component').then(
                        (m) => m.TicketVisaReviewFormComponent
                    ),
            },
            {
                path: 'employers/:id/ticket-visa-review/add',
                loadComponent: () =>
                    import('./pages/employers/ticket-visa-review-form/ticket-visa-review-form.component').then(
                        (m) => m.TicketVisaReviewFormComponent
                    ),
            },
            {
                path: 'employers/:id/ticket-visa-review/:reviewId/edit',
                loadComponent: () =>
                    import('./pages/employers/ticket-visa-review-form/ticket-visa-review-form.component').then(
                        (m) => m.TicketVisaReviewFormComponent
                    ),
            },
            {
                path: 'employers/add-employer/:mode',
                loadComponent: () =>
                    import(
                        './pages/employers/employer-form/employer-form.component'
                    ).then((m) => m.EmployerFormComponent),
            },
            {
                path: 'employers/:id/edit',   // ⬅️ الإضافة الجديدة
                loadComponent: () =>
                    import(
                        './pages/employers/employer-form/employer-form.component'
                    ).then((m) => m.EmployerFormComponent),
            },
            {
                path: 'workers',
                loadComponent: () =>
                    import('./pages/workers/workers/workers.component').then((m) => m.WorkersComponent),
            },
            {
                path: 'employers/:employerId/workers/add',
                loadComponent: () =>
                    import('./pages/workers/worker-form/worker-form.component').then(
                        (m) => m.WorkerFormComponent
                    ),
            },
            {
                path: 'employers/workers/add',
                loadComponent: () =>
                    import('./pages/workers/worker-form/worker-form.component').then(
                        (m) => m.WorkerFormComponent
                    ),
            },
            {
                path: 'workers/:id/edit',
                loadComponent: () =>
                    import('./pages/workers/worker-form/worker-form.component').then(
                        (m) => m.WorkerFormComponent
                    ),
            },
            {
                path: 'workers/:id/moamla-type/add',
                loadComponent: () =>
                    import('./pages/workers/moamla-type-form/moamla-type-form.component').then(
                        (m) => m.MoamlaTypeFormComponent
                    ),
            },
            {
                path: 'workers/moamla-type/add',
                loadComponent: () =>
                    import('./pages/workers/moamla-type-form/moamla-type-form.component').then(
                        (m) => m.MoamlaTypeFormComponent
                    ),
            },
            {
                path: 'workers/:id/moamla-type/:moamlaId/edit',
                loadComponent: () =>
                    import('./pages/workers/moamla-type-form/moamla-type-form.component').then(
                        (m) => m.MoamlaTypeFormComponent
                    ),
            },
            {
                path: 'workers/:id/alerts/add',
                loadComponent: () =>
                    import('./pages/workers/alert-form/alert-form.component').then(
                        (m) => m.AlertFormComponent
                    ),
            },
            {
                path: 'workers/alerts/add',
                loadComponent: () =>
                    import('./pages/workers/alert-form/alert-form.component').then(
                        (m) => m.AlertFormComponent
                    ),
            },
            {
                path: 'workers/:id/alerts/edit',
                loadComponent: () =>
                    import('./pages/workers/alert-form/alert-form.component').then(
                        (m) => m.AlertFormComponent
                    ),
            },
            {
                path: 'workers/profession-change/add',
                loadComponent: () =>
                    import('./pages/workers/profession-change-form/profession-change-form.component').then(
                        (m) => m.ProfessionChangeFormComponent
                    ),
            },
            {
                path: 'workers/:id/profession-change/:mode',
                loadComponent: () =>
                    import('./pages/workers/profession-change-form/profession-change-form.component').then(
                        (m) => m.ProfessionChangeFormComponent
                    ),
            },
            {
                path: 'workers/:id',
                loadComponent: () =>
                    import('./pages/workers/worker-details/worker-details.component').then(
                        (m) => m.WorkerDetailsComponent
                    ),
            },
            {
                path: 'workers/:workerId/family-visas/add',
                loadComponent: () =>
                    import('./pages/workers/family-visa-form/family-visa-form.component').then(
                        (m) => m.FamilyVisaFormComponent
                    ),
            },
            {
                path: 'workers/family-visas/add',
                loadComponent: () =>
                    import('./pages/workers/family-visa-form/family-visa-form.component').then(
                        (m) => m.FamilyVisaFormComponent
                    ),
            },
            {
                path: 'family-visas/:id/edit',
                loadComponent: () =>
                    import('./pages/workers/family-visa-form/family-visa-form.component').then(
                        (m) => m.FamilyVisaFormComponent
                    ),
            },
            {
                path: 'visits',
                loadComponent: () =>
                    import('./pages/visits/visits/visits.component').then(
                        (m) => m.VisitsComponent
                    ),
            },
            {
                path: 'visits/add',
                loadComponent: () =>
                    import('./pages/visits/visits-form/visits-form.component').then(
                        (m) => m.VisitsFormComponent
                    ),
            },
            {
                path: 'visits/:id/edit',
                loadComponent: () =>
                    import('./pages/visits/visits-form/visits-form.component').then(
                        (m) => m.VisitsFormComponent
                    ),
            },
            {
                path: 'nationality-requests/add',
                loadComponent: () =>
                    import('./pages/nationality-requests/nationality-request-form/nationality-request-form.component').then(
                        (m) => m.NationalityRequestFormComponent
                    ),
            },
            {
                path: 'nationality-requests/:id/edit',
                loadComponent: () =>
                    import('./pages/nationality-requests/nationality-request-form/nationality-request-form.component').then(
                        (m) => m.NationalityRequestFormComponent
                    ),
            },
            {
                path: 'nationality-requests',
                loadComponent: () =>
                    import(
                        './pages/nationality-requests/nationality-requests/nationality-requests.component'
                    ).then((m) => m.NationalityRequestsComponent),
            },


        ],
    },
];