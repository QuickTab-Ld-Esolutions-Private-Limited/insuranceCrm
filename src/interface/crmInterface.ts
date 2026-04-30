export interface IInsuranceRecord {
  id: string;
  customerName: string;
  regNo: string;
  policyNo: string;
  mobileNo: string;
  email: string;
  status: string;
  policyDate: Date;
  expiryDate: Date;
  createdAt: Date;
}
