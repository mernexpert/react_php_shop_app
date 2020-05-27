import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

function ItemModal({ modal, toggle, modalData }) {

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>{modalData.product_name}</ModalHeader>
                <ModalBody>
                    <div className="mb-2">
                        {modalData.image && <img className="modal-image" src={modalData.image} />}
                    </div>
                    <div>
                        <label><b>Description</b></label>
                        <div>
                            {modalData.description}
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </div>

    )
}

export default ItemModal;