import { Injectable } from '@angular/core';
import { FeedItem, feedItemMocks } from '../models/feed-item.model';
import { BehaviorSubject } from 'rxjs';

import { ApiService } from '../../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class FeedProviderService {
  currentFeed$: BehaviorSubject<FeedItem[]> = new BehaviorSubject<FeedItem[]>(
    []
  );

  constructor(private api: ApiService) {}

  async getFeed(): Promise<BehaviorSubject<FeedItem[]>> {
    const req = await this.api.get('/feed');
    const items = <FeedItem[]>req.rows;
    this.currentFeed$.next(items);
    return Promise.resolve(this.currentFeed$);
  }

  async uploadFeedItem(caption: string, file: File): Promise<any> {
    const res = await this.api.upload('/feed', file, {
      caption: caption,
      url: file.name,
    });
    const feed = [res].concat(this.currentFeed$.value);
    this.currentFeed$.next(feed);
    return res;
  }
}
