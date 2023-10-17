import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_ROUTES } from "@challenge/utils";
import "./login.css";

function Login() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [isValid, setValid] = useState(false);
	const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

	const handleLogin = () => {
		navigate(BACKEND_ROUTES.ORDERS.replace(":email", email));
	};

	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
		setValid(emailRegex.test(e.target.value));
		setEmail(e.target.value);
	};

	return (
		<div className={"container"}>
			<div className={"content"}>
				<p>Enter email</p>
				<div className={"row"}>
					<input
						placeholder="E-Mail"
						type="email"
						value={email}
						required
						onChange={handleEmailChange}
					/>
					<button
						className={"login_button"}
						disabled={!isValid}
						onClick={handleLogin}
					>
						Send
					</button>
				</div>
				<div className={"row"}>
					{!isValid ? (
						<p style={{ color: "red" }}>Please enter valid email</p>
					) : <p>Email is in correct format</p>}
				</div>
			</div>
		</div>
	);
}

export default Login;
