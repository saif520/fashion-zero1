import React, { useContext, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Context } from "./main";
import OtpVerification from "./pages/OtpVerification";
import AllProduct from "./pages/AllProduct";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Success from "./pages/Success";
import Failure from "./pages/Failure";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import ReviewPage from "./pages/ReviewPage";
import Offer from "./pages/Offer";
import { Slide, Zoom, Flip, Bounce } from "react-toastify";


const App = () => {

  const {setIsAuthenticated,setUser}=useContext(Context);

  useEffect(()=>{
    const getUser=async()=>{
      await axios.get("http://localhost:8000/api/v1/user/me",{withCredentials:true}).then(res=>{
        setUser(res.data.user);
        setIsAuthenticated(true);
      }).catch(err=>{
        setUser(null);
        setIsAuthenticated(false);
      })
    }
    getUser();
  },[])

  return <>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/auth" element={<Auth/>}/>
        <Route path="/otp-verification/:email/:phone" element={<OtpVerification/>}/>
        <Route path="/password/forgot" element={<ForgotPassword/>}/>
        <Route path="/password/reset/:token" element={<ResetPassword/>}/>
        <Route path="/category/:category" element={<AllProduct />} />
        <Route path="/search" element={<AllProduct />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/wishlist" element={<Wishlist/>}/>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment/>}/>
        <Route path="/success" element={<Success />} />
        <Route path="/failure" element={<Failure />} />
        <Route path="/my-orders" element={<MyOrders/>} />
        <Route path="/order/:id" element={<OrderDetails/>}/>
        <Route path="/review" element={<ReviewPage/>}/>
        <Route path="/offers" element={<Offer/>}/>
      </Routes>
      <ToastContainer
        position="top-center"
        hideProgressBar
        closeButton={false}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        draggable={false}
        limit={1}
        transition={Slide}
        autoClose={1500}
        icon={false}
        toastStyle={{
          backgroundColor: "#333",
          color: "#fff",
          fontSize: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          minHeight: "50px",
          padding: "10px 10px",
        }}
        bodyStyle={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      />

    </Router>
  </>;
};

export default App;


