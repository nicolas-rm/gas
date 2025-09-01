import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../utils/services/sidebar.service';

@Component({
    selector: 'app-sidebar',
    imports: [CommonModule, RouterModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
    readonly sidebarMenu
    constructor(public sidebarService: SidebarService) {
        this.sidebarMenu = this.sidebarService.sidebarMenu;
    }
}
