export interface PersonRole {
  id: number;
  type: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string | null;
  date_of_birth: string;
  gender_code: string;
  street: string;
  city: string;
  zip_code: string;
  created_at: string;
  updated_at: string;
  person_roles: PersonRole[];
}