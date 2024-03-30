import { useEffect, useState } from "react";
import StripeCheckout from 'react-stripe-checkout';
import useRequest from "../../hooks/use-request";
import { useRouter } from "next/router";

const OrderShow = ({ order,currentUser }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const router = useRouter();

    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: () => router.push('/orders')
    });
    
    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000))
        };

        findTimeLeft();
        setInterval(findTimeLeft, 1000);
    }, [order]);

    if (timeLeft < 0) {
        return <div> Order Expired</div>
    }

    return ( 
        <div>
            {timeLeft} seconds until order expires

            <StripeCheckout
                token={({id}) => doRequest({token:id})}
                stripeKey="pk_test_51OtyrASGNIcO1dJEKOckVVwo3zvJPbFbBBn9IpzmX0rQWcGuXmb2iu005Fek1kOarVGsuPe2vMCq6LrcHnohB8XI007j0P2ehQ"
                amount={order.ticket.price * 100}
                email={currentUser.email}
            />
            {errors}
        </div>
     );
}
OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/order/${orderId}`);
    console.log(data);
    return { order: data };
}
 
export default OrderShow;