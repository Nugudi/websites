/**
 * Stamp Repository Implementation
 *
 * Data layer repository implementation
 * - Uses DataSource for data access
 * - Converts DTOs to Domain Entities using Mapper
 * - Also provides UI-ready data conversion
 * - Implements StampRepository interface
 *
 * Pattern:
 * 1. DataSource에서 DTO 가져오기 (snake_case)
 * 2. Mapper로 Entity 변환 (camelCase)
 * 3. Domain Entity 또는 UI-ready data 반환
 */

import type {
  Stamp,
  StampCollection,
} from "../../domain/entities/stamp.entity";
import type { StampRepository } from "../../domain/repositories/stamp-repository.interface";
import type { StampCollectionUI } from "../../presentation/types/stamp";
import type { StampDataSource } from "../data-sources/stamp-mock-data-source";
import {
  stampDtoListToDomain,
  stampEntityListToUi,
} from "../mappers/stamp.mapper";

/**
 * UI-ready Stamp Collection Response
 */
export interface StampCollectionResponse {
  stamps: StampCollectionUI["stamps"];
  totalCount: number;
  unusedCount: number;
}

export class StampRepositoryImpl implements StampRepository {
  constructor(private readonly dataSource: StampDataSource) {}

  async getStampCollection(): Promise<StampCollection> {
    const response = await this.dataSource.getStampCollection();
    const stamps = stampDtoListToDomain(response.stamps);
    return {
      stamps,
      totalCount: response.total_count,
      unusedCount: response.unused_count,
    };
  }

  async getStampById(stampId: string): Promise<Stamp | null> {
    const { stamps } = await this.getStampCollection();
    return stamps.find((s) => s.id === stampId) ?? null;
  }

  async useStamp(stampId: string): Promise<void> {
    await this.dataSource.useStamp(stampId);
  }

  /**
   * 스탬프 컬렉션 조회 (UI-ready data 반환)
   * Presentation layer에서 바로 사용 가능한 형태로 변환하여 반환
   * @returns UI-ready 스탬프 컬렉션
   */
  async getStampCollectionForUI(): Promise<StampCollectionResponse> {
    // 1. DataSource에서 DTO 가져오기
    const response = await this.dataSource.getStampCollection();

    // 2. Mapper로 DTO → Entity 변환
    const entities = stampDtoListToDomain(response.stamps);

    // 3. Mapper로 Entity → UI Type 변환
    const stampItems = stampEntityListToUi(entities);

    // 4. UI-ready 형태로 반환
    return {
      stamps: stampItems,
      totalCount: response.total_count,
      unusedCount: response.unused_count,
    };
  }
}
