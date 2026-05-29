```jsx
import { useEffect, useState } from "react";
import {
  getTickets,
  createTicket,
  deleteTicket,
  updateTicket,
} from "./api/tickets";

function App() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    subject: "",
    description: "",
    priority: "medium",
  });

  // =========================
  // FETCH TICKETS
  // =========================

  const fetchTickets = async () => {
    try {
      const res = await getTickets();
      setTickets(res.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // CREATE TICKET
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createTicket(formData);

      setFormData({
        customer_name: "",
        customer_email: "",
        subject: "",
        description: "",
        priority: "medium",
      });

      fetchTickets();
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  // =========================
  // DELETE TICKET
  // =========================

  const handleDelete = async (id) => {
    try {
      await deleteTicket(id);
      fetchTickets();
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  // =========================
  // TOGGLE STATUS
  // =========================

  const toggleStatus = async (ticket) => {
    try {
      await updateTicket(ticket.id, {
        ...ticket,
        status: ticket.status === "open" ? "closed" : "open",
      });

      fetchTickets();
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  // =========================
  // FILTER TICKETS
  // =========================

  const filteredTickets = tickets.filter((ticket) => {
    const subject = ticket.subject || "";
    const customer = ticket.customer_name || "";

    return (
      subject.toLowerCase().includes(search.toLowerCase()) ||
      customer.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-[#050816] text-white">

      {/* ================= HEADER ================= */}

      <div className="relative flex items-center justify-between px-6 py-4 border-b border-white/10">

        <div className="w-10"></div>

        <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-semibold tracking-wide text-white/90">
          Support CRM
        </h1>

        <button
          onClick={() => setSearchOpen(true)}
          className="group relative w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition"
        >
          <span className="absolute inset-0 rounded-full bg-blue-500/10 opacity-0 group-hover:opacity-100 transition" />

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-white/70 group-hover:text-white transition"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </div>

      {/* ================= SEARCH MODAL ================= */}

      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          <div
            onClick={() => setSearchOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          <input
            autoFocus
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="z-10 w-[420px] rounded-xl border border-white/10 bg-[#111827] p-4 text-lg outline-none"
          />
        </div>
      )}

      {/* ================= MAIN CONTENT ================= */}

      <div className="p-6 max-w-6xl mx-auto">

        {/* ================= FORM ================= */}

        <form
          className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-lg"
          onSubmit={handleSubmit}
        >

          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="text"
              name="customer_name"
              placeholder="Customer Name"
              value={formData.customer_name}
              onChange={handleChange}
              className="p-3 rounded-lg bg-black/30 border border-white/10 outline-none"
              required
            />

            <input
              type="email"
              name="customer_email"
              placeholder="Customer Email"
              value={formData.customer_email}
              onChange={handleChange}
              className="p-3 rounded-lg bg-black/30 border border-white/10 outline-none"
              required
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              className="p-3 rounded-lg bg-black/30 border border-white/10 outline-none"
              required
            />

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="p-3 rounded-lg bg-black/30 border border-white/10 outline-none"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <textarea
            name="description"
            placeholder="Ticket Description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full mt-4 p-3 rounded-lg bg-black/30 border border-white/10 outline-none"
            required
          />

          <button
            type="submit"
            className="mt-5 px-5 py-3 rounded-xl bg-white text-black font-medium hover:opacity-90 transition"
          >
            Create Ticket
          </button>
        </form>

        {/* ================= TICKET LIST ================= */}

        <div className="grid gap-5">

          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg"
            >

              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                <div
                  className="cursor-pointer"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <h2 className="text-xl font-semibold text-white/90">
                    {ticket.subject}
                  </h2>

                  <p className="text-white/60 mt-1">
                    {ticket.customer_name}
                  </p>

                  <p className="text-white/40 text-sm">
                    {ticket.customer_email}
                  </p>
                </div>

                <div className="flex gap-3">

                  <button
                    onClick={() => toggleStatus(ticket)}
                    className="px-4 py-2 rounded-full text-sm bg-blue-500/20 border border-blue-400/20"
                  >
                    {ticket.status}
                  </button>

                  <button
                    onClick={() => handleDelete(ticket.id)}
                    className="px-4 py-2 rounded-full text-sm bg-red-500/20 border border-red-400/20"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="mt-5 text-white/70 leading-relaxed">
                {ticket.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= TICKET MODAL ================= */}

      {selectedTicket && (
        <div
          onClick={() => setSelectedTicket(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#111827] border border-white/10 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-semibold mb-3">
              {selectedTicket.subject}
            </h2>

            <p className="text-white/60 mb-2">
              {selectedTicket.customer_name}
            </p>

            <p className="text-white/40 text-sm mb-6">
              {selectedTicket.customer_email}
            </p>

            <p className="text-white/70 leading-relaxed">
              {selectedTicket.description}
            </p>

            <button
              onClick={() => setSelectedTicket(null)}
              className="mt-6 px-4 py-2 rounded-lg bg-white text-black"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
```
