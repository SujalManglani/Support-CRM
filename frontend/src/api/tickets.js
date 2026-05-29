import axios from "axios";

const API = axios.create({
  baseURL: "https://support-crm-backend-b82w.onrender.com",
});

// ======================
// GET TICKETS
// ======================

export const getTickets = () => API.get("/tickets/");

// ======================
// CREATE TICKET
// ======================

export const createTicket = (data) =>
  API.post("/tickets/", data);

// ======================
// UPDATE TICKET
// ======================

export const updateTicket = (id, data) =>
  API.put(`/tickets/${id}/`, data);

// ======================
// DELETE TICKET
// ======================

export const deleteTicket = (id) =>
  API.delete(`/tickets/${id}/`);

