import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Breadcrumb, BreadcrumbService } from '@/app/utils/services/breadcrumb.service';

@Component({
    selector: 'app-breadcrumb',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
    breadcrumbs: Breadcrumb[] = [];
    pageTitle: string = '';

    constructor(private breadcrumbService: BreadcrumbService) {}

    ngOnInit(): void {
        this.breadcrumbService.getBreadcrumbs().subscribe(breadcrumbs => {
            this.breadcrumbs = breadcrumbs;
            // Establecer el título de la página basado en el último breadcrumb
            if (breadcrumbs.length > 0) {
                this.pageTitle = breadcrumbs[breadcrumbs.length - 1].label;
            }
        });
    }
}
