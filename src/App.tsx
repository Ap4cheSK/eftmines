import { HashRouter, Routes, Route } from 'react-router-dom';
// import { useEffect } from 'react';
import Homepage from './components/Homepage';
import "./css/main.css";

function App() {
	return (
		<>
			<HashRouter>
				<Routes>
					<Route index path='/' element={<Homepage />} />
					{/* <Route path='/game' element={<GamePage />} />
					<Route path='/win' element={<WinScreen />} />
					<Route path='/lost' element={<LostScreen />} /> */}
				</Routes>
			</HashRouter>
		</>
	);
}

export default App;