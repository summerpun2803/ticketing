
import Link from "next/link";
import buildClient from "../api/build-client";

const LandingPage = ({ currentUser, tickets }) => {
    console.log(tickets);
    
    const ticketList = Array.isArray(tickets?.tickets) ? tickets.tickets.map((ticket) => {
        return (
          <tr key={ticket.id}>
            <td>{ticket.title}</td>
            <td>$ {ticket.price} </td>
            <td>
                <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
                    View
                </ Link>
            </td>    
          </tr>
        );
      }): null;
    
    return (
        <div>
            <h1>Tickets</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody>{ticketList}</tbody>
            </table>
        </div>
    );
};

LandingPage.getInitialProps = async (context, client , currentUser) => {
    const { data } = await client.get('/api/tickets');
    
    
    return { tickets: data };
}
 
export default LandingPage;

