import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';
  errorMessage: string = '';
  isLoading: boolean = true;
  
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.userService.getUsersWithPosts().subscribe({
      next: (usersWithPosts) => {
        this.users = usersWithPosts;
        this.filteredUsers = usersWithPosts;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error;
        this.isLoading = false;
      }
    });
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = this.users;
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();
    this.filteredUsers = this.users.filter(user => 
      user.name.toLowerCase().includes(searchTermLower) ||
      user.email.toLowerCase().includes(searchTermLower)
    );
  }
}
