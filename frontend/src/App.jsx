import { useEffect, useState } from "react";
import { getTickets, createTicket, deleteTicket } from "./api/tickets";

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

  const fetchTickets = async () => {
    const res = await getTickets();
    setTickets(res.data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTicket(formData);

    setFormData({
      customer_name: "",
      customer_email: "",
      subject: "",
      description: "",
      priority: "medium",
    });

    fetchTickets();
  };

  const handleDelete = async (id) => {
    await deleteTicket(id);
    fetchTickets();
  };

  const toggleStatus = async (ticket) => {
    await createTicket({
      ...ticket,
      status: ticket.status === "open" ? "closed" : "open",
    });
    fetchTickets();
  };

  const filteredTickets = tickets.filter((t) =>
    (t.subject || "").toLowerCase().includes(search.toLowerCase()) ||
    (t.customer_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen text-white relative">

      <div className="relative flex items-center justify-between px-6 py-4 border-b border-white/10">

        <div className="w-10" />

        <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold text-white/90">
          Support CRM
        </h1>

       <button
  onClick={() => setSearchOpen(true)}
  className="group relative w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition"
>

  {/* glow ring */}
  <span className="absolute inset-0 rounded-full bg-blue-500/10 opacity-0 group-hover:opacity-100 transition" />

  {/* icon */}
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
            className="glass p-4 w-[420px] text-lg z-10 rounded-xl"
          />

        </div>
      )}

      <div className="p-6">

        <form className="glass p-6 mb-6" onSubmit={handleSubmit}>

          <div className="grid grid-cols-2 gap-4">

            <input
              name="customer_name"
              placeholder="Customer Name"
              value={formData.customer_name}
              onChange={handleChange}
              className="p-3 rounded-lg"
            />

            <input
              name="customer_email"
              placeholder="Customer Email"
              value={formData.customer_email}
              onChange={handleChange}
              className="p-3 rounded-lg"
            />

            <input
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              className="p-3 rounded-lg"
            />

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="p-3 rounded-lg"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

          </div>

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full mt-4 p-3 rounded-lg"
          />

          <button className="mt-4 px-5 py-2 bg-white text-black rounded-lg">
            Create Ticket
          </button>

        </form>

        <div className="grid gap-4">

          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="glass p-6">

              <div className="flex justify-between items-start">

                <div
                  className="cursor-pointer"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <h2 className="text-lg font-semibold text-white/90">
                    {ticket.subject}
                  </h2>

                  <p className="text-white/60 mt-1">
                    {ticket.customer_name}
                  </p>

                  <p className="text-white/40 text-sm">
                    {ticket.customer_email}
                  </p>
                </div>

                <div className="flex gap-2">

                  <button
                    onClick={() => toggleStatus(ticket)}
                    className="px-4 py-1.5 text-sm rounded-full bg-blue-600/20 border border-blue-400/20"
                  >
                    {ticket.status}
                  </button>

                  <button
                    onClick={() => handleDelete(ticket.id)}
                    className="px-3 py-1.5 text-sm rounded-full bg-red-600/20 border border-red-400/20"
                  >
                    Delete
                  </button>

                </div>

              </div>

              <p className="mt-4 text-white/70">
                {ticket.description}
              </p>

            </div>
          ))}

        </div>

      </div>

      {selectedTicket && (
        <div
          onClick={() => setSelectedTicket(null)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center"
        >
          <div className="glass p-6 w-[420px]">

            <h2 className="text-xl font-semibold mb-2">
              {selectedTicket.subject}
            </h2>

            <p className="text-white/60">
              {selectedTicket.description}
            </p>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;