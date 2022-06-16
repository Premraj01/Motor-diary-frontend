import React from "react";
import { Link, Navigate, Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
	const adminLogin = useSelector((state) => state.adminLogin);
	const { adminInfo } = adminLogin;
	return adminInfo ? children : <Redirect exact to='/admin/login' />;
};

export default PrivateRoute;
