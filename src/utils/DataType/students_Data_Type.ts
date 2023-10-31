
export interface ParentDetails {
  type: number;
  firstname: string;
  lastname: string;
  email: string;
  phone_country: string;
  phone: string;
}


export interface Student {
  id: number;
  firstname: string;
  lastname: string;
  franchise_name: string;
  status: number;
  feedback_flag: number;
  courier_flag: number;
  payment_flag: number;
  attendance_flag: number;
  meeting_flag: number;
  makeup_flag: number;
  parent_details: ParentDetails[];
  notes_flags: string[];
  joining_date: string;
}
