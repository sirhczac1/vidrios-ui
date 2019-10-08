import React from 'react';
import { Button  } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { ToastContainer, toast } from 'react-toastify';
import { productService } from '../services';

class Inventario extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			products: [],
			name:'',
			category:'',
			quantity: '',
			purchasePrice: '',
			salePrice:'',
			selected:[],
      visibleUpdate: false,
      newQuantity: ''
		};
		this.addProduct = this.addProduct.bind(this);
		this.onEnterKeyDown = this.onEnterKeyDown.bind(this);
		this.onFieldUpdate = this.onFieldUpdate.bind(this);
		this.deleteProduct = this.deleteProduct.bind(this);
	  this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleOnSelectAll = this.handleOnSelectAll.bind(this);
    this.onUpdateProduct = this.onUpdateProduct.bind(this);
    this.addQuantity = this.addQuantity.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
	}
  componentDidMount() {
    var _this = this;
    productService.getAllProduct().then(function(resp) {
      _this.setState({products:resp.data});
    });
  }
  onEnterKeyDown(e) {
    if (e.key === 'Enter') {
      this.addProduct(e);
    }
  }
  onFieldUpdate(e) {
    this.setState({
      [e.target.id]: e.target.value
    }); 
  }
  updateProduct() {
    var products = this.state.products;
    if (this.isInvalidProduct(this.state)) {
      return;
    }
    var updatedProduct = {
      _id: this.state.updateId,
      name: this.state.name,
      category: this.state.category,
      purchasePrice: this.state.purchasePrice,
      salePrice: this.state.salePrice,
      quantity: this.state.quantity
    };

    var updatedProducts = products.filter(function(product) {
      return product._id !== updatedProduct._id;
    });
    updatedProducts.push(updatedProduct);  
    this.setState({
      products: updatedProducts,
      updateId: 0,
      visibleUpdate: false
    });
    this.cleanProductForm();
    productService.updateProduct(updatedProduct);
  }
  addQuantity() {
    var oldProducts = this.state.products;
    var quantity = this.state.newQuantity;
    var selected = this.state.selected[0];
    if (!quantity || quantity < 0) {
      toast.error("Por favor añade una cantidad de productos a agregar (no puede ser 0)!", {
        position: toast.POSITION.TOP_RIGHT
      });
      return;
    }
    var productToUpdate = oldProducts.filter(function(product) {
      return selected === product._id;
    })[0];
    var updatedProducts = oldProducts.filter(function(product) {
      return productToUpdate._id !== product._id;
    });
    productToUpdate.quantity += parseInt(quantity);
    productService.addQuantity(productToUpdate._id, quantity);
    updatedProducts.push(productToUpdate);
    this.setState({
      products: []
    });
    this.setState({
      newQuantity:'',
      visibleUpdate: false,
      selected: [],
      products: updatedProducts
    });
  }
  onUpdateProduct() {
    var products = this.state.products;
    var selected = this.state.selected;
    var productToUpdate;
    if (selected.length == 1) {
      productToUpdate = products.filter(function(product) {
        return selected.indexOf(product._id) > -1;
      });
      this.setState({
        selected: [],
        visibleUpdate: true,
        name: productToUpdate[0].name ,
        category: productToUpdate[0].category,
        quantity: productToUpdate[0].quantity,
        purchasePrice: productToUpdate[0].purchasePrice,
        salePrice: productToUpdate[0].salePrice, 
        updateId: productToUpdate[0]._id
      });
    }
  }
  addProduct(context) {
    var products = this.state.products;
    var _this = this;
    if (this.isInvalidProduct(this.state)) {
      return;
    }
    var newProduct = {
      name: this.state.name,
      category: this.state.category,
      quantity: this.state.quantity,
      quantitySold: 0,
      quantityPurchased: this.state.quantity,
      purchasePrice: this.state.purchasePrice,
      salePrice: this.state.salePrice,
    };
    productService.addProduct(newProduct).then(function (product) {
      newProduct._id = newProduct._id;
      products.push( newProduct );
      _this.setState( { products : products } );
      _this.cleanProductForm();
    });
  }
  cleanProductForm() {
    this.setState({
      name:'',
      category:'',
      quantity: '',
      purchasePrice: '',
      salePrice:''
    });
  }
  isInvalidProduct(state) {
  	var missingField = false;
  	if (!state.quantity || state.quantity < 0) {
      toast.error("Por favor añade una cantidad de productos inicial (puede ser 0)!", {
        position: toast.POSITION.TOP_RIGHT
      });
      missingField = true;
    }
    if (!state.name) {
      toast.error("Por favor añade el nombre de producto!", {
        position: toast.POSITION.TOP_RIGHT
      });
      missingField = true;
    }
    if (!state.category) {
      toast.error("Por favor añade el nombre de categoria!", {
        position: toast.POSITION.TOP_RIGHT
      });
      missingField = true;
    }
    if (!state.purchasePrice || state.purchasePrice <=0 ) {
      toast.error("Por favor añade el precio de compra! (debe ser mayor a 0)", {
        position: toast.POSITION.TOP_RIGHT
      });
      missingField = true;
    }
    if (!state.salePrice || state.salePrice <= 0) {
      toast.error("Por favor añade el precio de venta! (debe ser mayor a 0)", {
        position: toast.POSITION.TOP_RIGHT
      });
      missingField = true;
    }
    return missingField;
  }
  deleteProduct(context) {
    var products = this.state.products;
    var selected = this.state.selected;
    var newProducts;
    if (selected.length) {
      newProducts = products.filter(function(product) {
        return selected.indexOf(product._id) === -1;
      });      
      this.setState({ products: newProducts });
      this.setState({ selected: [] });
    }
  }
  handleOnSelect(row, isSelect) {
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
  handleOnSelectAll(isSelect, rows) {
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
		const { products } = this.state;
    const selectRowProp = {
      mode: 'checkbox',
      clickToSelect: true,
      selected: this.state.selected,
      onSelect: this.handleOnSelect,
      onSelectAll: this.handleOnSelectAll
     };
    const columns = [
      {
        dataField: '_id',
        text: 'Id',
        hidden: true
      }, {
        dataField: 'name',
        text: 'Producto'
      },{
        dataField: 'category',
        text: 'Categoria'
      }, {
        dataField: 'quantity',
        text: 'Cantidad en Existencia'
      }, {
        dataField: 'quantitySold',
        text: 'Cantidad Vendida'
      }, {
        dataField: 'quantityPurchased',
        text: 'Cantidad Comprada'
      }, {
        dataField: 'purchasePrice',
        text: 'Precio de Compra'
      }, {
        dataField: 'salePrice',
        text: 'Precio de Venta'
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
					<div className="row" name="productTitle" >
            <h4> Producto a agregar </h4>
            <ToastContainer />
            </div>
          <div className="row mb-3" name="productForm1">
          	<div className="col">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">Producto</span>
                </div>
                <input id="name" type="text" className="form-control" placeholder="Agrega el nombre del producto"
                 value={this.state.name} onChange={this.onFieldUpdate} onKeyDown={this.onEnterKeyDown}/>
              </div>
            </div>
          </div>
          <div className="row mb-3" name="productForm">
            <div className="col-md-auto">
              <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text">Categoria</span>
                </div>
                <input id="category" type="text" className="form-control" placeholder="Agrega la Categoria"
                	value={this.state.category} onChange={this.onFieldUpdate} onKeyDown={this.onEnterKeyDown}/>
              </div>
            </div>
            <div className="col-md-auto">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">Cantidad</span>
                </div>
                <input id="quantity" type="number" className="form-control" placeholder="Agrega la cantidad"
                 value={this.state.quantity} onChange={this.onFieldUpdate} onKeyDown={this.onEnterKeyDown}/>
              </div>
            </div>
            <div className="col-md-auto">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">Precio de Compra</span>
                </div>
                <input id="purchasePrice" type="number" className="form-control" placeholder="Agrega el precio de Compra"
                	value={this.state.purchasePrice} onChange={this.onFieldUpdate} onKeyDown={this.onEnterKeyDown}/>
              </div>
            </div>
            <div className="col-md-auto">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">Precio de Venta</span>
                </div>
                <input id="salePrice" type="number" className="form-control" placeholder="Agrega el precio de venta"
                	value={this.state.salePrice} onChange={this.onFieldUpdate} onKeyDown={this.onEnterKeyDown}/>
              </div>
            </div>
            <div className="col float-right ">
              { !this.state.visibleUpdate && <Button variant="primary" className="float-right" onClick={ this.addProduct }>Agregar producto</Button>}
              { this.state.visibleUpdate  && <div>
                <Button variant="primary" className="float-right separatorButtons" onClick={ this.updateProduct }>Actualizar</Button>
                <Button variant="primary" className="float-right separatorButtons" onClick={ this.cancelUpdate }>Cancel</Button>
              </div>}
            </div>
          </div>
          <div name="sellForm">
            { this.state.selected.length ===1 ? 
              <div>
                <input id="newQuantity" type="number" className="form-control float-right col-md-2" placeholder="Agrega el nuevos articulos"
                  value={this.state.newQuantity} onChange={this.onFieldUpdate}/>
                <Button variant="primary" className="float-right separatorButtons" onClick={ this.addQuantity } >Agregar al inventario</Button>
                <Button variant="primary" className="float-right separatorButtons " onClick={ this.deleteProduct } >Eliminar</Button>
                <Button variant="primary" className="float-right separatorButtons" onClick={ this.onUpdateProduct } >Actualizar</Button>
              </div> : null}
            <BootstrapTable
              keyField="_id" 
              data={ products }
              selectRow={ selectRowProp }
              columns={ columns }
              noDataIndication="No hay productos en venta"
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

export { Inventario };