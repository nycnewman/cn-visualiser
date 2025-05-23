import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UpdatesListing from './components/UpdatesListing.tsx';
import UpdatesDetail from './components/UpdatesDetail.tsx';

const App: React.FC = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/cn-visualiser" element={<UpdatesListing  />} />
                <Route path="/cn-visualiser/:update_id" element={<UpdatesDetail />} />
            </Routes>
        </BrowserRouter>  );
}

export default App;


