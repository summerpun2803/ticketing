import axios from "axios"
import { useState } from "react"

export default ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async(props = {}) => {
        try {
            setErrors(null);
            const response = await axios[method](url, {...body , ...props});

            if (onSuccess) {
                console.log(response.data);
                onSuccess(response.data);
            }
            return response.body;
        } catch (err) {
            setErrors(
                <div className="alert alert-danger">
                    <h4>Ooops..</h4>
                    <ul className="my-0">
                        {err.response?.data?.errors?.map(err => (
                            <li key={err.message}>{err.message}</li>
                        ))}
                    </ul>
                </div>
            )
            console.log(err);
        }
    }

    return { doRequest, errors };
}