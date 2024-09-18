export interface ClientData {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  address?: string;
  gender?: string;
  civilStatus?: string;
}

export interface ClientContextType {
  clientData: ClientData | null;
}
