import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError, switchMap, forkJoin, map } from 'rxjs';

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

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    return throwError(() => errorMessage);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getPostsByUserId(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/posts?userId=${userId}`).pipe(
      catchError(this.handleError.bind(this))
    );
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
      }),
      catchError(this.handleError.bind(this))
    );
  }
}