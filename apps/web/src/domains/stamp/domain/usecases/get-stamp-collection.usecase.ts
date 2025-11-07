import type { StampCollection } from "../entities/stamp.entity";
import type { StampRepository } from "../repositories/stamp-repository.interface";

export interface GetStampCollectionUseCase {
  execute(): Promise<StampCollection>;
}

export class GetStampCollectionUseCaseImpl
  implements GetStampCollectionUseCase
{
  constructor(private readonly stampRepository: StampRepository) {}

  async execute(): Promise<StampCollection> {
    return await this.stampRepository.getStampCollection();
  }
}
