import { Link } from "react-router-dom";

interface AppHeaderFormat {
	homeBtn?: boolean;
}

function HomeBtn() {
	return (
		<Link to={"/"} aria-label="To Homepage" className="LinkButton" id="to-home-btn">
			<i className="fa-solid fa-house-chimney"></i>
		</Link>
	);
}

function VoidBtn() {
	return (
		<div className="app-header-spacer"></div>
	);
}

function AppHeader(params: AppHeaderFormat) {
	return (
		<header>
			{params.homeBtn ? <HomeBtn/> : <VoidBtn/>}
			<section className="app-name">
				<h1>Minesweeper</h1>
				<h2><span className="app-normal">by</span> <span className="app-white">TarkovBOT.eu</span></h2>
			</section>
			<div className="app-header-spacer"></div>
		</header>
	);
}

export default AppHeader;