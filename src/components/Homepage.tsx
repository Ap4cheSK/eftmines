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
					<Link to={"/game/0"} className="LinkButton" aria-label="Play game">Easy (8x8)</Link>
					<Link to={"/game/1"} className="LinkButton" aria-label="Play game">Medium (12x8)</Link>
					<Link to={"/game/2"} className="LinkButton" aria-label="Play game">Hard (12x12)</Link>
					<button onClick={redirect} className="LinkButton" aria-label="Back to Tarkovbot.eu">TarkovBOT.eu</button>
				</nav>
				<p className="game-version">Version 1.0.0</p>
			</main>
			<div></div>
		</>
	);
}

export default Homepage;