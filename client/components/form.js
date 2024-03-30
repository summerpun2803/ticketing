import { useState } from "react"

import useRequest from "../hooks/use-request";

const AuthForm = ({ reqBody, onSuccess, text }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { doRequest, errors } = useRequest({
        url: reqBody.url,
        method: reqBody.method,
        body: {
            email , password
        },
        onSuccess
    });

    const onSubmit = async (e) => {
        e.preventDefault();

        await doRequest();
    }

    return ( 
        <form onSubmit={onSubmit}>
            <h1>{text}</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input
                    className="form-control"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            {errors}
            <button className="btn btn-primary">{text}</button>
        </form>
     );
}
 
export default AuthForm;