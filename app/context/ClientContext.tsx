'use client';

import { createContext, useContext } from "react";
import { Client } from "./client";

interface ClientContext {
    clients: Client[];
    addClient: (clients: Client) => void;
}

export const ClientContext = createContext<ClientContext>({
    clients: [],
    addClient(client) {}
})

export const useClientContext = () => useContext(ClientContext);