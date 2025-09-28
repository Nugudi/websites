export interface CafeteriaRequestData {
  id?: string;
  name: string;
  address: string;
  detailAddress: string;
  openingHours: string;
  review?: string;
  imageUrl?: string;
  status?: "pending" | "approved" | "rejected";
  createdAt?: string;
  updatedAt?: string;
}

export interface RequestRegisterStep {
  id: number;
  title: string;
  description?: string;
}
