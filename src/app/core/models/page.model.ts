import { PageInfo } from "./page-info.model";

export class Page<T> {
  content: T[] = [];
  page: PageInfo = new PageInfo();
}