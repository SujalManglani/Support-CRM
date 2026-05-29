import { useEffect, useState } from "react";
import {
  getTickets,
  createTicket,
  deleteTicket,
} from "./api/tickets";

function App() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");

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
    } catch (err) {
      console.error("Error fetching tickets:", err);
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

    } catch (err) {
      console.error("Create ticket error:", err);
    }
  };

  // =========================
  // DELETE TICKET
  // =========================

  const handleDelete = async (id) => {
    try {
      await deleteTicket(id);
      fetchTickets();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // =========================
  // SEARCH FILTER
  // =========================

  const filteredTickets = tickets.filter((ticket) => {
    return (
      ticket.subject?.toLowerCase().includes(search.toLowerCase()) ||
      ticket.customer_name?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-[#050816] text-white">

      {/* ================= HEADER ================= */}

      <div className="border-b border-white/10 px-6 py-5 flex items-center justify-center">

        <h1 className="text-3xl font-bold tracking-wide">
          Support CRM
        </h1>

      </div>

      {/* ================= MAIN ================= */}

      <div className="max-w-5xl mx-auto p-6">

        {/* ================= SEARCH ================= */}

        <div className="mb-6">

          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-4 rounded-xl bg-[#111827] border border-white/10 outline-none text-white"
          />

        </div>

        {/* ================= FORM ================= */}

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-lg"
        >

          <div className="grid md:grid-cols-2 gap-4">

            {/* CUSTOMER NAME */}

            <input
              type="text"
              name="customer_name"
              placeholder="Customer Name"
              value={formData.customer_name}
              onChange={handleChange}
              className="p-3 rounded-lg bg-[#111827] border border-white/10 outline-none"
              required
            />

            {/* CUSTOMER EMAIL */}

            <input
              type="email"
              name="customer_email"
              placeholder="Customer Email"
              value={formData.customer_email}
              onChange={handleChange}
              className="p-3 rounded-lg bg-[#111827] border border-white/10 outline-none"
              required
            />

            {/* SUBJECT */}

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              className="p-3 rounded-lg bg-[#111827] border border-white/10 outline-none"
              required
            />

            {/* PRIORITY */}

            <div className="relative">

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="
                  w-full
                  p-3
                  rounded-lg
                  bg-[#111827]
                  border
                  border-white/10
                  text-white
                  outline-none
                  appearance-none
                  pr-10
                "
              >

                <option
                  className="bg-[#111827] text-white"
                  value="low"
                >
                  Low Priority
                </option>

                <option
                  className="bg-[#111827] text-white"
                  value="medium"
                >
                  Medium Priority
                </option>

                <option
                  className="bg-[#111827] text-white"
                  value="high"
                >
                  High Priority
                </option>

              </select>

              {/* DROPDOWN ICON */}

              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white/70">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>

              </div>

            </div>

          </div>

          {/* DESCRIPTION */}

          <textarea
            name="description"
            placeholder="Ticket Description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className="w-full mt-4 p-3 rounded-lg bg-[#111827] border border-white/10 outline-none"
            required
          />

          {/* BUTTON */}

          <button
            type="submit"
            className="mt-5 px-6 py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90 transition"
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

                <div>

                  <h2 className="text-2xl font-semibold text-white/90">
                    {ticket.subject}
                  </h2>

                  <p className="text-white/60 mt-1">
                    {ticket.customer_name}
                  </p>

                  <p className="text-white/40 text-sm">
                    {ticket.customer_email}
                  </p>

                </div>

                <div className="flex items-center gap-3">

                  <div className="px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/20 text-sm">

                    {ticket.status}

                  </div>

                  <button
                    onClick={() => handleDelete(ticket.id)}
                    className="px-4 py-2 rounded-full bg-red-500/20 border border-red-400/20 text-sm hover:bg-red-500/30 transition"
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

    </div>
  );
}

export default App;

