import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, forkJoin, map } from 'rxjs';

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  getPostsByUserId(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/posts?userId=${userId}`);
  }

  getUsersWithPosts(): Observable<(User & { posts: Post[] })[]> {
    return this.getUsers().pipe(
      switchMap(users => {
        const usersWithPosts = users.map(user => 
          this.getPostsByUserId(user.id).pipe(
            map(posts => ({...user, posts}))
          )
        );
        return forkJoin(usersWithPosts);
      })
    );
  }
}