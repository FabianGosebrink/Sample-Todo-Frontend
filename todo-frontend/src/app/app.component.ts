import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../environments/environment';
import { SignalRService } from './signalr.service';
import { Todo } from './todo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'app';
  items: Todo[] = [];
  form = new FormGroup({});

  constructor(
    signalrService: SignalRService,
    private readonly http: HttpClient
  ) {
    signalrService.itemAdded.subscribe((addedItem) => {
      const mergedItems = [...this.items, addedItem];
      this.setSortedItems(mergedItems);
    });

    signalrService.itemUpdated.subscribe((updatedItem) => {
      const filteredItems = this.items.filter((x) => x.id !== updatedItem.id);
      const mergedItems = [...filteredItems, updatedItem];
      this.setSortedItems(mergedItems);
    });

    signalrService.itemDeleted.subscribe((removedId) => {
      const filteredItems = this.items.filter((x) => x.id !== removedId);
      this.setSortedItems(filteredItems);
    });
  }

  ngOnInit(): void {
    this.http.get<Todo[]>(`${environment.apiUrl}todos/`).subscribe((items) => {
      this.setSortedItems(items);
    });

    this.form = new FormGroup({
      todoValue: new FormControl('', Validators.required),
    });
  }

  addTodo(): void {
    const toSend = { value: this.form.value.todoValue };

    this.http
      .post(`${environment.apiUrl}todos/`, toSend)
      .subscribe(() => console.log('added'));

    this.form.reset();
  }

  deleteTodo(item: Todo): void {
    this.http
    .delete(`${environment.apiUrl}todos/${item.id}`)
    .subscribe();
  }

  markAsDone(item: Todo): void {
    item.done = !item.done;
    this.http
      .put(`${environment.apiUrl}todos/${item.id}`, item)
      .subscribe(() => console.log('updated'));
  }

  private setSortedItems(items: Todo[]): void {
    const sortedItems = items.sort(this.sortByDone());
    this.items = [...sortedItems];
  }

  private sortByDone(): (a: Todo, b: Todo) => number {
    return (a: Todo, b: Todo) => {
      if (a.done < b.done) {
        return -1;
      }
      if (a.done > b.done) {
        return 1;
      }
      return 0;
    };
  }
}
