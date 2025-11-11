/**
 * Cafeteria Repository Implementation
 *
 * Data Layer의 Repository 구현
 *
 * @remarks
 * - Domain Repository 인터페이스 구현
 * - DataSource를 통한 데이터 조회
 * - DTO → Entity 변환 (Mapper 사용)
 * - CafeteriaError 사용
 * - Clean Architecture: Data Layer
 */

import type { PageInfo } from "@core/types";
// Import Entity classes
import type { Cafeteria } from "../../../domain/entities";
import {
  CAFETERIA_ERROR_CODES,
  CafeteriaError,
} from "../../../domain/errors/cafeteria-error";
import type { CafeteriaRepository } from "../../../domain/repositories";
import {
  cafeteriaInfoDtoToDomain,
  getCafeteriaMenuAvailabilityResponseToDomain,
  getCafeteriaMenuResponseToDomain,
  getCafeteriaMenuTimelineResponseToDomain,
  getCafeteriaWithMenuResponseToDomain,
  pageInfoDtoToDomain,
  registerCafeteriaMenuResponseToDomain,
  registerCafeteriaResponseToDomain,
} from "../../mapper/cafeteria.mapper";
import type {
  GetCafeteriaMenuTimelineResponse,
  RegisterCafeteriaMenuRequest,
  RegisterCafeteriaRequest,
} from "../../remote/dto";
// Import Domain Types (simple data structures)
import type {
  CafeteriaMenu,
  CafeteriaMenuTimeline,
  MenuAvailability,
} from "../../remote/dto/response/cafeteria-menu-types";
import type { CafeteriaRemoteDataSource } from "../datasource/cafeteria-remote-data-source";

export class CafeteriaRepositoryImpl implements CafeteriaRepository {
  constructor(private readonly dataSource: CafeteriaRemoteDataSource) {}

  async getCafeteriasWithMenu(params: {
    date?: string;
    cursor?: string;
    size?: number;
  }): Promise<{
    data: Array<{
      cafeteria: Cafeteria;
      menus: CafeteriaMenu[];
    }>;
    pageInfo: PageInfo;
  }> {
    try {
      const response = await this.dataSource.getCafeteriasWithMenu(params);

      return {
        data: response.data.map((dto) =>
          getCafeteriaWithMenuResponseToDomain(dto),
        ),
        pageInfo: pageInfoDtoToDomain(response.pageInfo),
      };
    } catch (error) {
      if (error instanceof CafeteriaError) {
        throw error;
      }

      throw new CafeteriaError(
        "Failed to fetch cafeterias with menu",
        CAFETERIA_ERROR_CODES.CAFETERIA_LIST_FETCH_FAILED,
        error,
      );
    }
  }

  async getCafeteriaById(id: string): Promise<Cafeteria> {
    try {
      if (!id || id.trim().length === 0) {
        throw new CafeteriaError(
          "Cafeteria ID가 필요합니다.",
          CAFETERIA_ERROR_CODES.CAFETERIA_ID_REQUIRED,
        );
      }

      const response = await this.dataSource.getCafeteriaById(id);

      if (!response) {
        throw new CafeteriaError(
          "Cafeteria response is null",
          CAFETERIA_ERROR_CODES.INVALID_CAFETERIA_DATA,
        );
      }

      if (!response.cafeteria) {
        throw new CafeteriaError(
          "Cafeteria not found in response",
          CAFETERIA_ERROR_CODES.CAFETERIA_NOT_FOUND,
        );
      }

      return cafeteriaInfoDtoToDomain(response.cafeteria);
    } catch (error) {
      if (error instanceof CafeteriaError) {
        throw error;
      }

      throw new CafeteriaError(
        "Failed to fetch cafeteria",
        CAFETERIA_ERROR_CODES.CAFETERIA_NOT_FOUND,
        error,
      );
    }
  }

  async getCafeteriaMenuByDate(
    id: string,
    date: string,
  ): Promise<CafeteriaMenu> {
    try {
      const response = await this.dataSource.getCafeteriaMenuByDate(id, date);

      return getCafeteriaMenuResponseToDomain(response);
    } catch (error) {
      if (error instanceof CafeteriaError) {
        throw error;
      }

      throw new CafeteriaError(
        "Failed to fetch cafeteria menu",
        CAFETERIA_ERROR_CODES.MENU_FETCH_FAILED,
        error,
      );
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
      const response = await this.dataSource.getCafeteriaMenuTimeline(
        id,
        params,
      );

      return {
        data: response.data.map((dto: GetCafeteriaMenuTimelineResponse) =>
          getCafeteriaMenuTimelineResponseToDomain(dto),
        ),
        pageInfo: pageInfoDtoToDomain(response.pageInfo),
      };
    } catch (error) {
      if (error instanceof CafeteriaError) {
        throw error;
      }

      throw new CafeteriaError(
        "Failed to fetch cafeteria menu timeline",
        CAFETERIA_ERROR_CODES.MENU_FETCH_FAILED,
        error,
      );
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
      const response = await this.dataSource.getCafeteriaMenuAvailability(
        id,
        params,
      );

      return getCafeteriaMenuAvailabilityResponseToDomain(response);
    } catch (error) {
      if (error instanceof CafeteriaError) {
        throw error;
      }

      throw new CafeteriaError(
        "Failed to fetch menu availability",
        CAFETERIA_ERROR_CODES.MENU_FETCH_FAILED,
        error,
      );
    }
  }

  async registerCafeteria(data: RegisterCafeteriaRequest): Promise<Cafeteria> {
    try {
      const response = await this.dataSource.registerCafeteria(data);

      if (!response) {
        throw new CafeteriaError(
          "Register cafeteria response is null",
          CAFETERIA_ERROR_CODES.INVALID_CAFETERIA_DATA,
        );
      }

      return registerCafeteriaResponseToDomain(response);
    } catch (error) {
      if (error instanceof CafeteriaError) {
        throw error;
      }

      throw new CafeteriaError(
        "Failed to register cafeteria",
        CAFETERIA_ERROR_CODES.SERVER_ERROR,
        error,
      );
    }
  }

  async registerCafeteriaMenu(
    data: RegisterCafeteriaMenuRequest,
  ): Promise<CafeteriaMenu> {
    try {
      const response = await this.dataSource.registerCafeteriaMenu(data);

      if (!response) {
        throw new CafeteriaError(
          "Register cafeteria menu response is null",
          CAFETERIA_ERROR_CODES.INVALID_MENU_DATA,
        );
      }

      return registerCafeteriaMenuResponseToDomain(response);
    } catch (error) {
      if (error instanceof CafeteriaError) {
        throw error;
      }

      throw new CafeteriaError(
        "Failed to register cafeteria menu",
        CAFETERIA_ERROR_CODES.SERVER_ERROR,
        error,
      );
    }
  }
}
