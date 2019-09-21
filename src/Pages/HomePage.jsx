import React from 'react';
import { userService, authenticationService } from '@/services';
import SelectSearch from 'react-select-search';
import BootstrapTable from 'react-bootstrap-table-next';
import { Button  } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ReactToPrint from 'react-to-print';

class HomePage extends React.Component {

  constructor(props) {
		super(props);

		this.state = {
			currentUser: authenticationService.currentUserValue,
			users: null,
      products: [],
      listProducts: [
        {name: 'Los vidrios', value: 'Los vidrios', "price": "50", "category": "cat1"},
        {name: 'Los Espejos', value: 'Los Espejos', "price": "60", "category": "cat2"},
      ],
      customers: [
        {name: 'el cliente1', value: 'sv', "discount": "1"},
        {name: 'Pris', value: 'svx', "discount": "2"},
        {name: 'felipa', value: 'felipa', "discount": "10"}
      ],
      customer: '',
      selectedProduct: '',
      discount: '0',
      category: '',
      price: '',
      selected: [],
      quantity: ''
		};

    this.addProduct = this.addProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleOnSelectAll = this.handleOnSelectAll.bind(this);
    this.onClientUpdate = this.onClientUpdate.bind(this);
    this.onDiscountUpdate = this.onDiscountUpdate.bind(this);
    this.onProductUpdate = this.onProductUpdate.bind(this);
    this.onQuantityUpdate = this.onQuantityUpdate.bind(this);
    this.onQuantityEnterKeyDown = this.onQuantityEnterKeyDown.bind(this);
	}
  onQuantityEnterKeyDown(e) {
    if (e.key === 'Enter') {
      this.addProduct(e);
    }
  }
	onQuantityUpdate(e) {this.setState({quantity : event.target.value}); }
  componentDidMount() { userService.getAll().then(users => this.setState({ users })); }
  onClientUpdate(e) { this.setState({discount:e.discount, customer: e.value}); }
  onProductUpdate(e) { this.setState({category:e.category, selectedProduct: e.value, price: e.price}); }
  addProduct(context) {
    var products = this.state.products;
    var missingField = false;
    if (!this.state.quantity && this.state.quantity <= 0) {
      toast.error("Por favor añade una cantidad de productos!", {
        position: toast.POSITION.TOP_RIGHT
      });
      missingField = true;
    }
    if (!this.state.selectedProduct) {
      toast.error("Por favor añade el producto a vender!", {
        position: toast.POSITION.TOP_RIGHT
      });
      missingField = true;
    }
    if (missingField) {
      return;
    }
    products.push( {
      id:products.length? products[products.length -1 ].id + 1: 1, 
      name: this.state.selectedProduct,
      price: this.state.price,
      category: this.state.category,
      quantity: this.state.quantity,
      subTotal: this.state.price * this.state.quantity
      } 
    );
    this.setState({products:products});
  }
  deleteProduct(context) {
    var products = this.state.products;
    var selected = this.state.selected;
    var newProducts;
    if (selected.length) {
      newProducts = products.filter(function(product) {
        return selected.indexOf(product.id) === -1;
      });      
      this.setState({ products: newProducts });
      this.setState({ selected: [] });
    }
  }
  handleOnSelect(row, isSelect) {
    if (isSelect) {
      this.setState(() => ({
        selected: [...this.state.selected, row.id]
      }));
    } else {
      this.setState(() => ({
        selected: this.state.selected.filter(x => x !== row.id)
      }));
    }
  }
  handleOnSelectAll(isSelect, rows) {
    const ids = rows.map(r => r.id);
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
  onDiscountUpdate(event) { this.setState({discount : event.target.value}); }

  render() {

    const { currentUser, users, products, listProducts, customers} = this.state;
    const columns = [
      {
        dataField: 'id',
        text: '#',
        footer:''
      }, {
        dataField: 'name',
        text: 'Producto',
        footer:''
      },{
        dataField: 'category',
        text: 'Categoria',
        footer:''
      }, {
        dataField: 'quantity',
        text: 'Cantidad',
        footer:''
      }, {
        dataField: 'price',
        text: 'Precio Unitario',
        footer:'Total Venta'
      }, {
        dataField: 'subTotal',
        text: 'Total',
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0)
      }
      ];
    
    const selectRowProp = {
      mode: 'checkbox',
      clickToSelect: true,
      selected: this.state.selected,
      onSelect: this.handleOnSelect,
      onSelectAll: this.handleOnSelectAll
     };

    const paginationOptions = {
      sizePerPage: 8,
      showTotal: true,
      hideSizePerPage: true,
      hidePageListOnlyOnePage: true
    };

  	return (
      <div>
        <div className="container">
          <div className="row" name="customerTitle" >
            <h4> Datos del cliente </h4>
            </div>
          <div className="row mb-3" name="customerForm">
            <div className="col col-md-auto">
              <SelectSearch 
                value={this.state.customer}
                options={customers}
                name="cliente"
                placeholder="Selecciona el cliente"
                onChange={this.onClientUpdate}/>
            </div>
            <div className="col-md-auto">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">Descuento Extra</span>
                </div>
                <input value={this.state.discount} 
                  onChange={this.onDiscountUpdate}
                  type="number" id="discount" className="form-control" placeholder="Agrega descuento"/>
                <ToastContainer />
                <div className="input-group-append">
                  <span className="input-group-text">%</span>
                </div>
              </div>
            </div>
            </div>
          <div className="row" name="productTitle">
            <h4> Producto a vender </h4>
            </div>
          <div className="row mb-3" name="productForm">
            <div className="col col-md-auto">
              <SelectSearch 
                options={listProducts} 
                name="producto" 
                placeholder="Selecciona el producto"
                value={this.state.selectedProduct}
                onChange={this.onProductUpdate} />
            </div>
            <div className="col-md-auto">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">Cantidad</span>
                </div>
                <input id="quantity" type="number" className="form-control" placeholder="Agrega la cantidad"
                 value={this.state.quantity} onChange={this.onQuantityUpdate} onKeyDown={this.onQuantityEnterKeyDown}/>
              </div>
            </div>
            <div className="col-md-auto">
              <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text">Categoria</span>
                </div>
                <input id="category" type="text" className="form-control" disabled value={this.state.category}/>
              </div>
            </div>
            <div className="col-md-auto">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">Precio Unitario</span>
                </div>
                <input id="price" type="number" className="form-control" disabled value={this.state.price}/>
              </div>
            </div>
            <div className="col float-right ">
              <Button variant="primary" className="float-right" onClick={ this.addProduct }>Agregar producto</Button>
            </div>
            </div>
          <div className="row" name="sellTitle">
            <h4> Productos en venta </h4>
            </div>
          <div name="sellForm">
            <Button variant="primary" className="float-right" onClick={ this.deleteProduct } >Eliminar producto</Button>
            <BootstrapTable keyField="id" 
              data={ products }
              deleteRow
              selectRow={ selectRowProp }
              columns={ columns }
              noDataIndication="No hay productos en venta"
              hover
              condensed
              pagination={ paginationFactory(paginationOptions) }
              />
            </div>
          <div id="printSection" className="printSection" ref={el => (this.componentRef = el)}>
            <img src="public/VitrozaLogo.png" className="printLogo"></img>
            <h2>Vitroza</h2>
            <h5>Distribución de vidrio plano</h5>
            <h6>Corregidora #1033 Col. Centro</h6>
            <h6>Morelia Mich. C.P. 58000</h6>
            <h6>Tel: 443 313 4997</h6>
            <h6>e-mail: alejandrogonzalez@vitroza.com.mx</h6>
            <br/>
            <br/>
            <label>Nombre del cliente: {this.state.customer}</label>
            <br/>
            <label>Descuento aplicado: {this.state.discount}%</label>
            <div className="printTable">
              <BootstrapTable
                keyField="id" 
                data={ products }
                columns={ columns }
                noDataIndication="No hay productos en venta"
                />
            </div>
          </div>
        </div>
        <div className="footer" name="sellTitle">
          <ReactToPrint
            onBeforeGetContent={() => {document.getElementById("printSection").style.display="block"}}
            onAfterPrint={() => {document.getElementById("printSection").style.display="none"}}
            trigger={() => <Button variant="primary" className="float-right btn-lg" onClick={ this.saveSellAndClean } >Completar venta e imprimir nota</Button>}
            content={() => this.componentRef}
          />
          <Button variant="primary" className="float-right btn-lg brandLogo" onClick={ this.saveSellAndClean } >Completar venta</Button>
        </div>
      </div>
  	);
  } 
}

export { HomePage };