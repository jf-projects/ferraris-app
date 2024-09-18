import { createContext, useContext } from "react";

// Define the ClientProps interface
interface ClientProps {
  id?: number;
  firstName: string;
  lastName: string;
  address: string;
  gender: string;
  civilStatus: string;
  email: string;
  bday: string;
  spouseFirstName: string;
  spouseLastName: string;
  spouseMiddleName: string;
  clientNumber: string;
  middleName: string;
  image: string;
  client_id: string;
}

// Create a context with the type ClientProps or undefined
export const ClientContext = createContext<ClientProps | undefined>(undefined);

// Custom hook to use the ClientContext
export function useClientContext(): ClientProps {
  const client = useContext(ClientContext);

  if (client === undefined) {
    throw new Error('useClientContext must be used within a ClientContext.Provider');
  }

  return client;
}
