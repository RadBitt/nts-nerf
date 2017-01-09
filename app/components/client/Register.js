import React from 'react';
import Carousel from '../Carousel';
import base from '../../base';

const Register = (props) => {
	return(
		<div>
			<Carousel />
			<div className="container main-content">
		  	<div className="main-row row">
		    	<div className="col-md-12">
						<nav className="login">
			        <h2>Register / Log In</h2>
			        <p>Sign in to manage your vessel's services</p>
			        <button className="github" onClick={() => props.authenticate('google')}>Log In with Google</button>
			        <button className="facebook" onClick={() => props.authenticate('facebook')} >Log In with Facebook</button>
			        <button className="twitter" onClick={() => props.authenticate('twitter')} >Log In with Email</button>
				    </nav>
				  </div>
				</div>
			</div>
		</div>
	)
}

export default Register; 


// 		<div className="container main-content">
// 			  <div className="row">
// 			    <div className="col-md-12">
// 			      <h1><small>Register and keep track of your requests.</small></h1>
// 			    </div>
// 			  </div>
// 			  <form className="form-horizontal row no-border">
// 			    <fieldset>
// 			      <legend>Register</legend>
// 			      <div className="col-md-6 col-sm-12">
// 			        <div className="form-group">
// 			          <label htmlFor="email" className="sr-only">Email</label>
// 			          <div className="col-md-10 col-sm-8">
// 			            <input type="email" className="form-control" placeholder="Email" />
// 			          </div>
// 			        </div>
// 			        <div className="form-group">
// 			          <label htmlFor="passWord1" className="sr-only">Password</label>
// 			          <div className="col-md-10 col-sm-8">
// 			            <input type="password" className="form-control" placeholder="Password" />
// 			          </div>
// 			        </div>
// 			        <div className="form-group">
// 			          <label htmlFor="passWord2" className="sr-only">Confirm Password</label>
// 			          <div className="col-md-10 col-sm-8">
// 			            <input type="password" className="form-control" placeholder="Confirm Password" />
// 			          </div>
// 			        </div>
// 			      </div>
// 			    </fieldset>
// 			  </form>
// 			</div>