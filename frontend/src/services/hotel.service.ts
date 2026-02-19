import { axiosApi } from "@/lib/axios";
import { Hotel } from "@/types";
import { ReservationCardProps } from "@/app/(personal)/profile/_components/trips/all";
export const getTrips = async () => {
  try {
    // const res = await axiosApi.get("");
    let reservationCards: ReservationCardProps[] = [
      {
        hotelName: "Hotel Tribute",
        image: "/hotels/hotel1.jpg",
        checkIn: "12 Mar 2026",
        checkOut: "18 Mar 2026",
        guests: "2 Adults",
        bookingId: "HT12345",
        status: "confirmed",
      },
      {
        hotelName: "Golden Tulip Resort",
        image: "/hotels/hotel2.jpg",
        checkIn: "05 Apr 2026",
        checkOut: "10 Apr 2026",
        guests: "4 Adults",
        bookingId: "GT56789",
        status: "pending",
      },
      {
        hotelName: "Grand Seaside Hotel",
        image: "/hotels/hotel3.jpg",
        checkIn: "20 May 2026",
        checkOut: "25 May 2026",
        guests: "3 Adults",
        bookingId: "GS24680",
        status: "confirmed",
      },
      {
        hotelName: "Mountain View Inn",
        image: "/hotels/hotel4.jpg",
        checkIn: "02 Jun 2026",
        checkOut: "07 Jun 2026",
        guests: "2 Adults · 1 Child",
        bookingId: "MV13579",
        status: "pending",
      },
    ];
    return reservationCards;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const getHotels = async (params?: any): Promise<Hotel[]> => {
  const response = await axiosApi.get("/hotels", { params });
  return response.data.data;
};

export const getHotelDetails = async (id: string): Promise<Hotel> => {
  const response = await axiosApi.get(`/hotels/${id}`);
  return response.data.data;
};

export const getHotelAvailability = async (
  id: string,
  checkIn: string,
  checkOut: string,
  adults: number,
  children: number,
): Promise<Hotel> => {
  const response = await axiosApi.get(`/hotels/${id}/availability`, {
    params: { checkIn, checkOut, adults, children },
  });

  return response.data.data;
};
