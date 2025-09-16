export interface Client {
  _id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  industry: string;
  country: string;
  taxId?: string;
  paymentTerms?: string;
  notes?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
