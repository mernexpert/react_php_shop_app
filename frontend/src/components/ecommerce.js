import React, {useState, useEffect} from 'react';
import Category from './category';

function Ecommerce() {
    return(
        <div>
            <div className="header">
                <Category />
            </div>
            <div className="content">
                <div className="row">
                    <div className="col-sm-4 mb-2">
                        <h5 className="text-success product-name">Product <label className="text-danger">KES</label></h5>
                        <div className="form-group row">
                            <label className="col-3 col-form-label">Unit</label>
                            <div className="col-5 col-xs-12">
                                <input type="number" className="form-control" placeholder="0.00" min="0" step="0.01"></input>
                            </div>
                            <label className="col-3 col-form-label">Carton</label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer">
                <div className="row">
                    <button className="col-4 btn footer-item btn-success">Total Weight</button>
                    <button className="col-4 btn footer-item btn-success">Total Amount</button>
                    <button className="col-4 btn footer-item btn-success">Pay <i class="fas fa-arrow-right ml-1" aria-hidden="true"></i>a</button>
                </div>
            </div>  
        </div>
    )
}

export default Ecommerce;