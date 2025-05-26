import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UpdatesListing from './components/UpdatesListing.tsx';
import UpdatesDetail from './components/UpdatesDetail.tsx';
import Test from './components/Test';

const App: React.FC = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/cn-visualiser" element={<UpdatesListing  />} />
                <Route path="/cn-visualiser/:update_id" element={<UpdatesDetail />} />
                <Route path="/cn-visualiser/test" element={<Test />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;


