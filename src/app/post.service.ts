import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPost } from './post.model';
import { map } from 'rxjs/operators/map';
import { throwError, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators/catchError';

@Injectable({ providedIn: 'root' })
export class PostsService {
  error = new Subject<string>();
  constructor(private http: HttpClient) {}
  createAndStorePost(title: string, content: string) {
    const postData: IPost = { title: title, content: content };
    console.log(postData);
    this.http
      .post<{ name: string }>(
        'https://angular-complete-guide-dfe68-default-rtdb.firebaseio.com/posts.json',
        postData
      )
      .subscribe(
        (responseData) => {
          console.log(responseData);
        },
        (error) => {
          this.error.next(error.message);
        }
      );
  }

  fetchPosts() {
    return this.http
      .get<{ [key: string]: IPost }>(
        'https://angular-complete-guide-dfe68-default-rtdb.firebaseio.com/posts.json'
      )
      .pipe(
        map((responseData: { [key: string]: IPost }) => {
          const postArray: IPost[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({ ...responseData[key], id: key });
            }
          }
          return postArray;
        }),
        catchError((errorRes) => {
          // Send to analytics server
          return throwError(errorRes);
        })
      );
  }

  deletePosts() {
    return this.http.delete(
      'https://angular-complete-guide-dfe68-default-rtdb.firebaseio.com/posts.json'
    );
  }
}
