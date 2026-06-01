const API_URL = "http://127.0.0.1:8000";

// FORM SUBMIT
document.getElementById("ticketForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const ticket = {
        customer_name: document.getElementById("customer_name").value,
        customer_email: document.getElementById("customer_email").value,
        subject: document.getElementById("subject").value,
        description: document.getElementById("description").value
    };

    try {
        const response = await fetch(`${API_URL}/tickets`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ticket)
        });

        if (!response.ok) throw new Error("Failed to create ticket");

        const data = await response.json();

        alert("Ticket Created! ID: " + data.id);

        document.getElementById("ticketForm").reset();

        loadTickets();

    } catch (error) {
        alert("Error creating ticket");
        console.error(error);
    }
});

// BUTTON CLICK
document.getElementById("loadBtn").addEventListener("click", loadTickets);

// LOAD TICKETS
async function loadTickets() {
    try {
        const response = await fetch(`${API_URL}/tickets`);

        if (!response.ok) throw new Error("Failed to fetch tickets");

        const tickets = await response.json();

        const ticketsDiv = document.getElementById("tickets");
        ticketsDiv.innerHTML = "";

        if (tickets.length === 0) {
            ticketsDiv.innerHTML = "<p>No tickets found</p>";
            return;
        }

        tickets.forEach(ticket => {
            ticketsDiv.innerHTML += `
                <div class="ticket">
                    <h3>${ticket.subject}</h3>
                    <p><b>ID:</b> ${ticket.id}</p>
                    <p><b>Name:</b> ${ticket.customer_name}</p>
                    <p><b>Email:</b> ${ticket.customer_email}</p>
                    <p><b>Status:</b> ${ticket.status}</p>
                    <p>${ticket.description}</p>
                </div>
            `;
        });

    } catch (error) {
        alert("Error loading tickets");
        console.error(error);
    }
}