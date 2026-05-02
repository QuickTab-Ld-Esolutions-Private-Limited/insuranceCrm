export interface IInsuranceRecord {
  id: string;
  customerName: string;
  regNo: string;
  policyNo: string;
  mobileNo: string;
  email: string;
  status: string;
  policyDate: string;
  expiryDate: string;
  entryAt: string;
  createdAt: string;
}

export interface IUpdateInsuranceRecord extends Partial<IInsuranceRecord> {
  id: string;
  mobileNo?: string;
  email?: string;
  status?: string;
  policyDate?: string;
  expiryDate?: string;
}
