/**
 * Stamp Repository Implementation
 */

import type {
  Stamp,
  StampCollection,
} from "../../domain/entities/stamp.entity";
import type { StampRepository } from "../../domain/repositories/stamp-repository.interface";
import type { StampDataSource } from "../data-sources/stamp-mock-data-source";
import { stampDtoListToDomain } from "../mappers/stamp.mapper";

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
    return stamps.find((s) => s.getId() === stampId) ?? null;
  }

  async useStamp(stampId: string): Promise<void> {
    await this.dataSource.useStamp(stampId);
  }
}
