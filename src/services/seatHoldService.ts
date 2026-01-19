import axios from "axios";
import { API_ROUTES } from "./api-route";

export interface HeldSeatsResponse {
  success: boolean;
  heldSeats: string[];
  tripId: string;
  carId: string;
  message?: string;
}

export interface BookedSeatsResponse {
  success: boolean;
  bookedSeats: string[];
  tripId: string;
  carId: string;
  message?: string;
}

export const seatHoldService = {
  async getHeldSeats(tripId: string, carId: string): Promise<string[]> {
    try {
      const response = await axios.get<HeldSeatsResponse>(
        `${API_ROUTES.BASE_URL}/api/seats/held/${tripId}/${carId}`
      );

      if (response.data.success) {
        return response.data.heldSeats;
      } else {
        console.error("Failed to fetch held seats:", response.data.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching held seats:", error);
      return [];
    }
  },

  // Get booked seats for a specific trip and car
  async getBookedSeats(tripId: string, carId: string): Promise<string[]> {
    try {
      const response = await axios.get<BookedSeatsResponse>(
        `${API_ROUTES.BASE_URL}/api/seats/booked/${tripId}/${carId}`
      );

      if (response.data.success) {
        return response.data.bookedSeats;
      } else {
        console.error("Failed to fetch booked seats:", response.data.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching booked seats:", error);
      return [];
    }
  },
};
