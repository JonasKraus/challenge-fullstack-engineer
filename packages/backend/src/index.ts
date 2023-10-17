import dotenv from "dotenv";
import { Server } from "./Server"; // Import the 'cors' middleware

dotenv.config();

const port = process.env.PORT || 3000;

const app = Server.getServer();
app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
