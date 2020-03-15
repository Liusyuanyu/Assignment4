class InventorySubhead extends React.Component {
    render() {
        const subhead = "Showing all available products";
        return (
            <div>{subhead}</div>
        );
    }
}

function ProductRow(props) {
    const product = props.product;
    return (
      <tr>
        <td id='body_pro_id'>{product.id}</td>
        <td>{product.Name}</td>
        <td>{'$'+product.Price}</td>
        <td>{product.Category}</td>
        <td><a href={product.Image} target="_blank">View</a></td>
      </tr>
    );
}

function ProductTable(props) {
    const productRows = props.products.map(product =>
      <ProductRow key={product.id} product={product} />
    );
    return (
      <table className="bordered-table">
        <thead>
          <tr>
            <th id='head_pro_id'>id</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {productRows}
        </tbody>
      </table>
    );
}

class ProductAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.productAdd;
    var pricedollar = form.priceper.value;
    var price =pricedollar.replace('$','');
    const product = {
      Name: form.name.value, Category: form.category.value,
      Price: price, Image: form.image_url.value
    };
    this.props.createProduct(product);
    form.reset();
  }
  render() {
    return (
      <form name="productAdd" onSubmit={this.handleSubmit}>
        <div class="grid_container">
          <div>
            <label>Category</label>
            <br/>
            <select type="text" name="category" selectedIndex={1}>
              <option value='Shirts'>Shirts</option>
              <option value='Jeans'>Jeans</option>
              <option value='Jackets'>Jackets</option>
              <option value='Sweaters'>Sweaters</option>
              <option value='Accessories'>Accessories</option>
            </select>
          </div>
          <div>
            <label>Price Per Unit</label>
            <br/>
            <input type="text" name="priceper" defaultValue={'$'}/>
          </div>
          <div>
            <label>Product Name</label>
            <br/>
            <input type="text" name="name"/>
          </div>
          <div>
            <label>Image URL</label>
            <br/>
            <input type="text" name="image_url"/>
          </div>
        </div>
        <br/>
        <button>Add Product</button>
      </form>
    );
  }
}

async function graphQLFetch(query, variables = {}) {
  const response = await fetch(window.ENV.UI_API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ query, variables })
  });
  const result = await response.json();
  return result.data;
}

class MyProductList extends  React.Component{
  constructor() {
    super();
    this.state = { products: [] };
    this.createProduct = this.createProduct.bind(this);
  }

  componentDidMount() {
    this.retrieveData();
  }

  async retrieveData() {
    const query = `query {
      productList {
        id Name Price Category Image
      }
    }`;
    const data = await graphQLFetch(query);
    this.setState({ products: data.productList });
  }

  async createProduct(product) {
    const query = `mutation productAdd($product: ProductInputs!) {
      productAdd(product: $product) {
        id
      }
    }`;
    const data = await graphQLFetch(query, { product });
    this.retrieveData();
  }
  
  render(){
    const head = "My Company Inventory";
    const addhead = "Add a new product to inventory";
    return(
        <React.Fragment>
            <h1>{head}</h1>
            <InventorySubhead/>
            <hr/><br/>
            <ProductTable products={this.state.products}/><br/>
            <label>{addhead}</label>
            <hr/>
            <ProductAdd createProduct = {this.createProduct}/>
        </React.Fragment>
    )
  }
}

const element =<MyProductList/>;
ReactDOM.render(element, document.getElementById('contents'));