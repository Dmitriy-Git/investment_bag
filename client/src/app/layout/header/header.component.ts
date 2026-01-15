import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-header',
  imports: [CommonModule, NzIconModule, NzButtonModule, NzDropdownModule, NzMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  collapsed = input.required<boolean>();
  theme = input.required<'light' | 'dark'>();
  
  toggleCollapse = output<void>();
  themeChange = output<'light' | 'dark'>();

  menuFoldIcon = 'menu-fold';
  menuUnfoldIcon = 'menu-unfold';

  onToggleCollapse(): void {
    this.toggleCollapse.emit();
  }

  onThemeChange(newTheme: 'light' | 'dark'): void {
    this.themeChange.emit(newTheme);
  }
}

