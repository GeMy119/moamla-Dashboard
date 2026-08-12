import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Output() closeSidebar = new EventEmitter<void>();

  links = [
    { label: 'الرئيسية', path: '/dashboard' },
    { label: 'الكفلاء السعوديين', path: '/employers' },
    { label: 'التأشيرات', path: '/visits' },
    { label: 'طلبات الجنسية', path: '/nationality-requests' },
    { label: 'العمال', path: '/workers' },
    { label: 'انشاء ملف العمالة', path: '/employers/workers/add' },
    { label: 'انشاء ملف تصريح زواج', path: '/marriage-permits/add' },
    { label: 'انشاء ملف تأشيره او استقدام عائلية', path: '/workers/family-visas/add' },
    { label: 'انشاء ملف الأحوال المدنية', path: '/nationality-requests/add' },
    { label: 'انشاء ملف زيارة سياحية', path: '/visits/add' },
    { label: 'انشاء ملف تعديل المهنة', path: '/workers/profession-change/add' },
    { label: 'انشاء ملف البلاغات', path: '/workers/alerts/add' },
    { label: 'انشاء ملف مكتب العمل', path: '/employers/ticket-visa-review/add' },
    { label: 'انشاء ملف المعاملات', path: '/workers/moamla-type/add' },
  ];

  onLinkClick() {
    this.closeSidebar.emit();
  }
}
//z18+5n+wwt&8mKZwbv&B