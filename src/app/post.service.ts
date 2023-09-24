import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { IPost } from './post.model';
import { map } from 'rxjs/operators/map';
import { throwError, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators/catchError';
import { tap } from 'rxjs/operators';

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
        postData,
        {
          observe: 'response',
        }
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
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');
    searchParams = searchParams.append('custom', 'key');
    return this.http
      .get<{ [key: string]: IPost }>(
        'https://angular-complete-guide-dfe68-default-rtdb.firebaseio.com/posts.json',
        {
          headers: new HttpHeaders({ 'Custom-Header': 'Hello' }),
          params: searchParams,
        }
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
    return this.http
      .delete(
        'https://angular-complete-guide-dfe68-default-rtdb.firebaseio.com/posts.json',
        {
          observe: 'events',
          responseType: 'json',
        }
      )
      .pipe(
        tap((event) => {
          console.log(event);
          if (event.type === HttpEventType.Sent) {
            console.log(event.type);
          }
          if (event.type === HttpEventType.Response) {
            console.log(event.body);
          }
        })
      );
  }
}
