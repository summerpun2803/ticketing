import Router from "next/router";
import AuthForm from "../../components/form";

export default () => {

    const reqBody = {
        url: '/api/users/signup',
        method : 'post'
    }
    const onSuccess = () => Router.push('/');
    return (
        <AuthForm reqBody={reqBody} onSuccess={onSuccess} text={"Sign Up"}/>
    );
}