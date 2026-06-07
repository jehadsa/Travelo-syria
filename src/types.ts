/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'ar' | 'en';

export type Category = 'hotels' | 'cars' | 'restaurants' | 'apartments';

// القيم القديمة اللي بتيجي من بعض الحجوزات المحفوظة
export type BookingType = Category | 'car' | 'restaurant' | 'holder';

export interface User {
  name: string;
  email: string;
  phone?: string;
}

export interface Notification {
  id: string;
  message: string;
  message_en: string;
  type: 'accepted' | 'rejected' | 'welcome';
  read: boolean;
  date: string;
}

export interface Trip {
  id: string;
  category: Category;
  title: string;
  title_en: string;
  subtitle: string;
  subtitle_en: string;
  description?: string;
  description_en?: string;
  image: string;
  images: string[];
  price: string;
  locationName?: string;
  locationName_en?: string;
  hotelLocation?: string;
  restaurantLocation?: string;
  adminRating?: string;
  isBooked: boolean;
  companyName?: string;
  companyName_en?: string;
  companyId?: string;
  companyPrice?: string; // بيبقى string دايماً
  pendingApproval?: boolean;
  carPriceWithDriver?: string;
  carCostWithDriver?: string;
  carPriceWithoutDriver?: string;
  carCostWithoutDriver?: string;
  services: string[];
  services_en: string[];
  bedType?: string;
}

export interface Booking {
  id: string;
  tripId: string;
  tripTitle: string;
  tripTitleEn: string;
  bookingType: BookingType; // ← التعديل هون
  userEmail: string;
  date: string;
  status: 'pending' | 'accepted' | 'rejected';
  details: {
    fullName: string;
    phone: string;
    guestCount?: string;
    days?: number;
    nationality?: string;
    maritalStatus?: string;
    driverOption?: 'with_driver' | 'without_driver';
    driverPrice?: number;
    totalPrice?: number;
    idImage?: string | null;
    passportImage?: string | null;
    familyImage?: string | null;
    contractImage?: string | null;
  };
}

export interface ToastMessage {
  id: string;
  icon: string;
  title: string;
  titleEn: string;
  body: string;
  bodyEn: string;
  color: string;
}