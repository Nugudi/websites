/**
 * Cafeteria Repository Implementation
 *
 * DataSource를 통해 API 호출 수행 (Clean Architecture)
 * - DataSource에서 DTO 가져오기
 * - Mapper로 Entity 변환
 * - 에러 처리
 */

import type { PageInfo } from "@shared/domain/entities";
import type {
  Cafeteria,
  CafeteriaMenu,
  CafeteriaMenuTimeline,
  CafeteriaWithMenu,
  MenuAvailability,
  RegisterCafeteriaMenuRequest as RegisterCafeteriaMenuRequestEntity,
  RegisterCafeteriaRequest as RegisterCafeteriaRequestEntity,
} from "../../domain/entities";
import type { CafeteriaRepository } from "../../domain/repositories";
import type { CafeteriaRemoteDataSource } from "../data-sources";
import type { GetCafeteriaMenuTimelineResponse } from "../dto";
import {
  cafeteriaInfoDtoToDomain,
  getCafeteriaMenuAvailabilityResponseToDomain,
  getCafeteriaMenuResponseToDomain,
  getCafeteriaMenuTimelineResponseToDomain,
  getCafeteriaWithMenuResponseToDomain,
  pageInfoDtoToDomain,
  registerCafeteriaMenuResponseToDomain,
  registerCafeteriaResponseToDomain,
} from "../mappers";

export class CafeteriaRepositoryImpl implements CafeteriaRepository {
  constructor(private readonly dataSource: CafeteriaRemoteDataSource) {}

  async getCafeteriasWithMenu(params: {
    date?: string;
    cursor?: string;
    size?: number;
  }): Promise<{
    data: CafeteriaWithMenu[];
    pageInfo: PageInfo;
  }> {
    try {
      // DataSource에서 DTO 가져오기
      const response = await this.dataSource.getCafeteriasWithMenu(params);

      // Mapper로 Entity 변환
      return {
        data: response.data.map((dto) =>
          getCafeteriaWithMenuResponseToDomain(dto),
        ),
        pageInfo: pageInfoDtoToDomain(response.pageInfo),
      };
    } catch (error) {
      throw this.handleError(error, "Failed to fetch cafeterias with menu");
    }
  }

  async getCafeteriaById(id: string): Promise<Cafeteria> {
    try {
      // DataSource에서 DTO 가져오기
      const response = await this.dataSource.getCafeteriaById(id);

      // Null 체크
      if (!response) {
        throw new Error("Cafeteria response is null");
      }

      // Mapper로 Entity 변환
      if (!response.cafeteria) {
        throw new Error("Cafeteria not found in response");
      }
      return cafeteriaInfoDtoToDomain(response.cafeteria);
    } catch (error) {
      throw this.handleError(error, "Failed to fetch cafeteria");
    }
  }

  async getCafeteriaMenuByDate(
    id: string,
    date: string,
  ): Promise<CafeteriaMenu> {
    try {
      // DataSource에서 DTO 가져오기
      const response = await this.dataSource.getCafeteriaMenuByDate(id, date);

      // Mapper로 Entity 변환
      return getCafeteriaMenuResponseToDomain(response);
    } catch (error) {
      throw this.handleError(error, "Failed to fetch cafeteria menu");
    }
  }

  async getCafeteriaMenuTimeline(
    id: string,
    params: {
      cursor?: string;
      size?: number;
    },
  ): Promise<{
    data: CafeteriaMenuTimeline[];
    pageInfo: PageInfo;
  }> {
    try {
      // DataSource에서 DTO 가져오기
      const response = await this.dataSource.getCafeteriaMenuTimeline(
        id,
        params,
      );

      // Mapper로 Entity 변환
      return {
        data: response.data.map((dto: GetCafeteriaMenuTimelineResponse) =>
          getCafeteriaMenuTimelineResponseToDomain(dto),
        ),
        pageInfo: pageInfoDtoToDomain(response.pageInfo),
      };
    } catch (error) {
      throw this.handleError(error, "Failed to fetch cafeteria menu timeline");
    }
  }

  async getCafeteriaMenuAvailability(
    id: string,
    params: {
      year: number;
      month: number;
    },
  ): Promise<MenuAvailability> {
    try {
      // DataSource에서 DTO 가져오기
      const response = await this.dataSource.getCafeteriaMenuAvailability(
        id,
        params,
      );

      // Mapper로 Entity 변환
      return getCafeteriaMenuAvailabilityResponseToDomain(response);
    } catch (error) {
      throw this.handleError(error, "Failed to fetch menu availability");
    }
  }

  async registerCafeteria(
    data: RegisterCafeteriaRequestEntity,
  ): Promise<Cafeteria> {
    try {
      // Entity → DTO 변환은 DataSource에서 처리
      const response = await this.dataSource.registerCafeteria(data as any);

      // Null 체크
      if (!response) {
        throw new Error("Register cafeteria response is null");
      }

      // Mapper로 Entity 변환
      return registerCafeteriaResponseToDomain(response);
    } catch (error) {
      throw this.handleError(error, "Failed to register cafeteria");
    }
  }

  async registerCafeteriaMenu(
    data: RegisterCafeteriaMenuRequestEntity,
  ): Promise<CafeteriaMenu> {
    try {
      // Entity → DTO 변환은 DataSource에서 처리
      const response = await this.dataSource.registerCafeteriaMenu(data as any);

      // Null 체크
      if (!response) {
        throw new Error("Register cafeteria menu response is null");
      }

      // Mapper로 Entity 변환
      return registerCafeteriaMenuResponseToDomain(response);
    } catch (error) {
      throw this.handleError(error, "Failed to register cafeteria menu");
    }
  }

  /**
   * 에러 처리 헬퍼
   */
  private handleError(error: unknown, message: string): Error {
    if (error instanceof Error) {
      return new Error(`${message}: ${error.message}`);
    }
    return new Error(message);
  }
}
