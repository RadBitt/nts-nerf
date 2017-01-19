import React from 'react';
import { Match, Miss, Link } from 'react-router';
import Account from './Account';
import ClientNavigation from './ClientNavigation';
import DashHeading from '../DashHeading';
import Invoices from './Invoices';
import RequestForm from './RequestForm';
import RequestStatus from './RequestStatus';
import RequestsActive from './RequestsActive';
import Register from './Register';
import Vessels from './Vessels';
import base from '../../base';

class ClientDashboard extends React.Component {
		
		constructor(props) {
		super(props);
		this.postVessel = this.postVessel.bind(this);
		this.postRequest = this.postRequest.bind(this);
		this.fetchRequest = this.fetchRequest.bind(this);
		this.fetchInvoice = this.fetchRequest.bind(this);
		this.fetchVessel = this.fetchVessel.bind(this);
		this.state = {
			displayName: null,
			estimates: {},
			invoices: {},
			requests: {},
			vessels: {}
		}
	}

	// Update State & Sync
	componentWillMount() {
		// Set the state. 
		const path = `users/${this.props.uid}`;
		const ref = base.database().ref(path);
		ref.once('value', (snapshot) => {
			const data = snapshot.val() || {};
			this.setState({
				displayName: data.displayName
			});
		});
		this.ref = base.syncState('/requests', {
			context: this,
			state: 'requests',
			queries: {
				orderByChild: 'owner',
				equalTo: this.props.uid
			}
		});
		this.ref2 = base.syncState('/vessels', {
			context: this,
			state: 'vessels',
			queries: {
				orderByChild: 'owner',
				equalTo: this.props.uid
			}
		});
		this.ref3 = base.syncState(`/users/${this.props.uid}/invoices`, {
			context: this,
			state: 'invoices',
			queries: {
				orderByChild: 'date',
			}
		});
	}

	// Stop Syncing
	componentWillUnmount() {
		base.removeBinding(this.ref);
		base.removeBinding(this.ref2);
		base.removeBinding(this.ref3);
	}

	// Fetches request from state
	fetchRequest(key) {
		return this.state.requests[`request-${key}`];
	}

	fetchInvoice(key) {
		return this.state.invoices[`invoice-${key}`];
	}

	fetchVessel(key) {
		return this.state.vessels[`vessel-${key}`];
	}

	// Client Only???
	// Add request to state/firebase
	postRequest(ntsReq) {
		const uid = this.props.uid;
		const requests = this.state.requests;

		const key = `request-${ntsReq.id}`;
		const path = `requests/${key}`;
		if (uid == null)
			return;
		// push the request key and its data. 
		base.post(path, {
    data: ntsReq,
	    then(err){
	      if(!err){
	      	console.log(err); 
	      }
	    }
		});
		const vesselKey = `vessel-${ntsReq.vesselId}`;
		// update the vessel to active
		console.log(this.state.vessels);
		console.log(vesselKey);
		base.post(`/active-vessels/${vesselKey}`, {
    data: this.state.vessels[vesselKey],
	    then(err){
	      if(!err){
	        console.log(err);
	      }
	    }
		});
	}

	// Add vessel to state/firebase
	postVessel(ntsVes) {
		// if vessel exists?
		const key = `vessel-${ntsVes.id}`;
		const path = `vessels/${key}`;
		// push the request key and its data. 
		base.post(path, {
	    data: ntsVes,
		    then(err){
		      if(!err){
		      	console.log(err); 
		      }
		    }
		});
	}

	render() {

		const pathname = '/dashboard';
		const location = this.props.location;

		return(
			<div className="row gradient-bg">
				<div className="col-md-9 col-sm-12">
	        <div className="visible-sm visible-xs col-sm-12 btn-group">
		  			<ClientNavigation path={pathname} logout={this.props.logout} btnStyles={'sm'} />
		  		</div>
	        <DashHeading path={pathname} loc={location} displayName={this.state.displayName} />
	  			{/* Account Information */}
					<Match pattern={`${pathname}/account/:key?`} render={
						(props) => (
						<Account
							uid={this.props.uid}
						/>
					)} />
						{/* Estimates */}
		    	<Match pattern={`${pathname}/estimates/:key?`} render={
		    		(props) => (
	    			<Estimates
	    				estimates={this.state.estimates}
	    				{...props}
	    			/>
					)} />
	  			{/* Invoices */}
		    	<Match pattern={`${pathname}/invoices/:key?`} render={(props) => (
		    		<Invoices
		    			invoices={this.state.invoices}
		    			fetchInvoice={this.fetchInvoice}
		    			fetchVessel={this.fetchVessel}
		    		/>
					)} />
					{/* Requests Active */}
		    	<Match pattern={`${pathname}/active/:key?`} render={
		    		(props) => (
	    			<RequestsActive
	    				fetchVessel={this.fetchVessel}
	    				requests={this.state.requests} 
	    			/>
					)} />
	  			{/* Request Form */}
	  			<Match pattern={`${pathname}/request/:key?`} render={
	  				(props) => (
	    			<RequestForm 
	    				uid={this.props.uid}
	    				postRequest={this.postRequest}
	    				vessels={this.state.vessels}
	    			/>
		    	)} />
					{/* Request Status  */}
					<Match pattern={`${pathname}/status/:key?`} render={
						(props) => (
		    		<RequestStatus 
		    			fetchRequest={this.fetchRequest}
		    			fetchVessel={this.fetchVessel}
		    			{...props}
		    		/>
					)} />
					{/* Vessel Information */}
					<Match pattern={`${pathname}/vessels/:key?`} render={
						(props) => (
						<Vessels postVessel={this.postVessel} uid={this.props.uid} vessels={this.state.vessels} />
					)} />
	  		</div>
	  		<div className="hidden-sm hidden-xs col-md-3 btn-group client-nav-container">
			  	<ClientNavigation 
			  		path={pathname} 
			  		logout={this.props.logout}
			  		btnStyles={'md'} 
			  	/>
			  </div>
			</div> 
		)
	}
}
export default ClientDashboard