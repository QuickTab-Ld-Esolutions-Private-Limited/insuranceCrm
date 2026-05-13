export interface IInsuranceRecord {
  id: string;
  customerName: string;
  regNo: string;
  policyNo: string;
  mobileNo: string;
  email: string;
  status: "active" | "renewed" | "expired";
  policyDate: string;
  expiryDate: string;
  entryAt: string;
  createdAt: string;
}

export interface IUpdateInsuranceRecord extends Partial<IInsuranceRecord> {
  id: string;
}

export interface IApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: IInsuranceRecord[];
}
