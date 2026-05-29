
import axios from "axios";

const API = axios.create({
  baseURL: "https://support-crm-backend-b82w.onrender.com/api",
});

// GET ALL TICKETS
export const getTickets = () => {
  return API.get("/tickets/");
};

// CREATE TICKET
export const createTicket = (data) => {
  return API.post("/tickets/", data);
};

// UPDATE TICKET
export const updateTicket = (id, data) => {
  return API.put(`/tickets/${id}/`, data);
};

// DELETE TICKET
export const deleteTicket = (id) => {
  return API.delete(`/tickets/${id}/`);
};

