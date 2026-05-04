export type GradeType = 'BEST' | 'GOOD' | 'AVERAGE' | 'REJECT';
export type UserRole = 'HOUSEHOLD' | 'DRIVER' | 'ADMIN';
export type BatchStatus = 'FERMENTING' | 'MATURING' | 'READY' | 'BOTTLED';
export type SubscriptionTier = 'STARTER' | 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';

export interface Society {
  id: string;
  name: string;
  city: string;
  rwa_contact_name?: string;
  rwa_contact_phone?: string;
  subscription_tier: SubscriptionTier;
  monthly_fee: number;
  total_flats: number;
  is_active: boolean;
  created_at: string;
}

export interface Household {
  id: string;
  flat_number: string;
  resident_name: string;
  phone: string;
  society_id: string;
  static_qr_token: string;
  auth_user_id?: string;
  push_subscription?: any;
  onboarded_at: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  auth_user_id?: string;
  vehicle_id?: string;
  assigned_society_ids: string[];
  push_subscription?: any;
  created_at: string;
}

export interface Collection {
  id: string;
  household_id: string;
  driver_id?: string;
  society_id?: string;
  collected_at: string;
  weight_kg: number;
  grade: GradeType;
  quality_multiplier: number;
  credits_earned: number;
  rejection_reason?: string;
}

export interface CreditWallet {
  id: string;
  household_id: string;
  balance: number;
  lifetime_earned: number;
  lifetime_redeemed: number;
  current_streak_weeks: number;
  last_collection_date?: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  household_id?: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  metadata: any;
  created_at: string;
}
