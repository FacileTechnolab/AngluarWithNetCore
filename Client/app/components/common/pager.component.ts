import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { Pager, PagerEvent } from '../../model/pager';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html'
})
export class PagerComponent implements OnInit {
  @Output() changed: EventEmitter<PagerEvent>;
  @Input() pagerInfo: Pager;

  constructor() {
    this.changed = new EventEmitter<PagerEvent>();
  }
  ngOnInit() {
  }
  onPageChange(pageEvent: PagerEvent) {
    this.changed.emit(pageEvent);
  }
}
