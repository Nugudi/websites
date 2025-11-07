import type { CreateReviewRequest, Review } from "../entities";
import type { CafeteriaReviewRepository } from "../repositories";

export interface CreateReviewUseCase {
  execute(data: CreateReviewRequest): Promise<Review>;
}

export class CreateReviewUseCaseImpl implements CreateReviewUseCase {
  constructor(private readonly repository: CafeteriaReviewRepository) {}

  async execute(data: CreateReviewRequest): Promise<Review> {
    if (!data.restaurantId) {
      throw new Error("Restaurant ID is required");
    }
    if (!data.reviewDate) {
      throw new Error("Review date is required");
    }
    if (!data.tasteTypeId) {
      throw new Error("Taste type is required");
    }

    return this.repository.createReview(data);
  }
}
