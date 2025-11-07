/**
 * Cafeteria Menu Timeline Entity
 */

import type { CafeteriaMenu } from "./cafeteria-menu.entity";

/** 구내식당 메뉴 타임라인 (일자별 메뉴 목록) */
export interface CafeteriaMenuTimeline {
  readonly menuDate: string;
  readonly menus: CafeteriaMenu[];
  readonly reviewCount: number;
}
