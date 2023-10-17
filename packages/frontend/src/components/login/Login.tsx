import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_ROUTES } from "@challenge/utils";

function Login() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [isValid, setValid] = useState(true);
	const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

	const handleLogin = () => {
		console.info("aaa");
		console.info(BACKEND_ROUTES.ORDERS);
		console.info("aaa")
		navigate(BACKEND_ROUTES.ORDERS.replace(":email", email));
	};

	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
		setValid(emailRegex.test(e.target.value));
		isValid && setEmail(e.target.value);
	};

	return (
		<div>
			<input
				placeholder="E-Mail"
				type="email"
				value={email}
				required
				onChange={handleEmailChange}
			/>
			<button disabled={!isValid} onClick={handleLogin}>
				Send
			</button>
			{!isValid && (
				<p style={{ color: 'red' }}>Please enter valid email</p>
			)}
		</div>
	);
}

export default Login;
