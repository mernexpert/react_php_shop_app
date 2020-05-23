import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Cart(props) {
    const [cartData, setCartData] = useState([]);
    const [nullCartData, setNullCartData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalWeight, setTotalWeight] = useState(0);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [pickup, setPickUp] = useState(true);
    const [delivery, setDelivery] = useState(false);
    const [location_arr, setLocation_arr] = useState([]);
    const [delivery_arr, setDelivery_arr] = useState([]);
    const [pick_up_option, setPick_up_option] = useState('');
    const [delivery_option, setDelivery_option] = useState('');
    const [address, setAress] = useState('')

    useEffect(() => {
        let cart_data = JSON.parse(localStorage.getItem('cartdata'));
        let cart_data_null = JSON.parse(localStorage.getItem('cartdata_null'));
        console.log(cart_data_null, cart_data);
        if (cart_data || cart_data_null) {
            let weight = 0;
            let amount = 0;
            if (cart_data) {
                setCartData(cart_data);
                cart_data.map(element => {
                    element.products.map(product => {
                        if (product.quantity) {
                            weight += product.quantity * product.kg_estimation;
                            amount += product.quantity * product.price
                        }
                    })
                })
            }
            if (cart_data_null) {
                setNullCartData(cart_data_null);
                cart_data_null.map(product => {
                    if (product.quantity) {
                        weight += product.quantity * product.kg_estimation;
                        amount += product.quantity * product.price
                    }
                })
            }

            weight = Math.round(weight * 10000) / 10000;
            amount = Math.round(amount * 100) / 100;
            console.log(weight)
            setTotalAmount(amount);
            setTotalWeight(weight);
        }
        else props.history.push('/');

    }, []);

    useEffect(() => {
        let get_cart_data_url = `${process.env.REACT_APP_API_URL}/controller/get_cart_data.php`;
        axios.get(get_cart_data_url)
            .then(res => {
                console.log("I am here", res.data);
                setLocation_arr(res.data.location);
                setDelivery_arr(res.data.delivery);
            })
    }, [])

    const handle_change = (e, sub_key, product_key) => {
        console.log(e.target.value);
        let quantity = parseFloat(e.target.value);
        if (!e.target.value) quantity = 0;
        let temp_cart_data = cartData;
        let temp_cart_data_null = nullCartData;

        if (sub_key != null) {
            temp_cart_data[sub_key].products[product_key].quantity = quantity;
            setCartData(temp_cart_data);
        }
        else {
            temp_cart_data_null[product_key].quantity = quantity;
            setNullCartData(temp_cart_data_null);
        }


        let weight = 0;
        let amount = 0;
        temp_cart_data.map(element => {
            element.products.map(product => {
                if (product.quantity) {
                    weight += product.quantity * product.kg_estimation;
                    amount += product.quantity * product.price
                }
            })
        })

        temp_cart_data_null.map((product) => {
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

    const cart_pay = (event) => {
        event.preventDefault();
        let order_details = [];
        let temp_cart = cartData;
        let temp_cart_null = nullCartData;
        console.log(temp_cart);

        temp_cart.map(element => {
            element.products.map(product => {
                let each_detail = {};
                if (product.quantity) {
                    each_detail = {
                        item_id: product.id,
                        quantity: product.quantity,
                        price: product.price,
                        subtotal: product.price * product.quantity
                    };
                    order_details.push(each_detail);
                }
            })

        });

        temp_cart_null.map(product => {
            let each_detail = {};
            if (product.quantity) {
                each_detail = {
                    item_id: product.id,
                    quantity: product.quantity,
                    price: product.price,
                    subtotal: product.price * product.quantity
                };
                order_details.push(each_detail);
            }
        })

        if (order_details.length) {

            console.log(firstName, lastName, email, mobile, pick_up_option, delivery_option, address);
            if (pick_up_option && delivery_option) {
                let order = {
                    order_total: totalAmount,
                    order_weight: totalWeight,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phone: mobile,
                    pick_up_id: pick_up_option,
                    delivery_id: delivery_option,
                    address: address
                }

                let data = {
                    order: order,
                    order_details: order_details
                }
                console.log(data);
                let save_pay_url = `${process.env.REACT_APP_API_URL}/controller/save_pay_data.php`;
                axios.post(save_pay_url, data)
                    .then(res => {
                        console.log(res.data);
                        alert("successfully paid");
                        localStorage.removeItem('cartdata');
                        localStorage.removeItem('cartdata_null');
                        localStorage.removeItem('category');
                        props.history.push('/');
                    })
                    .catch((error) => {
                        if (error.response) {
                            console.log(error.response.data); // => the response payload
                        }
                    });
            }
            else alert("please select shipping detail");



        }
        else alert("please add quantity");
    }

    const handle_pickup_radio = () => {
        setPickUp(true);
        setDelivery(false);
        setDelivery_option('');
        setAress('');
    }

    const handle_delivery_radio = () => {
        setDelivery(true);
        setPickUp(false);
        setPick_up_option('');
    }

    return (
        <div className="container">
            <div className="mr-4 mt-2">
                <h3 className="mb-2 text-danger">Cart</h3>
                <div className="row mb-2 text-center">
                    <div className="col-4"><b>Product</b></div>
                    <div className="col-3"><b>Quantity</b></div>
                    <div className="col-2"><b>UNIT</b></div>
                    <div className="col-3"><b>SubTotal</b></div>
                </div>

                {nullCartData.map((product, key2) => {
                    if (product.quantity > 0) {
                        return (
                            <div className="row mb-2 align-items-center text-center" key={key2}>
                                <div className="col-4 text-success">{product.product_name}</div>
                                <input className="col-3 form-control text-center" type="number" min="0" placeholder="0.00" step="0.01" value={product.quantity} onChange={(e) => handle_change(e, null, key2)} />
                                <div className="col-2">{product.unit_code}</div>
                                <div className="col-3">{Math.round(product.quantity * product.price * 100) / 100}</div>
                            </div>
                        );
                    }
                })}

                {cartData.map((element, key1) => {
                    return element.products.map((product, key2) => {
                        if (product.quantity > 0) {
                            return (
                                <div className="row mb-2 align-items-center text-center" key={key2}>
                                    <div className="col-4 text-success">{product.product_name}</div>
                                    <input className="col-3 form-control text-center" type="number" min="0" placeholder="0.00" step="0.01" value={product.quantity} onChange={(e) => handle_change(e, key1, key2)} />
                                    <div className="col-2">{product.unit_code}</div>
                                    <div className="col-3">{Math.round(product.quantity * product.price * 100) / 100}</div>
                                </div>
                            );
                        }
                    })

                })}

                <div className="row mb-3 text-center">
                    <div className="col-4"></div>
                    <div className="col-3"><b>{totalWeight}KG</b></div>
                    <div className="col-2"></div>
                    <div className="col-3"><b>{totalAmount}KES</b></div>
                </div>

            </div>
            <hr />
            <form onSubmit={cart_pay}>
                <div className="mr-4 personal">
                    <div className="row mb-2">
                        <h3 className="col-12 text-danger">Personal Details</h3>
                    </div>
                    <div className="row ml-5">
                        <div className="col mb-3">
                            <input type="text" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name*" required />
                        </div>
                        <div className="col mb-3">
                            <input type="text" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name*" required />
                        </div>
                    </div>
                    <div className="row ml-5">
                        <div className="col mb-3">
                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email*" required />
                        </div>
                        <div className="col mb-3">
                            <input type="number" className="form-control" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Number*" required />
                        </div>
                    </div>
                </div>
                <hr />
                <div className="mr-4 shipping">
                    <div className="row mb-2">
                        <h3 className="col-12 text-danger">Shipping Details</h3>
                    </div>
                    <div className="row ml-5">
                        <div className="col-4 mb-3 ml-4 d-flex align-items-center">
                            <input type="radio" id="pickup" name="shipping" onClick={handle_pickup_radio} className="form-check-input mt-0" checked={pickup}></input>
                            <label className="form-check-label ml-1" htmlFor="pickup" style={{ fontSize: "18px" }}>Pick Up</label>
                        </div>
                        <div className="col-6 mb-3">
                            <select id="pickup" className="form-control" value={pick_up_option} onChange={(e) => setPick_up_option(e.target.value)} disabled={delivery} required={pickup}>
                                <option>Location</option>
                                {location_arr.map((location, key) => {
                                    return (
                                        <option key={key} value={location.id}>{location.location}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="row ml-5">
                        <div className="col-4 mb-3 ml-4 d-flex align-items-center">
                            <input type="radio" id="delivery" name="shipping" onClick={handle_delivery_radio} className="form-check-input mt-0" checked={delivery}></input>
                            <label className="form-check-label ml-1" htmlFor="delivery" style={{ fontSize: "18px" }}>Delivery</label>
                        </div>
                        <div className="col-6 mb-3">
                            <select id="delivery" className="form-control" value={delivery_option} onChange={(e) => setDelivery_option(e.target.value)} disabled={pickup} required={delivery}>
                                <option>Town, Country</option>
                                {delivery_arr.map((delivery, key) => {
                                    return (
                                        <option key={key} value={delivery.id}>{delivery.town}, {delivery.country}, {delivery.area}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="row ml-5">
                        <div className="col-4 ml-4">
                        </div>
                        <div className="col-6 mb-3">
                            <textarea className="form-control" placeholder="Address" value={address} onChange={(e) => setAress(e.target.value)} disabled={pickup} required={delivery}></textarea>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="mr-4 payment">
                    <div className="row mb-2">
                        <h3 className="col-12 text-danger">Payment Options</h3>
                    </div>
                    <div className="row ml-5">
                        <div className="col-4 mb-3 ml-4 d-flex align-items-center">
                            <input type="radio" id="mpesa" name="payment_option" className="form-check-input mt-0"></input>
                            <label className="form-check-label ml-1" htmlFor="mpesa" style={{ fontSize: "18px" }}>MPESA</label>
                        </div>
                    </div>
                    <div className="row ml-5">
                        <div className="col-4 mb-3 ml-4 d-flex align-items-center">
                            <input type="radio" id="pesapal" name="payment_option" className="form-check-input mt-0"></input>
                            <label className="form-check-label ml-1" htmlFor="pesapal" style={{ fontSize: "18px" }}>PESAPAL</label>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="mr-4 paybutton">
                    <div className="row mb-2 text-center">
                        <div className="col-9"></div>
                        <div className="col-3">
                            <button className="btn btn-success pay-button" type="submit">Pay</button>
                        </div>
                    </div>
                </div>
            </form>

        </div>
    )
}

export default Cart;