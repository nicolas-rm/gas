import { Component } from '@angular/core';
import { CustomberTabInterface, tabs } from '@/dashboard/customer/customer';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-create',
  imports: [CommonModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
    readonly customerTabs: CustomberTabInterface[] = tabs;

}
