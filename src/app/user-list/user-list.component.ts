import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUsersWithPosts().subscribe({
      next: (usersWithPosts) => {
        this.users = usersWithPosts;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  }
}
