import { HashRouter, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import GamePage from './components/GamePage';
import "./css/main.css";

function App() {
	return (
		<>
			<HashRouter>
				<Routes>
					<Route index path='/' element={<Homepage/>} />
					<Route path='/game/:difficulty' element={<GamePage/>} />
				</Routes>
			</HashRouter>
		</>
	);
}

export default App;