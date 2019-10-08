import React from 'react';
import { Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import { ToastContainer, toast } from 'react-toastify';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { customerService } from '../services';

class Cliente extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			customers: [],
		  customerName: '' ,
      customerAddress:'',
      customerPhone: '',
      customerDiscount: 0,
      customerCompanyName: '', 
      selected: '',
      visibleUpdate: false,
      updateId: 0
		};
		this.onEnterKeyDown = this.onEnterKeyDown.bind(this);
		this.onFieldUpdate = this.onFieldUpdate.bind(this);
		this.addCustomer = this.addCustomer.bind(this);
		this.deleteCustomer = this.deleteCustomer.bind(this);
		this.onSelect = this.onSelect.bind(this);
		this.onSelectAll = this.onSelectAll.bind(this);
    this.onUpdateCustomer = this.onUpdateCustomer.bind(this);
    this.cleanCustomerForm = this.cleanCustomerForm.bind(this);
    this.updateCustomer = this.updateCustomer.bind(this);
    this.cancelUpdate = this.cancelUpdate.bind(this);
	}
  componentDidMount() {
    var _this = this;
    customerService.getAllCustomers().then(function(resp) {
      _this.setState({customers:resp.data});
    });
  }
	onEnterKeyDown(e) {
    if (e.key === 'Enter') {
      this.addCustomer(e);
    }
  }
  onFieldUpdate(e) {
  	if (e.target.id==='customerDiscount' && e.target.value > 100) {
  	  toast.warn("no se puede agregar un descuento mayor al 100%", {
        position: toast.POSITION.TOP_RIGHT
      });
      e.target.value = 0;
  	}
  	this.setState({
  		[e.target.id]: e.target.value
  	}); 
  }
  addCustomer(context) {
    var customers = this.state.customers;
    if (this.isInvalidCustomer(this.state)) {
      return;
    }
    var _this =  this;
    var newCustomer = {
      customerName: this.state.customerName,
      customerAddress: this.state.customerAddress,
      customerPhone: this.state.customerPhone,
      customerDiscount: this.state.customerDiscount,
      customerCompanyName: this.state.customerCompanyName
    };
    customerService.addCustomer(newCustomer).then(function (customer) {
      newCustomer._id = customer._id;
      customers.push(newCustomer);
      _this.setState({customers:customers});
      _this.cleanCustomerForm();
    });
  }
  updateCustomer() {
    var customers = this.state.customers;
    if (this.isInvalidCustomer(this.state)) {
      return;
    }
    var updatedCustomer = {
      _id: this.state.updateId,
      customerName: this.state.customerName,
      customerAddress: this.state.customerAddress,
      customerPhone: this.state.customerPhone,
      customerDiscount: this.state.customerDiscount,
      customerCompanyName: this.state.customerCompanyName
    };

    var updatedCustomers = customers.filter(function(customer) {
      return customer._id !== updatedCustomer._id;
    });
    updatedCustomers.push(updatedCustomer);  
    this.setState({
      customers: updatedCustomers,
      updateId: 0,
      visibleUpdate: false
    });
    this.cleanCustomerForm();
    customerService.updateCustomer(updatedCustomer);
  }
  cleanCustomerForm() {
    this.setState( {
      customerName: '' ,
      customerAddress:'',
      customerPhone: '',
      customerDiscount: 0,
      customerCompanyName: '', 
    });
  }
  isInvalidCustomer(state) {
  	var missingField = false;
  	if (!state.customerName && !state.customerCompanyName)  {
      toast.error("Por favor añade el nombre del cliente o el nombre de la compañia :D", {
        position: toast.POSITION.TOP_RIGHT
      });
      missingField = true;
    }
		return missingField;
  }
  deleteCustomer(context) {
    var customers = this.state.customers;
    var selected = this.state.selected;
    var newCustomers;
    customerService.deleteCustomer(selected);
    if (selected.length) {
      newCustomers = customers.filter(function(customer) {
        return selected.indexOf(customer._id) === -1;
      });      
      this.setState({
        selected: [],
        customers: newCustomers
      });
    }
  }
  onUpdateCustomer() {
    var customers = this.state.customers;
    var selected = this.state.selected;
    var customerToUpdate;
    if (selected.length == 1) {
      customerToUpdate = customers.filter(function(customer) {
        return selected.indexOf(customer._id) > -1;
      });
      this.setState({
        selected: [],
        visibleUpdate: true,
        customerName: customerToUpdate[0].customerName ,
        customerAddress: customerToUpdate[0].customerAddress,
        customerPhone: customerToUpdate[0].customerPhone,
        customerDiscount: customerToUpdate[0].customerDiscount,
        customerCompanyName: customerToUpdate[0].customerCompanyName, 
        updateId: customerToUpdate[0]._id
      });
    }
  }
  cancelUpdate() {
    this.cleanCustomerForm();
    this.setState({
      updateId: 0,
      visibleUpdate: false,
    });
  }
  onSelect(row, isSelect) {
    if (isSelect) {
      this.setState(() => ({
        selected: [...this.state.selected, row._id]
      }));
    } else {
      this.setState(() => ({
        selected: this.state.selected.filter(x => x !== row._id)
      }));
    }
  }
  onSelectAll(isSelect, rows) {
    const ids = rows.map(r => r._id);
    if (isSelect) {
      this.setState(() => ({
        selected: ids
      }));
    } else {
      this.setState(() => ({
        selected: []
      }));
    }
  }
	render() {
		const { customers } = this.state;
		const selectRowProp = {
			mode: 'checkbox',
			clickToSelect: true,
			selected: this.state.selected,
			onSelect: this.onSelect,
			onSelectAll: this.onSelectAll
		};
		const columns = [
			{
				dataField: '_id',
				text: 'Id',
        hidden: true
			}, {
				dataField: 'customerName',
				text: 'Nombre'
			}, {
				dataField: 'customerCompanyName',
				text: 'Compañia'
			}, {
				dataField: 'customerAddress',
				text: 'Direccion'
			},{
        dataField: 'customerAddress',
        text: 'Ciudad'
      }, {
				dataField: 'customerPhone',
				text: 'Telefono'
			}, {
				dataField: 'customerDiscount',
				text: 'Descuento base'
			}
		];
    const paginationOptions = {
      sizePerPage: 14,
      showTotal: true,
      hideSizePerPage: true,
      hidePageListOnlyOnePage: true
    };

		return (
			<div>
				<div className="container">
					<div className="row" name="customersTitle">
						<h4> Cliente a agregar</h4>
						<ToastContainer/>
					</div>
					<div className="row mb-3" name="customersForm1">
						<div className="col-sm">
              <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text">Nombre</span>
                </div>
                <input id="customerName" type="text" className="form-control" placeholder="Agrega el nombre del cliente"
                	value={this.state.customerName} onChange={this.onFieldUpdate} onKeyDown={this.onEnterKeyDown}/>
              </div>
            </div>
            <div className="col-sm">
              <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text">Compañia</span>
                </div>
                <input id="customerCompanyName" type="text" className="form-control" placeholder="Agrega el nombre de la compañia"
                	value={this.state.customerCompanyName} onChange={this.onFieldUpdate} onKeyDown={this.onEnterKeyDown}/>
              </div>
            </div>
					</div>
					<div className="row mb-3" name="customersForm">
            <div className="col-lg">
              <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text">Direccion</span>
                </div>
                <input id="customerAddress" type="text" className="form-control" placeholder="Agrega la direccion del cliente"
                	value={this.state.customerAddress} onChange={this.onFieldUpdate} onKeyDown={this.onEnterKeyDown}/>
              </div>
            </div>
            <div className="col-lg">
              <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text">Telefono</span>
                </div>
                <input id="customerPhone" type="text" className="form-control" placeholder="Agrega el telefono del cliente"
                	value={this.state.customerPhone} onChange={this.onFieldUpdate} onKeyDown={this.onEnterKeyDown}/>
              </div>
            </div>
            <div className="col-lg">
              <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text">Descuento</span>
                </div>
                <input max={100} id="customerDiscount" type="number" className="form-control" placeholder="Agrega el descuento del cliente"
                	value={this.state.customerDiscount} onChange={this.onFieldUpdate} onKeyDown={this.onEnterKeyDown}/>
                <div className="input-group-append">
                  <span className="input-group-text">%</span>
                </div>
              </div>
            </div>
            <div className="col float-right mb-3">
		          { !this.state.visibleUpdate && <Button variant="primary" className="float-right" onClick={ this.addCustomer }>Agregar cliente</Button>}
              { this.state.visibleUpdate && 
                <div>
                  <Button variant="primary" className="float-right separatorButtons" onClick={ this.cancelUpdate }>Cancelar</Button>
                  <Button variant="primary" className="float-right separatorButtons" onClick={ this.updateCustomer }>Actualizar cliente</Button>
                </div>
              }
		        </div>
					</div>
				  <div name="customersTable">
          	{ this.state.selected.length == 1 ?
              <div>
                <Button variant="primary" className="float-right separatorButtons" onClick={ this.deleteCustomer}>Eliminar</Button>          	
                <Button variant="primary" className="float-right separatorButtons" onClick={ this.onUpdateCustomer}>Actualizar</Button>            
          	  </div> : null}
            <BootstrapTable
              keyField="_id"
          		data = { customers }
          		selectRow = { selectRowProp }
          		columns = { columns }
          		noDataIndication = "No hay clientes en la lista"
          		hover
          		condensed 
              pagination={ paginationFactory(paginationOptions) }
          	/>
          </div>
				</div>
			</div>
		);
	}
}

export { Cliente };