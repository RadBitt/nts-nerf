import React from 'react';
import { Match, Miss, Link } from 'react-router';
import RequestForm from './RequestForm';
import RequestStatus from './RequestStatus'; 
import Register from './Register';
import base from '../../base';

class Dashboard extends React.Component {

	constructor(props) {
		super(props);
		this.postRequest = this.postRequest.bind(this);
		this.state = {
			uid: null,
			displayName: null,
			requests: {},
			lastRequestKey: {}
		}
	}

	// Refresh component incase already logged in on request.
	componentDidMount() {
		// Set the state. 
		const path = `users/${this.props.uid}`;
		const ref = base.database().ref(path);
		ref.once('value', (snapshot) => {
			const data = snapshot.val() || {};
			if (!data.displayName) {
				console.log('No display name set'); 
			}
			this.setState({
			uid: this.props.uid,
			displayName: data.displayName
			});
		});
	}

	// Add request to state/firebase
	postRequest(ntsReq) {
		const uid = this.state.uid;
		const requests = this.state.requests;
		const timestamp = Date.now();
		const key = `request-${timestamp}`;
		const path = `users/${uid}/requests/${key}`;
		// push the request key and its data. 
		const ref = base.post(path, {
    data: ntsReq,
	    then(err){
	      if(!err){
	      	console.log(err); 
	      }
	    }
		});
		// set state
		requests[key] = ntsReq;
		this.setState({ 
			requests: requests,
			lastRequestKey: key
		});
	}

  render () {
		// If not logged in
  	if (!this.props.uid) {
  		return <div><Register authenticate={this.props.authenticate} /></div>
  	}

		// Logged In
  	// Client Buttons
  	const pathname = '/dashboard';
  	let location = this.props.params.location;
  			location = location == undefined ? '' : location = location;
  	const request = 					 <Link to={`${pathname}/request`}><button className="btn btn-lg btn-primary">New Request</button></Link>;
  	const activeRequests =  	 <Link to={`${pathname}/active`}><button className="btn btn-lg btn-primary">Active Requests</button></Link>;
  	const invoices = 					 <Link to={`${pathname}/invoices`}><button className="btn btn-lg btn-primary">Invoices</button></Link>;
  	const accountInformation = <Link to={`${pathname}/account`}><button className="btn btn-lg btn-primary">Account Information</button></Link>;
  	const vesselInformation =  <Link to={`${pathname}/vessel`}><button className="btn btn-lg btn-primary">Vessel Information</button></Link>;
  	const logout = 						 <button className="btn btn-lg btn-primary" onClick={this.props.logout}>Log Out!</button>;

    return(
    	<div className="top-row">
	    	<div className="row gradient-bg">
	        <div className="col-md-12">
	          <h1 className="dash-location">{`${pathname.slice(1)} > ${location = location == 'active' ? 'active requests' : location}`}</h1>
	          <h3>Hello {this.state.displayName}</h3>
	        </div>
	      </div>
		  	<div className="row no-border">
		  		<div className="col-md-10">
		  			{/* New Requests */}
		  			<Match pattern={`${pathname}/request/:key?`} render={(props) => (
			    		<RequestForm postRequest={this.postRequest} />
			    	)} />
			    	{/* Open Requests */}
			    	<Match pattern={`${pathname}/active/:key?`} render={(props) => (
			    		<RequestsActive />
						)} />
						{/* Invoices */}
			    	<Match pattern={`${pathname}/invoices/:key?`} render={(props) => (
			    		<Invoices />
						)} />
						{/* Account Information */}
						<Match pattern={`${pathname}/account/:key?`} render={(props) => (
							<Account />
						)} />
						{/* Vessel Information */}
						<Match pattern={`${pathname}/vessel/:key?`} render={(props) => (
							<Vessel />
						)} />
						{/* Request Status Information */}
						<Match pattern={`${pathname}/status/:key?`} render={(props) => (
			    		<RequestStatus ntsReq={this.state.requests[this.state.lastRequestKey]} />
						)} />
		  		</div>
		    	<div className="col-md-2 btn-group">
		        {/* NewRequest */}
		        {request}
		        {/* OpenRequests */}
		        {activeRequests}
		        {/* Invoices */}
		        {invoices}
	    			{/* Account Information */}
		    		{accountInformation}
		    		{/* Vessel Information */}
		    		{vesselInformation}
		    		{/* Logout */}
		    		{logout}
	    		</div>
	    	</div> 	
	    </div>
    )
  }
}

export default Dashboard;