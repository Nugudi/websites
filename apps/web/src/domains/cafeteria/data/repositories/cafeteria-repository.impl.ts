/**
 * Cafeteria Repository Implementation
 *
 * DataSource를 통해 API 호출 수행 (Clean Architecture)
 * - DataSource에서 DTO 가져오기
 * - 필요시 Mapper로 Entity 변환
 * - 에러 처리
 */

import type { CafeteriaRepository } from "../../domain/repositories";
import type { CafeteriaRemoteDataSource } from "../data-sources";
import type {
  GetCafeteriaMenuAvailabilityResponse,
  GetCafeteriaMenuResponse,
  GetCafeteriaResponse,
  GetCafeteriaWithMenuResponse,
  PageInfo,
  RegisterCafeteriaMenuRequest,
  RegisterCafeteriaMenuResponse,
  RegisterCafeteriaRequest,
  RegisterCafeteriaResponse,
} from "../dto";

export class CafeteriaRepositoryImpl implements CafeteriaRepository {
  constructor(private readonly dataSource: CafeteriaRemoteDataSource) {}

  async getCafeteriasWithMenu(params: {
    date?: string;
    cursor?: string;
    size?: number;
  }): Promise<{
    data: GetCafeteriaWithMenuResponse[];
    pageInfo: PageInfo;
  }> {
    try {
      // DataSource에서 DTO 가져오기
      return await this.dataSource.getCafeteriasWithMenu(params);
    } catch (error) {
      throw this.handleError(error, "Failed to fetch cafeterias with menu");
    }
  }

  async getCafeteriaById(id: string): Promise<GetCafeteriaResponse> {
    try {
      // DataSource에서 DTO 가져오기
      return await this.dataSource.getCafeteriaById(id);
    } catch (error) {
      throw this.handleError(error, "Failed to fetch cafeteria");
    }
  }

  async getCafeteriaMenuByDate(
    id: string,
    date: string,
  ): Promise<GetCafeteriaMenuResponse> {
    try {
      // DataSource에서 DTO 가져오기
      return await this.dataSource.getCafeteriaMenuByDate(id, date);
    } catch (error) {
      throw this.handleError(error, "Failed to fetch cafeteria menu");
    }
  }

  async getCafeteriaMenuAvailability(
    id: string,
    params: {
      year: number;
      month: number;
    },
  ): Promise<GetCafeteriaMenuAvailabilityResponse> {
    try {
      // DataSource에서 DTO 가져오기
      return await this.dataSource.getCafeteriaMenuAvailability(id, params);
    } catch (error) {
      throw this.handleError(error, "Failed to fetch menu availability");
    }
  }

  async registerCafeteria(
    data: RegisterCafeteriaRequest,
  ): Promise<RegisterCafeteriaResponse> {
    try {
      // DataSource에서 DTO 가져오기
      return await this.dataSource.registerCafeteria(data);
    } catch (error) {
      throw this.handleError(error, "Failed to register cafeteria");
    }
  }

  async registerCafeteriaMenu(
    data: RegisterCafeteriaMenuRequest,
  ): Promise<RegisterCafeteriaMenuResponse> {
    try {
      // DataSource에서 DTO 가져오기
      return await this.dataSource.registerCafeteriaMenu(data);
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
