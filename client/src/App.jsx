import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './componets/Header';
import Footer from './componets/Footer';
import Home from './Page/Home';
import ProductListing from './Page/ProductListing';
import ProductDetails from './Page/ProductDetails';
import { createContext, useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ProductZoom from './componets/ProductZoom';
import { IoCloseSharp } from 'react-icons/io5';
import ProductDetailsComponent from './componets/ProductDetails';
import Login from './Page/Login';
import Register from './Page/Register';
import CartPage from './Page/Cart';

const MyContext = createContext();

function App() {
  const [openCartPanel, setOpenCartPanel] = useState(false);

  const [openProductDetailsModal, setOpenProductDetailsModal] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState('lg');

  // const handleClickOpenProductDetailsModal = () => {
  //   setOpenProductDetailsModal(true);
  // };

  const toggleCartPanel = (newOpen) => () => {
    setOpenCartPanel(newOpen);
  };

  const handleCloseProductDetailsModal = () => {
    setOpenProductDetailsModal(false);
  };

  const values = {
    setOpenProductDetailsModal,
    setOpenCartPanel,
    openCartPanel,
    toggleCartPanel,
  };

  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={values}>
          <Header />
          <Routes>
            <Route path={'/'} exact={true} element={<Home />} />
            <Route path={'/ProductListing'} exact={true} element={<ProductListing />} />
            <Route path={'/Product/:id'} exact={true} element={<ProductDetails />} />
            <Route path={'/login'} exact={true} element={<Login />} />
            <Route path={'/Register'} exact={true} element={<Register />} />
            <Route path={'/cart'} exact={true} element={<CartPage />} />
          </Routes>
          <Footer />
        </MyContext.Provider>
      </BrowserRouter>

      <Dialog
        open={openProductDetailsModal}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        onClose={handleCloseProductDetailsModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="productDetailsModal"
      >
        <DialogContent>
          <div className="flex items-center w-full productDetailsModalContainer relative">
            <Button
              className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] 
            !absolute top-[15px] right-[15px] !bg-[#f1f1f1]"
            >
              <IoCloseSharp className="text-[20px]" onClick={handleCloseProductDetailsModal} />
            </Button>
            <div className="col1 w-[40%] px-3">
              <ProductZoom />
            </div>
            <div className="col2 w-[60%] py-8 px-8 pr-16 productContainer">
              <ProductDetailsComponent />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default App;

export { MyContext };
