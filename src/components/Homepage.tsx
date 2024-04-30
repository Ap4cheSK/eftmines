import { Link } from "react-router-dom";
import AppHeader from "./AppHeader";

function Homepage() {
	function redirect() {
		window.location.assign("https://tarkovbot.eu/");
	}

	return (
		<>
			<AppHeader/>
			<main className="main-menu-container">
				<nav className="main-menu">
					<Link to={"/game"} className="LinkButton" aria-label="Play game">Play</Link>
					<button onClick={redirect} className="LinkButton" aria-label="Back to Tarkovbot.eu">TarkovBOT.eu</button>
				</nav>
				<p className="game-version">Version 1.0.0</p>
			</main>
			<div></div>
		</>
	);
}

export default Homepage;