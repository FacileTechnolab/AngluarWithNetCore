export class Pager {
    resultCount: number;
    totalRecord: number;
    currentPage: number;
    totalPage: number;
    startPage?: number;
    endPage?: number;
}

export class PagerEvent {
    Page: Pager;
    Type: string;
}
