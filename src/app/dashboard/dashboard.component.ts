import { Component } from '@angular/core';
import { ToastComponent, SidebarComponent, NavbarComponent, NavbarHorizontalComponent, MenuCanvasComponent, ShoppingCartComponent, CustomerSettingsComponent, ExampleComponent, SearchComponent, ContainerComponent } from '@/components/components';

@Component({
  selector: 'app-dashboard',
  imports: [ToastComponent, SidebarComponent, NavbarComponent, NavbarHorizontalComponent, MenuCanvasComponent, ShoppingCartComponent, CustomerSettingsComponent, ExampleComponent, SearchComponent, ContainerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
