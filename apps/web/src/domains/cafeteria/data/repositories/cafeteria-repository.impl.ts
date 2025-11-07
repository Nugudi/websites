/**
 * Cafeteria Repository Implementation
 */

import type { PageInfo } from "@shared/domain/entities";
import type {
  Cafeteria,
  CafeteriaMenu,
  CafeteriaMenuTimeline,
  MenuAvailability,
} from "../../domain/entities";
import type { CafeteriaRepository } from "../../domain/repositories";
import type { CafeteriaRemoteDataSource } from "../data-sources";
import type {
  GetCafeteriaMenuTimelineResponse,
  RegisterCafeteriaMenuRequest,
  RegisterCafeteriaRequest,
} from "../dto";
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
      throw this.handleError(error, "Failed to fetch cafeterias with menu");
    }
  }

  async getCafeteriaById(id: string): Promise<Cafeteria> {
    try {
      const response = await this.dataSource.getCafeteriaById(id);

      if (!response) {
        throw new Error("Cafeteria response is null");
      }

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
      const response = await this.dataSource.getCafeteriaMenuByDate(id, date);

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
      const response = await this.dataSource.getCafeteriaMenuAvailability(
        id,
        params,
      );

      return getCafeteriaMenuAvailabilityResponseToDomain(response);
    } catch (error) {
      throw this.handleError(error, "Failed to fetch menu availability");
    }
  }

  async registerCafeteria(data: RegisterCafeteriaRequest): Promise<Cafeteria> {
    try {
      const response = await this.dataSource.registerCafeteria(data);

      if (!response) {
        throw new Error("Register cafeteria response is null");
      }

      return registerCafeteriaResponseToDomain(response);
    } catch (error) {
      throw this.handleError(error, "Failed to register cafeteria");
    }
  }

  async registerCafeteriaMenu(
    data: RegisterCafeteriaMenuRequest,
  ): Promise<CafeteriaMenu> {
    try {
      const response = await this.dataSource.registerCafeteriaMenu(data);

      if (!response) {
        throw new Error("Register cafeteria menu response is null");
      }

      return registerCafeteriaMenuResponseToDomain(response);
    } catch (error) {
      throw this.handleError(error, "Failed to register cafeteria menu");
    }
  }

  private handleError(error: unknown, message: string): Error {
    if (error instanceof Error) {
      return new Error(`${message}: ${error.message}`);
    }
    return new Error(message);
  }
}
