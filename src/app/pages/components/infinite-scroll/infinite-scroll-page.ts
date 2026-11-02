import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InfiniteScroll } from 'ashen-ui/infinite-scroll';
import { Table } from 'ashen-ui/table';
import { TableColumn } from 'ashen-ui/table';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

interface LogRow {
  id: number;
  level: string;
  message: string;
  time: string;
}

interface ChatMessage {
  id: number;
  author: string;
  text: string;
}

@Component({
  selector: 'app-infinite-scroll-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [InfiniteScroll, Table, TableColumn, DocExample, DocApi],
  templateUrl: './infinite-scroll-page.html',
  styleUrl: './infinite-scroll-page.scss',
})
export class InfiniteScrollPage {
  protected readonly BATCH = 20;

  protected readonly items = signal<string[]>(this._generateItems(0, this.BATCH));
  protected readonly loading = signal(false);
  protected readonly totalLoaded = signal(this.BATCH);

  protected readonly chatMessages = signal<ChatMessage[]>(this._generateChat(80, 100));
  protected readonly chatLoading = signal(false);
  protected readonly chatOldestId = signal(80);

  protected readonly tableRows = signal<LogRow[]>(this._generateLogs(1, this.BATCH));
  protected readonly tableLoading = signal(false);
  protected readonly tableTotal = signal(this.BATCH);

  protected readonly isDisabled = signal(false);
  protected readonly disabledItems = signal<string[]>(this._generateItems(0, 10));

  loadMore(): void {
    if (this.loading()) return;
    this.loading.set(true);
    setTimeout(() => {
      const start = this.totalLoaded();
      const next = this._generateItems(start, this.BATCH);
      this.items.update((prev) => [...prev, ...next]);
      this.totalLoaded.update((n) => n + this.BATCH);
      this.loading.set(false);
    }, 400);
  }

  loadOlderMessages(): void {
    if (this.chatLoading() || this.chatOldestId() <= 0) return;
    this.chatLoading.set(true);
    setTimeout(() => {
      const end = this.chatOldestId();
      const start = Math.max(0, end - 20);
      const older = this._generateChat(start, end - start);
      this.chatMessages.update((prev) => [...older, ...prev]);
      this.chatOldestId.set(start);
      this.chatLoading.set(false);
    }, 400);
  }

  loadMoreRows(): void {
    if (this.tableLoading()) return;
    this.tableLoading.set(true);
    setTimeout(() => {
      const start = this.tableTotal();
      const next = this._generateLogs(start + 1, this.BATCH);
      this.tableRows.update((prev) => [...prev, ...next]);
      this.tableTotal.update((n) => n + this.BATCH);
      this.tableLoading.set(false);
    }, 400);
  }

  private _generateItems(start: number, count: number): string[] {
    return Array.from({ length: count }, (_, i) => `Item ${start + i + 1}`);
  }

  private _generateChat(start: number, count: number): ChatMessage[] {
    return Array.from({ length: count }, (_, i) => ({
      id: start + i,
      author: i % 2 === 0 ? 'You' : 'Alex',
      text: `Message #${start + i + 1} - some chat content here.`,
    }));
  }

  private _generateLogs(start: number, count: number): LogRow[] {
    const levels = ['info', 'warn', 'error'];
    return Array.from({ length: count }, (_, i) => ({
      id: start + i,
      level: levels[(start + i) % 3],
      message: `Log entry ${start + i}: operation completed successfully.`,
      time: new Date(Date.now() - (start + i) * 60000).toISOString().substring(11, 19),
    }));
  }

}
