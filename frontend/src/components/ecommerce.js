import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Category from './category';
import ItemModal from './itemModal';

function Ecommerce(props) {
    const [productsByCategory, setProductsByCategory] = useState([]);
    const [productsByNull, setProductsByNull] = useState([]);
    const [totalWeight, setTotalWeight] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [modal, setModal] = useState(false);
    const [modalData, setModalData] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('');

    const selectCategory = (key) => {
        setSelectedCategory(key);
        let get_sub_category_url = process.env.REACT_APP_API_URL + 'controller/product_by_cat_id.php?cat_id=' + key;
        axios.get(get_sub_category_url)
            .then(res => {
                console.log(res.data);
                let cartdata = localStorage.getItem('cartdata');
                let cartdata_null = localStorage.getItem('cartdata_null');
                console.log(JSON.parse(cartdata));
                let total_amount = 0;
                let total_weight = 0;
                if (cartdata) {
                    if (res.data.results[0].id === JSON.parse(cartdata)[0].id) {
                        setProductsByCategory(JSON.parse(cartdata));
                        JSON.parse(cartdata).map(subcategory => {
                            subcategory.products.map(product => {
                                if (product.quantity) {
                                    total_weight += product.quantity * product.kg_estimation;
                                    total_amount += product.quantity * product.price;
                                }

                            })
                        })
                    }
                    else setProductsByCategory(res.data.results)
                }
                else setProductsByCategory(res.data.results)
                
                if (cartdata_null) {
                    setProductsByNull(JSON.parse(cartdata_null));
                    JSON.parse(cartdata_null).map(product => {
                        if (product.quantity) {
                            total_weight += product.quantity * product.kg_estimation;
                            total_amount += product.quantity * product.price;
                        }
                    })
                }
                else setProductsByNull(res.data.results_by_null);

                total_weight = Math.round(total_weight * 10000) / 10000;
                total_amount = Math.round(total_amount * 100) / 100;

                setTotalAmount(total_amount);
                setTotalWeight(total_weight);
            })
            .catch(err => {
                console.log(err)
            });
    }

    const toggle = () => setModal(!modal);

    const openModal = (key, product_key) => {
        if (key != null) {
            setModal(true);
            setModalData(productsByCategory[key].products[product_key]);
        }
        else {
            setModal(true);
            setModalData(productsByNull[product_key]);
        }
    }

    const unit_change = (e, key, product_key) => {
        console.log(e.target.value, key, product_key);
        let quantity = e.target.value;

        let temp_products = productsByCategory;
        let temp_products_by_null = productsByNull;
        if(key != null) {
            temp_products[key].products[product_key].quantity = quantity;
            setProductsByCategory(temp_products);
        }
        else {
            temp_products_by_null[product_key].quantity = quantity;
            setProductsByNull(temp_products_by_null);
        }

        let weight = 0;
        let amount = 0;
        temp_products.map(element => {
            element.products.map(product => {
                if (product.quantity) {
                    weight += product.quantity * product.kg_estimation;
                    amount += product.quantity * product.price
                }
            })
        })

        temp_products_by_null.map((product) => {
            if (product.quantity) {
                weight += product.quantity * product.kg_estimation;
                amount += product.quantity * product.price
            }
        })

        weight = Math.round(weight * 10000) / 10000;
        amount = Math.round(amount * 100) / 100;
        setTotalAmount(amount);
        setTotalWeight(weight);
    }

    const pay = () => {
        localStorage.setItem('cartdata', JSON.stringify(productsByCategory));
        localStorage.setItem('cartdata_null', JSON.stringify(productsByNull));
        localStorage.setItem('category', selectedCategory);
        props.history.push('/cart');
    }

    return (
        <div>
            <div className="header">
                <Category selectCategory={selectCategory} />
            </div>
            <div className="content">
                <div className="row">
                    {productsByNull.map((element, product_key) => {
                        return (
                            <div className="col-sm-4 mb-2" key={product_key}>
                                <h5 className="text-success product-name" onClick={() => openModal(null, product_key)}>{element.product_name} - <label className="text-danger">KES {element.price}</label></h5>
                                <div className="form-group row">
                                    <label className="col-3 col-form-label">Unit</label>
                                    <div className="col-5 col-xs-12">
                                        <input type="number" value={element.quantity ? element.quantity : ''} onChange={(e) => unit_change(e, null, product_key)} className="form-control" placeholder="0.00" min="0" step="0.01"></input>
                                    </div>
                                    <label className="col-3 col-form-label">{element.unit_name}</label>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {productsByCategory.map((subcategory, key) => {
                    if (subcategory.products.length > 0)
                        return (
                            <div key={key}>
                                <div className="row">
                                    <div className="col-md-12">
                                        <h4 className="mb-3">{subcategory.name}</h4>
                                        <hr />
                                    </div>
                                </div>
                                <div className="item row">
                                    {subcategory.products.map((product, product_key) => {
                                        return (
                                            <div className="col-sm-4 mb-2" key={product_key}>
                                                <h5 className="text-success product-name" onClick={() => openModal(key, product_key)}>{product.product_name} - <label className="text-danger">KES {product.price}</label></h5>
                                                <div className="form-group row">
                                                    <label className="col-3 col-form-label">Unit</label>
                                                    <div className="col-5 col-xs-12">
                                                        <input type="number" value={product.quantity ? product.quantity : ''} onChange={(e) => unit_change(e, key, product_key)} className="form-control" placeholder="0.00" min="0" step="0.01"></input>
                                                    </div>
                                                    <label className="col-3 col-form-label">{product.unit_name}</label>
                                                </div>
                                            </div>
                                        )
                                    })}

                                </div>
                            </div>
                        )
                })}

            </div>
            <div className="footer">
                <div className="row">
                    <button className="col-4 btn footer-item btn-success">Total Estimate Weight<br />{totalWeight}KG</button>
                    <button className="col-4 btn footer-item btn-success">Total Amount<br />{totalAmount}</button>
                    <button className="col-4 btn footer-item btn-success" onClick={pay}>Pay<i className="fas fa-arrow-right ml-1" aria-hidden="true"></i></button>
                </div>
            </div>
            <ItemModal toggle={toggle} modal={modal} modalData={modalData} />
        </div>
    )
}

export default Ecommerce;